import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://quickshare-wwjh.onrender.com'
// || 'http://localhost:5000';

// Create singleton socket instance
let socket = null;
let listeners = new Map();
let isConnecting = false;

export const initSocket = () => {
  if (!socket && !isConnecting) {
    isConnecting = true;
    console.log('Initializing socket connection to:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['polling', 'websocket'],
      withCredentials: true,
      timeout: 10000,
      path: '/socket.io',
      autoConnect: true,
      forceNew: true,
      secure: true,
      rejectUnauthorized: false
    });
    
    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket.id);
      isConnecting = false;
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected. Reason:', reason);
      isConnecting = false;
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        description: error.description,
        type: error.type,
        context: {
          url: SOCKET_URL,
          transportType: socket.io?.engine?.transport?.name || 'unknown'
        }
      });
      isConnecting = false;
      
      // Try to reconnect with polling if websocket fails
      if (socket.io?.engine?.transport?.name === 'websocket') {
        socket.io.engine.transport.name = 'polling';
        socket.connect();
      }
    });

    socket.on('error', (error) => {
      console.error('Socket general error:', error);
      isConnecting = false;
    });

    // Add connection timeout handler
    setTimeout(() => {
      if (socket && !socket.connected) {
        console.log('Socket connection timeout, attempting to reconnect...');
        socket.connect();
      }
      isConnecting = false;
    }, 5000);
  }
  
  return socket;
};

export const isSocketConnected = () => {
  return socket?.connected || false;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const joinSession = (sessionId) => {
  const currentSocket = getSocket();
  if (!currentSocket) {
    console.error('Unable to join session: Socket not initialized');
    return;
  }
  
  if (!currentSocket.connected) {
    currentSocket.connect();
  }
  
  currentSocket.emit('joinSession', sessionId);
  console.log(`Joined session: ${sessionId}`);
};

export const onFilesAdded = (callback) => {
  const currentSocket = getSocket();
  if (!currentSocket) {
    console.error('Unable to listen for files: Socket not initialized');
    return () => {};
  }

  // Store the callback in our listeners map
  const key = 'filesAdded_' + Date.now();
  listeners.set(key, callback);
  
  currentSocket.on('filesAdded', (data) => {
    callback(data);
  });
  
  return () => {
    if (currentSocket) {
      currentSocket.off('filesAdded');
    }
    listeners.delete(key);
  };
};

export const disconnectSocket = () => {
  if (socket) {
    // Remove all listeners
    listeners.forEach((callback, key) => {
      if (socket) {
        socket.off('filesAdded');
      }
      listeners.delete(key);
    });
    
    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
};

export default {
  initSocket,
  joinSession,
  onFilesAdded,
  disconnectSocket,
  getSocket,
  isSocketConnected,
}; 