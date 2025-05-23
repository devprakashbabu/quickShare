import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  QrCode,
  Smartphone,
  ArrowRight,
  FileDown,
  Scan,
  Send,
  MonitorSmartphone
} from 'lucide-react';

const HowItWorks = () => {
  const pcToMobileSteps = [
    {
      icon: <Upload size={32} className="text-secondary-600" />,
      title: 'Upload File',
      description: 'Select a file from your computer to upload to our secure cloud storage.'
    },
    {
      icon: <QrCode size={32} className="text-secondary-600" />,
      title: 'QR Code Generated',
      description: 'A QR code containing the download link is instantly created.'
    },
    {
      icon: <Smartphone size={32} className="text-secondary-600" />,
      title: 'Scan with Mobile',
      description: 'Use your mobile device to scan the QR code displayed on your PC screen.'
    },
    {
      icon: <FileDown size={32} className="text-secondary-600" />,
      title: 'Download on Mobile',
      description: 'The file automatically downloads or opens on your mobile device.'
    }
  ];

  const mobileToPcSteps = [
    {
      icon: <Scan size={32} className="text-primary-600" />,
      title: 'Generate Session',
      description: 'Click "Import from Mobile" on your PC to create a unique QR code session.'
    },
    {
      icon: <Smartphone size={32} className="text-primary-600" />,
      title: 'Scan with Mobile',
      description: 'Scan the QR code with your phone to establish a direct connection.'
    },
    {
      icon: <Send size={32} className="text-primary-600" />,
      title: 'Select Files on Mobile',
      description: 'Choose files from your mobile device to send to your PC.'
    },
    {
      icon: <MonitorSmartphone size={32} className="text-primary-600" />,
      title: 'View on PC',
      description: 'Files appear instantly on your PC screen, ready to download.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QuickShareQR makes transferring files between devices simple and intuitive. No apps to install, no accounts to create.
          </p>
        </motion.div>

        {/* PC to Mobile */}
        <div className="mb-20">
          <motion.h3 
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-secondary-600 to-secondary-400 bg-clip-text text-transparent">
              PC to Mobile Transfer
            </span>
          </motion.h3>

          <div className="relative">
            {/* Desktop view - Steps in a row with connecting lines */}
            <div className="hidden md:grid grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="absolute top-10 left-0 w-full h-0.5 bg-secondary-200 -z-10"></div>
              
              {pcToMobileSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-full p-4 shadow-soft mb-4 z-10">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile view - Steps in a column with arrows */}
            <div className="md:hidden space-y-6">
              {pcToMobileSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white rounded-full p-3 shadow-soft mr-4">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                  
                  {index < pcToMobileSteps.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="text-gray-300" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile to PC */}
        <div>
          <motion.h3 
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Mobile to PC Transfer
            </span>
          </motion.h3>

          <div className="relative">
            {/* Desktop view - Steps in a row with connecting lines */}
            <div className="hidden md:grid grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="absolute top-10 left-0 w-full h-0.5 bg-primary-200 -z-10"></div>
              
              {mobileToPcSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-full p-4 shadow-soft mb-4 z-10">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile view - Steps in a column with arrows */}
            <div className="md:hidden space-y-6">
              {mobileToPcSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white rounded-full p-3 shadow-soft mr-4">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                  
                  {index < mobileToPcSteps.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="text-gray-300" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 