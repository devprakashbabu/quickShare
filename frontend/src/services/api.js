import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://quickshare-wwjh.onrender.com'
// 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * Upload a single file to the server
 * 
 * @param {File} file - The file to upload
 * @returns {Promise} The response data
 */
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      timeout: 0, // Disable timeout for file uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a folder to the server
 * 
 * @param {Array<File>} files - The files to upload
 * @param {string} folderName - The name of the folder
 * @param {Map<string, string>} fileMap - Map of file names to their relative paths
 * @returns {Promise} The response data
 */
export const uploadFolder = async (files, folderName, fileMap) => {
  try {
    const formData = new FormData();
    
    // Add folder name
    formData.append('folderName', folderName);
    
    // Add each file with its path information
    files.forEach(file => {
      formData.append('files', file);
      
      // Get the relative path from the fileMap or from webkitRelativePath
      const relativePath = fileMap?.get(file.name) || file.webkitRelativePath || '';
      const folderPath = relativePath.split('/').slice(0, -1).join('/');
      
      // Add path information for this file
      formData.append(`path_${file.name}`, folderPath);
    });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      timeout: 0, // Disable timeout for folder uploads
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    };
    
    const response = await api.post('/api/upload-folder', formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading folder:', error);
    throw error;
  }
};

/**
 * Create a new session for mobile to PC transfer
 * 
 * @returns {Promise} The response data with sessionId
 */
export const createSession = async () => {
  try {
    const response = await api.post('/api/create-session');
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Upload files from mobile to a session
 * 
 * @param {string} sessionId - The session ID
 * @param {Array<File>} files - The files to upload
 * @param {Object} options - Additional options for folder upload
 * @param {string} options.folderName - Name of the folder
 * @param {Map<string, string>} options.fileMap - Map of file names to their relative paths
 * @returns {Promise} The response data with uploaded files
 */
export const uploadToSession = async (sessionId, files, options = {}) => {
  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    const formData = new FormData();
    
    // Add folder information if it's a folder upload
    if (options.folderName) {
      formData.append('folderName', options.folderName);
    }
    
    // Add files and their paths
    files.forEach(file => {
      formData.append('files', file);
      
      // If it's a folder upload, add the path information
      if (options.fileMap && options.fileMap.has(file.name)) {
        formData.append(`path_${file.name}`, options.fileMap.get(file.name));
      }
    });
    
    const response = await api.post(
      `/api/session/${sessionId}/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
        timeout: 30000, // 30 second timeout
        maxContentLength: 50 * 1024 * 1024, // 50MB max size
        maxBodyLength: 50 * 1024 * 1024 // 50MB max size
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to session:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      sessionId
    });
    throw error;
  }
};

/**
 * Get files from a session
 * 
 * @param {string} sessionId - The session ID
 * @returns {Promise} The response data with session and files
 */
export const getSessionFiles = async (sessionId) => {
  try {
    const response = await api.get(`/api/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting session files:', error);
    throw error;
  }
};

export default {
  uploadFile,
  uploadFolder,
  createSession,
  getSessionFiles,
  uploadToSession,
}; 