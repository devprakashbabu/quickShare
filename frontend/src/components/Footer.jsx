import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              QuickShareQR
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Fast, secure, and QR-powered file sharing between PC and mobile devices.
              No login required, no file size limits, and completely free to use.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/your-username/quickshare-qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:contact@quickshareqr.com"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Tech stack */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {/* React */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                React.js
              </span>
              
              {/* Tailwind CSS */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700">
                Tailwind CSS
              </span>
              
              {/* Node.js */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                Node.js
              </span>
              
              {/* Express */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Express
              </span>
              
              {/* Socket.io */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                Socket.io
              </span>
              
              {/* QRCode */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                QRCode React
              </span>
              
              {/* Cloudinary */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                Cloudinary
              </span>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-600 hover:text-primary-600 text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-primary-600 text-sm">
                  About
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/your-username/quickshare-qr"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 text-sm"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickShareQR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 