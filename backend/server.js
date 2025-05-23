require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const sequelize = require('./config/database');
const Session = require('./models/Session');
const { Op } = require('sequelize');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Database connection and sync
sequelize.sync().then(() => {
  console.log('Database connected and synced');
}).catch(err => {
  console.error('Database connection error:', err);
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB size limit
});

// Store active sessions for mobile to PC transfers
const activeSessions = new Map();

// File cleanup function - removes files older than the specified age
const cleanupOldFiles = (directory, maxAgeHours = 24) => {
  console.log(`Cleaning up files older than ${maxAgeHours} hours in ${directory}`);
  
  // Calculate the cutoff time
  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  
  try {
    // Read all files in the directory
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      try {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        
        // Check if it's a file (not a directory)
        if (stats.isFile()) {
          const fileAge = now - stats.mtime.getTime();
          
          // If file is older than the max age, delete it
          if (fileAge > maxAgeMs) {
            fs.unlinkSync(filePath);
            console.log(`Deleted old file: ${file}`);
          }
        } else if (stats.isDirectory() && file !== '.' && file !== '..') {
          // For directories, first try to clean files inside
          cleanupOldFiles(filePath, maxAgeHours);
          
          // Then check if directory is empty and remove if it is
          if (fs.readdirSync(filePath).length === 0) {
            fs.rmdirSync(filePath);
            console.log(`Removed empty directory: ${file}`);
          }
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
    
    console.log('Cleanup complete');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
};

// Set up periodic cleanup (every hour)
const cleanupInterval = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  cleanupOldFiles('./uploads', 24); // Delete files older than 24 hours
}, cleanupInterval);

// Also clean on server start
cleanupOldFiles('./uploads', 24);

// Routes
app.get('/', (req, res) => {
  res.send('QuickShareQR API is running');
});

// PC to Mobile - Upload file and get Cloudinary URL
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'quick-share-qr',
      public_id: `file_${Date.now()}`,
      // Set expiry if needed
      // invalidate: true,
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);
    console.log(`Deleted local file ${req.file.path} after Cloudinary upload`);

    // Return the secure URL for download
    return res.status(200).json({
      success: true,
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Try to clean up the file if it exists and there was an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Error uploading file' });
  }
});

// Upload folder and create a ZIP archive
app.post('/api/upload-folder', upload.array('files'), async (req, res) => {
  const tempFiles = [];
  const tempDirs = [];
  const zipFilePath = path.join('./uploads', `folder_${Date.now()}.zip`);
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const folderName = req.body.folderName || 'folder_' + Date.now();
    const folderPath = path.join('./uploads', folderName);
    
    // Create folder structure if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    tempDirs.push(folderPath);

    // Move uploaded files to the folder structure
    for (const file of req.files) {
      try {
        const relPath = req.body[`path_${file.originalname}`] || '';
        const destPath = path.join(folderPath, relPath);
        
        // Create subdirectories if needed
        if (relPath) {
          fs.mkdirSync(destPath, { recursive: true });
          tempDirs.push(destPath);
        }
        
        const destFilePath = path.join(destPath, file.originalname);
        fs.renameSync(file.path, destFilePath);
        tempFiles.push(destFilePath);
      } catch (err) {
        console.error(`Error processing file ${file.originalname}:`, err);
        throw err;
      }
    }

    // Create a ZIP file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      output.on('error', reject);
      
      archive.pipe(output);
      archive.directory(folderPath, false);
      archive.finalize();
    });

    // Upload ZIP to Cloudinary
    const result = await cloudinary.uploader.upload(zipFilePath, {
      resource_type: 'raw',
      folder: 'quick-share-qr/folders',
      public_id: `folder_${Date.now()}`,
    });

    // Clean up temporary files and folders
    cleanup();

    return res.status(200).json({
      success: true,
      fileUrl: result.secure_url,
      fileName: path.basename(zipFilePath),
      fileSize: result.bytes,
      fileType: 'application/zip',
      isFolder: true,
      folderName
    });
  } catch (error) {
    console.error('Folder upload error:', error);
    cleanup();
    return res.status(500).json({ error: 'Error uploading folder' });
  }

  // Cleanup function
  function cleanup() {
    try {
      // Clean up temporary files
      tempFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });

      // Clean up temporary directories in reverse order (deepest first)
      [...tempDirs].reverse().forEach(dir => {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      });

      // Remove the zip file if it exists
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
      }
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  }
});

// Generate session for Mobile to PC transfer
app.post('/api/create-session', async (req, res) => {
  try {
    const session = await Session.create({
      expiresAt: new Date(Date.now() + parseInt(process.env.FILE_EXPIRY_MINUTES || 10) * 60 * 1000)
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// Mobile uploads files to session
app.post('/api/session/:sessionId/upload', upload.array('files', 10), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findByPk(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    
    if (new Date() > session.expiresAt) {
      await session.destroy();
      return res.status(404).json({ error: 'Session expired' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const uploadedFiles = [];
    
    for (const file of req.files) {
      // Validate file size and content
      if (!file.size || file.size === 0) {
        continue; // Skip empty files
      }

      try {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: 'auto',
          folder: 'quick-share-qr/sessions',
          public_id: `session_${sessionId}_${Date.now()}_${uploadedFiles.length}`
        });
        
        fs.unlinkSync(file.path);
        
        const fileData = {
          id: uuidv4(),
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
          url: result.secure_url
        };
        
        uploadedFiles.push(fileData);
      } catch (uploadError) {
        console.error(`Error uploading file ${file.originalname}:`, uploadError);
        // Continue with other files even if one fails
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No valid files were uploaded' });
    }
    
    // Update session with new files
    session.files = [...(session.files || []), ...uploadedFiles];
    await session.save();
    
    // Notify connected clients
    io.to(sessionId).emit('filesAdded', {
      files: uploadedFiles,
      sessionId
    });
    
    return res.status(200).json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading to session:', error);
    // Clean up files if an error occurred
    if (req.files) {
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    return res.status(500).json({ error: 'Error uploading files to session' });
  }
});

// Clean up expired sessions
const cleanupExpiredSessions = async () => {
  try {
    const expiredSessions = await Session.findAll({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
    
    for (const session of expiredSessions) {
      await session.destroy();
    }
    
    console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
};

// Run session cleanup every minute
setInterval(cleanupExpiredSessions, 60000);

// Get session files
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findByPk(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    
    if (new Date() > session.expiresAt) {
      await session.destroy();
      return res.status(404).json({ error: 'Session expired' });
    }
    
    return res.status(200).json({
      success: true,
      session: {
        id: session.id,
        files: session.files,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return res.status(500).json({ error: 'Error fetching session' });
  }
});

// Socket.io connection handling
io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);
  
  // Client joins session
  socket.on('joinSession', async (sessionId) => {
    try {
      const session = await Session.findByPk(sessionId);
      if (session && new Date() <= session.expiresAt) {
        socket.join(sessionId);
        console.log(`Client ${socket.id} joined session ${sessionId}`);
        
        // Send current session files to the client
        socket.emit('filesAdded', {
          files: session.files || [],
          sessionId
        });
      } else {
        socket.emit('sessionError', { 
          error: 'Session not found or expired'
        });
      }
    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('sessionError', { 
        error: 'Error joining session'
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});