import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ArrowLeft, File, Folder } from 'lucide-react';
import { uploadToSession } from '../services/api';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MobileUpload = () => {
  const [sessionId, setSessionId] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'folder'
  const [folderName, setFolderName] = useState('');
  const location = useLocation();
  
  // Parse sessionId from URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sid = queryParams.get('sessionId');
    if (sid) {
      setSessionId(sid);
    }
  }, [location]);
  
  // Connect to socket when sessionId is available
  useEffect(() => {
    if (!sessionId) return;
    
    const socket = io(API_URL);
    
    // Connect and join session
    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('joinSession', sessionId);
    });
    
    // Listen for errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Connection to server failed. Please try again.');
    });
    
    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [sessionId]);
  
  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFileList(Array.from(e.target.files));
    setError('');
  };

  const handleFolderSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFileList(Array.from(e.target.files));
    if (!folderName) {
      // Extract folder name from the first file's path
      const path = e.target.files[0].webkitRelativePath;
      const extractedFolderName = path.split('/')[0];
      setFolderName(extractedFolderName);
    }
    setError('');
  };
  
  const handleUpload = useCallback(async () => {
    if (!sessionId || fileList.length === 0) {
      setError('Please select files to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    setError('');
    
    try {
      // Create a map to track folder structure for folder uploads
      const fileMap = new Map();
      if (uploadMode === 'folder') {
        fileList.forEach(file => {
          const path = file.webkitRelativePath;
          fileMap.set(file.name, path);
        });
      }

      // Simulated progress intervals
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file);
        if (uploadMode === 'folder') {
          formData.append(`path_${file.name}`, file.webkitRelativePath);
        }
      });

      if (uploadMode === 'folder' && folderName) {
        formData.append('folderName', folderName);
      }
      
      const response = await uploadToSession(sessionId, fileList, uploadMode === 'folder' ? { folderName, fileMap } : undefined);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.success) {
        setUploadSuccess(true);
        setTimeout(() => setUploadComplete(true), 2000);
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (err) {
      setError('Error uploading files. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }, [sessionId, fileList, uploadMode, folderName]);
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  const renderProgressBar = () => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease-in-out' }}
        ></div>
      </div>
    );
  };
  
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
          <p className="text-gray-600 mb-6">No session ID provided. Please scan a valid QR code.</p>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }
  
  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Upload Successful</h1>
          <p className="text-gray-600 mb-6">
            Your {uploadMode === 'folder' ? 'folder' : 'files'} have been sent to the PC. You can close this page.
          </p>
          <div className="flex justify-center">
            <a href="/" className="btn btn-primary">Send More</a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
      <div className="max-w-md mx-auto">
        <a href="/" className="inline-flex items-center text-primary mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </a>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-center">QuickShareQR</h1>
          <p className="text-center text-gray-500 mb-6">Upload to your PC</p>

          {/* Upload Mode Toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => {
                setUploadMode('file');
                setFileList([]);
                setFolderName('');
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                uploadMode === 'file' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <File size={18} />
              Files
            </button>
            <button
              onClick={() => {
                setUploadMode('folder');
                setFileList([]);
              }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                uploadMode === 'folder' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Folder size={18} />
              Folder
            </button>
          </div>
          
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                {uploadMode === 'folder' ? (
                  <Folder size={48} className="mx-auto text-gray-400" />
                ) : (
                  <Upload size={48} className="mx-auto text-gray-400" />
                )}
              </div>
              
              <p className="mb-4 text-gray-600">
                {uploadMode === 'folder' 
                  ? 'Select a folder to upload to PC'
                  : 'Select files from your device to send to PC'
                }
              </p>

              {uploadMode === 'folder' && (
                <input
                  type="text"
                  placeholder="Folder Name (optional)"
                  className="input w-full mb-4"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              )}
              
              <input 
                type="file"
                id="file-upload"
                onChange={uploadMode === 'folder' ? handleFolderSelect : handleFileChange}
                multiple={uploadMode === 'file'}
                webkitdirectory={uploadMode === 'folder' ? "" : undefined}
                directory={uploadMode === 'folder' ? "" : undefined}
                className="hidden"
              />
              <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                Select {uploadMode === 'folder' ? 'Folder' : 'Files'}
              </label>
            </div>
            
            {fileList.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  {uploadMode === 'folder' 
                    ? `Folder: ${folderName || 'Selected Folder'} (${fileList.length} files)`
                    : `Selected Files (${fileList.length})`
                  }
                </h3>
                
                <ul className="max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-2">
                  {fileList.map((file, index) => (
                    <li key={index} className="py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <File size={16} className="text-gray-500 mr-2" />
                        <div className="overflow-hidden">
                          <p className="truncate font-medium text-sm">
                            {uploadMode === 'folder' 
                              ? file.webkitRelativePath
                              : file.name
                            }
                          </p>
                          <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-4">
                <p className="mb-2 text-center">{`Uploading... ${uploadProgress}%`}</p>
                {renderProgressBar()}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
                <CheckCircle size={16} className="mr-2" />
                Upload successful!
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={isUploading || fileList.length === 0}
              className={`btn btn-primary w-full mt-4 ${
                (isUploading || fileList.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : `Upload ${uploadMode === 'folder' ? 'Folder' : 'Files'} to PC`}
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>Session ID: {sessionId}</p>
            <p>Make sure your PC browser window is open</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileUpload; 