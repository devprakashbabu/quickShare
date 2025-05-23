/**
 * Format file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file icon based on mime type
 * @param {string} mimeType - File MIME type
 * @returns {string} Icon name from Lucide React
 */
export const getFileIcon = (mimeType) => {
  if (!mimeType) return 'File';
  
  if (mimeType.startsWith('image/')) {
    return 'Image';
  } else if (mimeType.startsWith('video/')) {
    return 'Video';
  } else if (mimeType.startsWith('audio/')) {
    return 'Music';
  } else if (mimeType.includes('pdf')) {
    return 'FileText';
  } else if (
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType.includes('msword')
  ) {
    return 'FileText';
  } else if (
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('csv')
  ) {
    return 'Table';
  } else if (
    mimeType.includes('powerpoint') ||
    mimeType.includes('presentation')
  ) {
    return 'BarChart2';
  } else if (mimeType.includes('zip') || mimeType.includes('compressed')) {
    return 'Archive';
  } else {
    return 'File';
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if the device is a mobile phone
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Generate random alphanumeric string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}; 