import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create singleton socket instance
let socket = null;
let listeners = new Map();

export const initSocket = () => {
  if (!socket) {
    console.log('Initializing socket connection to:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      timeout: 10000,
    });
    
    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket.id);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected. Reason:', reason);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        description: error.description,
        type: error.type,
        context: {
          url: SOCKET_URL,
          transportType: socket.io.engine.transport.name
        }
      });
    });

    socket.on('error', (error) => {
      console.error('Socket general error:', error);
    });
  }
  
  return socket;
};

export const joinSession = (sessionId) => {
  if (!socket || !socket.connected) {
    socket = initSocket();
  }
  
  socket.emit('joinSession', sessionId);
  console.log(`Joined session: ${sessionId}`);
};

export const onFilesAdded = (callback) => {
  if (!socket || !socket.connected) {
    socket = initSocket();
  }

  // Store the callback in our listeners map
  const key = 'filesAdded_' + Date.now();
  listeners.set(key, callback);
  
  socket.on('filesAdded', (data) => {
    callback(data);
  });
  
  return () => {
    if (socket) {
      socket.off('filesAdded');
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
  }
};

export default {
  initSocket,
  joinSession,
  onFilesAdded,
  disconnectSocket,
  getSocket: () => socket,
}; 