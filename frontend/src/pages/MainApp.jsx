import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Import components
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExportToMobile from '../components/ExportToMobile';
import ImportFromMobile from '../components/ImportFromMobile';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const MainApp = () => {
  const [activeSection, setActiveSection] = useState('hero');
  
  // Refs for scrolling to sections
  const exportSectionRef = useRef(null);
  const importSectionRef = useRef(null);
  
  // Handle scroll to export section
  const handleExportClick = () => {
    setActiveSection('export');
    exportSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  // Handle scroll to import section
  const handleImportClick = () => {
    setActiveSection('import');
    importSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero 
          onExportClick={handleExportClick} 
          onImportClick={handleImportClick}
        />
        
        {/* Export to Mobile Section */}
        <motion.div 
          ref={exportSectionRef}
          id="export-section"
          className={`${activeSection === 'export' ? 'bg-primary-50' : ''} transition-colors duration-300`}
        >
          <ExportToMobile />
        </motion.div>
        
        {/* Import from Mobile Section */}
        <motion.div 
          ref={importSectionRef}
          id="import-section"
          className={`${activeSection === 'import' ? 'bg-secondary-50' : ''} transition-colors duration-300`}
        >
          <ImportFromMobile />
        </motion.div>
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Mobile Upload Page Notice */}
        <div className="py-12 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need a mobile upload page?</h2>
            <p className="text-gray-700 mb-6">
              For a complete implementation, you would create a separate mobile-optimized page 
              at /mobile-upload that handles file selection and uploading from mobile devices. 
              This would be linked from the QR code in the Import from Mobile section.
            </p>
            <p className="text-gray-600 text-sm">
              The mobile page would accept the session ID from URL parameters and upload files 
              directly to your backend API.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainApp; 