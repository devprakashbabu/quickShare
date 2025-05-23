import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Main app components
import MainApp from './pages/MainApp';
import MobileDownload from './pages/MobileDownload';
import MobileUpload from './pages/MobileUpload';

// Initialize socket for real-time communication
import { initSocket } from './services/socket';

const App = () => {
  // Initialize socket connection
  React.useEffect(() => {
    initSocket();
    
    return () => {
      // Cleanup socket connection on unmount
      import('./services/socket').then(({ disconnectSocket }) => {
        disconnectSocket();
      });
    };
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/download" element={<MobileDownload />} />
        <Route path="/mobile-upload" element={<MobileUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
