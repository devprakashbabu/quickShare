import React from 'react';
import { ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onExportClick, onImportClick }) => {
  return (
    <motion.section 
      className="py-16 sm:py-24 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            QuickShareQR:
          </span>{' '}
          <span className="block mt-2">Instant File Sharing Between PC and Mobile</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Upload, Scan & Transfer – Fast, Secure, and QR-powered
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={onExportClick}
            className="btn-primary rounded-xl px-8 py-4 text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <ArrowUpFromLine className="w-5 h-5" />
            <span>Export to Mobile</span>
          </button>
          
          <button
            onClick={onImportClick}
            className="btn-secondary rounded-xl px-8 py-4 text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <ArrowDownToLine className="w-5 h-5" />
            <span>Import from Mobile</span>
          </button>
        </motion.div>
        
        <motion.p 
          className="text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          No login required – Just scan and go!
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Hero; 