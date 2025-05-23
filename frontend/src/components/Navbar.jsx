import React from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                QuickShareQR
              </h1>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <a 
              href="#features"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a 
              href="#how-it-works"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              How it works
            </a>
            <a 
              href="https://github.com/your-username/quickshare-qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How it works
            </a>
            <a
              href="https://github.com/your-username/quickshare-qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 