import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { uploadFile, uploadFolder } from '../services/api';
import { Copy, Check, Upload, Download, ChevronDown, ChevronUp, Folder, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper function to build URL for mobile download page
const getMobileDownloadUrl = (fileData) => {
  const baseUrl = window.location.origin; 
  const downloadUrl = `${baseUrl}/download?url=${encodeURIComponent(fileData.url)}&name=${encodeURIComponent(fileData.name)}&type=${encodeURIComponent(fileData.type)}&size=${encodeURIComponent(fileData.size)}`;
  return downloadUrl;
};

const ExportToMobile = ({ sectionRef }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'folder'
  const [copySuccess, setCopySuccess] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  
  const handleFileSelect = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    try {
      // Upload progress simulation (since we don't have actual upload progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const response = await uploadFile(file);
      clearInterval(progressInterval);
      
      if (response.success) {
        setUploadProgress(100);
        setUploadedFile({
          name: response.fileName,
          url: response.fileUrl,
          size: response.fileSize,
          type: response.fileType
        });
      } else {
        console.error('Upload failed:', response.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFolderSelect = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    try {
      const files = Array.from(e.target.files);
      const dirName = folderName || 'Shared_Folder';
      
      // Create a map to track folder structure
      const fileMap = new Map();
      
      // Process each file to maintain folder structure
      files.forEach(file => {
        // webkitRelativePath contains the relative path inside the selected folder
        const path = file.webkitRelativePath;
        fileMap.set(file.name, path);
      });
      
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 400);
      
      const response = await uploadFolder(files, dirName, fileMap);
      clearInterval(progressInterval);
      
      if (response.success) {
        setUploadProgress(100);
        setUploadedFile({
          name: response.fileName,
          url: response.fileUrl,
          size: response.fileSize,
          type: response.fileType,
          isFolder: true,
          folderName: response.folderName || dirName
        });
      } else {
        console.error('Upload failed:', response.error);
      }
    } catch (error) {
      console.error('Error uploading folder:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const copyToClipboard = async () => {
    try {
      // Create URL for mobile download page
      const downloadUrl = getMobileDownloadUrl(uploadedFile);
      
      await navigator.clipboard.writeText(downloadUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

  return (
    <section id="export" className="py-16 px-4" ref={sectionRef}>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-16">
          {/* Left side form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl font-bold text-center md:text-left mb-6">Export to Mobile</h2>
            
            <p className="mb-8 text-gray-600">
              Upload a file or folder from your PC, then scan the QR code with your 
              mobile device to download it instantly.
            </p>

            {!uploadedFile ? (
              <>
                {/* Upload Mode Toggle */}
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => setUploadMode('file')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      uploadMode === 'file' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FileText size={18} />
                    File
                  </button>
                  <button
                    onClick={() => setUploadMode('folder')}
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

                {/* Upload UI */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadMode === 'file' ? (
                    <>
                      <div className="mb-4">
                        <Upload size={48} className="mx-auto text-gray-400" />
                      </div>
                      <p className="mb-4 text-gray-600">
                        Drag and drop a file here, or click to select a file from your computer
                      </p>
                      <div>
                        <input 
                          type="file" 
                          id="file-upload" 
                          ref={fileInputRef}
                          onChange={handleFileSelect} 
                          className="hidden" 
                        />
                        <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                          Select File
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Folder size={48} className="mx-auto text-gray-400" />
                      </div>
                      <p className="mb-4 text-gray-600">
                        Select a folder to upload its entire content
                      </p>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Folder Name (optional)"
                          className="input w-full mb-4"
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                        />
                        <input 
                          type="file" 
                          id="folder-upload" 
                          ref={folderInputRef}
                          onChange={handleFolderSelect}
                          webkitdirectory="true"
                          directory="true"
                          multiple
                          className="hidden" 
                        />
                        <label htmlFor="folder-upload" className="btn btn-primary cursor-pointer">
                          Select Folder
                        </label>
                      </div>
                    </>
                  )}
                </div>
                
                {isUploading && (
                  <div className="mt-4">
                    <p className="mb-2 text-center">{`Uploading... ${uploadProgress}%`}</p>
                    {renderProgressBar()}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">
                    {uploadedFile.isFolder ? "Folder Ready" : "File Ready"}
                  </h3>
                  <button 
                    onClick={resetUpload} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {uploadedFile.isFolder ? (
                    <Folder className="flex-shrink-0 text-primary" size={24} />
                  ) : (
                    <FileText className="flex-shrink-0 text-primary" size={24} />
                  )}
                  <div className="overflow-hidden">
                    <p className="font-medium truncate" title={uploadedFile.name}>
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <a 
                    href={uploadedFile.url} 
                    download={uploadedFile.name}
                    className="btn btn-outline flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download {uploadedFile.isFolder ? "Folder" : "File"}
                  </a>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="btn btn-outline flex items-center justify-center gap-2"
                  >
                    {copySuccess ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right side QR code */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-center">Scan QR Code</h3>
              
              {uploadedFile ? (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <QRCodeSVG 
                      value={getMobileDownloadUrl(uploadedFile)}
                      size={250}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"L"}
                      includeMargin={false}
                    />
                  </div>
                  <p className="mt-4 text-center text-gray-600">
                    Scan this code with your mobile device camera to download your {uploadedFile.isFolder ? "folder" : "file"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-[250px] h-[250px] bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-400 text-sm text-center p-4">
                      Upload a file or folder to generate a QR code for mobile download
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExportToMobile; 