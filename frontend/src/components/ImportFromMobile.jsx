import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Download, RefreshCw, Loader2, FileDown, Archive } from 'lucide-react';

import { createSession, getSessionFiles } from '../services/api';
import { initSocket, joinSession, onFilesAdded, disconnectSocket, isSocketConnected } from '../services/socket';
import { formatFileSize, getFileIcon } from '../utils/helpers';

const ImportFromMobile = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize the session
  const handleCreateSession = async () => {
    setIsGeneratingQr(true);
    setError('');
    
    try {
      // First disconnect any existing socket
      handleResetSession();
      
      const sessionData = await createSession();
      setSession(sessionData);
      
      // Initialize socket and join session
      const socket = initSocket();
      if (socket) {
        setIsConnected(socket.connected);
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        
        // Wait for QR code to be visible before joining socket room
        setTimeout(() => {
          if (isSocketConnected()) {
            joinSession(sessionData.sessionId);
          }
        }, 500);
      }
      
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create session. Please try again.');
    } finally {
      setIsGeneratingQr(false);
    }
  };
  
  // Reset the session
  const handleResetSession = () => {
    disconnectSocket();
    setIsConnected(false);
    setSession(null);
    setReceivedFiles([]);
    setError('');
  };
  
  // Download all files as zip (placeholder)
  const handleDownloadAll = () => {
    alert('In a complete implementation, this would download all files as a zip.');
  };
  
  // Listen for files added via websocket
  useEffect(() => {
    if (!session) return;
    
    const socket = initSocket();
    if (socket) {
      setIsConnected(socket.connected);
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      
      if (socket.connected) {
        joinSession(session.sessionId);
      }
    }
    
    const removeListener = onFilesAdded((data) => {
      if (data.sessionId === session.sessionId) {
        setReceivedFiles(prevFiles => [...(prevFiles || []), ...(data.files || [])]);
      }
    });

    // Listen for session errors
    const handleSessionError = (error) => {
      console.error('Session error:', error);
      setError(error.error || 'Session error occurred');
      handleResetSession();
    };

    if (socket) {
      socket.on('sessionError', handleSessionError);
    }
    
    // Check if any files were already uploaded to this session
    const checkExistingFiles = async () => {
      try {
        setIsLoading(true);
        const response = await getSessionFiles(session.sessionId);
        if (response.success && response.session?.files) {
          setReceivedFiles(response.session.files || []);
        }
      } catch (err) {
        console.error('Error fetching session files:', err);
        setReceivedFiles([]);
        setError('Error fetching session files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingFiles();
    
    // Cleanup function
    return () => {
      if (removeListener) {
        removeListener();
      }
      if (socket) {
        socket.off('sessionError', handleSessionError);
        socket.off('connect');
        socket.off('disconnect');
      }
    };
  }, [session]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleResetSession();
    };
  }, []);
  
  // Generate the QR code value with the session URL
  const getQrValue = () => {
    if (!session) return '';
    
    // This URL would point to a mobile web page that handles the file upload
    const uploadUrl = `${window.location.origin}/mobile-upload?sessionId=${session.sessionId}`;
    return uploadUrl;
  };
  
  // Render a file item in the list
  const FileItem = ({ file }) => {
    const FileIcon = getFileIcon(file.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-2"
      >
        <div className="flex items-center">
          <FileDown className="text-primary-500 mr-3" />
          <div>
            <h4 className="font-medium text-gray-900 truncate max-w-xs">
              {file.name}
            </h4>
            <p className="text-gray-500 text-xs">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline p-2"
          title="Download file"
        >
          <Download size={18} />
        </a>
      </motion.div>
    );
  };
  
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Import from Mobile
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - QR Code */}
          <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {!session ? (
                <motion.div
                  key="generate-qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center w-64"
                >
                  <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 aspect-square w-64 flex items-center justify-center mb-6">
                    <Smartphone size={48} className="text-gray-400" />
                  </div>
                  
                  <button
                    onClick={handleCreateSession}
                    disabled={isGeneratingQr}
                    className="btn btn-secondary w-full flex items-center justify-center"
                  >
                    {isGeneratingQr ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Generate QR Code</>
                    )}
                  </button>
                  
                  <p className="text-gray-500 text-sm mt-4">
                    Scan with your mobile to send files
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="qr-code"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="text-center"
                >
                  <div className="bg-white rounded-xl shadow-soft p-6 w-64 mb-6">
                    <QRCodeSVG
                      value={getQrValue()}
                      size={220}
                      level="H"
                      includeMargin={false}
                      className="mx-auto"
                    />
                  </div>
                  
                  <button
                    onClick={handleResetSession}
                    className="btn btn-outline flex items-center justify-center mx-auto"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Generate New Code
                  </button>
                  
                  <p className="text-gray-500 text-sm mt-4">
                    Scan with your mobile to send files
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Right side - File list */}
          <div>
            <div className="bg-gray-50 rounded-xl p-6 min-h-[400px] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-gray-900">
                  Received Files
                </h3>
                
                {Array.isArray(receivedFiles) && receivedFiles.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    className="btn-accent p-2 rounded-md flex items-center text-xs"
                  >
                    <Archive size={14} className="mr-1" />
                    Download All
                  </button>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 size={32} className="text-primary-500 mb-4 animate-spin" />
                  <p className="text-gray-500">Checking for files...</p>
                </div>
              ) : !Array.isArray(receivedFiles) || receivedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  {session ? (
                    <>
                      <p className="mb-2">Waiting for files from mobile...</p>
                      <p className="text-xs">Scan the QR code with your mobile device</p>
                    </>
                  ) : (
                    <p>Generate a QR code to receive files</p>
                  )}
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[350px]">
                  {receivedFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                  ))}
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportFromMobile; 