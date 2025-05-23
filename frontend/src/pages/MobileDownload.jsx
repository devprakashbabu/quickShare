import React, { useState, useEffect } from 'react';
import { ArrowDown, Download, ExternalLink, FileIcon, Share2, File } from 'lucide-react';

const MobileDownload = () => {
  const [fileInfo, setFileInfo] = useState({
    url: '',
    name: 'File',
    type: '',
    size: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Parse URL parameters to get file information
    const queryParams = new URLSearchParams(window.location.search);
    const url = queryParams.get('url');
    const name = queryParams.get('name') || 'File';
    const type = queryParams.get('type') || '';
    const size = queryParams.get('size') || 0;

    if (url) {
      setFileInfo({ url: decodeURIComponent(url), name, type, size });
    }
    
    setIsLoading(false);
  }, []);

  // Force download function using fetch API
  const forceDownload = async (url, filename) => {
    setDownloadStarted(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download the file. Please try again.');
    }
    setDownloadStarted(false);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Native share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileInfo.name,
          text: `Check out this file: ${fileInfo.name}`,
          url: fileInfo.url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support sharing
      alert('Sharing is not supported in your browser.');
    }
  };

  // Preview component based on file type
  const renderPreview = () => {
    if (!fileInfo.url) return null;

    if (fileInfo.type.startsWith('image/')) {
      return (
        <div className="bg-gray-50 rounded-lg p-2 mb-6 flex justify-center">
          <img 
            src={fileInfo.url} 
            alt={fileInfo.name} 
            className="max-h-[300px] rounded object-contain"
          />
        </div>
      );
    } else if (fileInfo.type.startsWith('video/')) {
      return (
        <div className="bg-gray-50 rounded-lg p-2 mb-6">
          <video 
            src={fileInfo.url} 
            controls 
            className="w-full rounded"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (fileInfo.type.startsWith('audio/')) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <audio 
            src={fileInfo.url} 
            controls 
            className="w-full"
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else {
      // For other file types, show a generic file icon
      return (
        <div className="bg-gray-50 rounded-lg p-8 mb-6 flex justify-center">
          <File size={64} className="text-gray-400" />
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!fileInfo.url) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Download Link</h1>
          <p className="text-gray-600 mb-6">The file you're trying to download is not available or the link is invalid.</p>
          <a href="/" className="btn btn-primary">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">QuickShareQR</h1>
        <p className="text-center text-gray-500 mb-6">Your file is ready for download</p>

        {renderPreview()}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 truncate" title={fileInfo.name}>
            {fileInfo.name}
          </h2>
          {fileInfo.size > 0 && (
            <p className="text-sm text-gray-500">
              Size: {formatFileSize(parseInt(fileInfo.size))}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Standard download button */}
          <a 
            href={fileInfo.url}
            download={fileInfo.name}
            className="btn btn-primary flex items-center justify-center w-full"
            onClick={(e) => {
              // On mobile Safari, download attribute might not work
              if (!navigator.userAgent.match(/iPhone|iPad|iPod/i)) return;
              e.preventDefault();
              forceDownload(fileInfo.url, fileInfo.name);
            }}
          >
            <Download size={18} className="mr-2" />
            Download File
          </a>
          
          {/* Force download button - works on all browsers */}
          <button 
            onClick={() => forceDownload(fileInfo.url, fileInfo.name)}
            disabled={downloadStarted}
            className="btn btn-secondary flex items-center justify-center w-full"
          >
            {downloadStarted ? (
              <>
                <span className="animate-spin mr-2">↻</span>
                Downloading...
              </>
            ) : (
              <>
                <ArrowDown size={18} className="mr-2" />
                Force Download
              </>
            )}
          </button>
          
          {/* Open in new tab button */}
          <a 
            href={fileInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center justify-center w-full"
          >
            <ExternalLink size={18} className="mr-2" />
            Open in Browser
          </a>
          
          {/* Share button (for supported browsers) */}
          <button 
            onClick={handleShare}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center w-full"
          >
            <Share2 size={18} className="mr-2" />
            Share File
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by QuickShareQR
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileDownload; 