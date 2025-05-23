import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Monitor,
  ArrowUpFromLine,
  ArrowDownToLine,
  Zap,
  Lock,
  QrCode,
  Repeat
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ArrowUpFromLine size={32} className="text-primary-600" />,
      title: 'PC to Mobile Transfer',
      description: 'Upload files, generate QR codes, and instantly transfer to your mobile device with a simple scan.'
    },
    {
      icon: <ArrowDownToLine size={32} className="text-primary-600" />,
      title: 'Mobile to PC Transfer',
      description: 'Scan a QR code on your PC, select files on your mobile, and they instantly appear on your computer.'
    },
    {
      icon: <Zap size={32} className="text-primary-600" />,
      title: 'Lightning Fast',
      description: 'No waiting for uploads or downloads. Files transfer as quickly as your network allows.'
    },
    {
      icon: <QrCode size={32} className="text-primary-600" />,
      title: 'QR-Powered',
      description: 'No complex setup or apps to install. Just scan a QR code and you\'re ready to transfer.'
    },
    {
      icon: <Lock size={32} className="text-primary-600" />,
      title: 'Secure',
      description: 'All transfers are secure and temporary. Files are automatically deleted after a short period.'
    },
    {
      icon: <Repeat size={32} className="text-primary-600" />,
      title: 'Bi-directional',
      description: 'Send files both ways between your devices with the same simple interface.'
    }
  ];

  return (
    <section id="features" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Powerful File Sharing Made Simple</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QuickShareQR gives you the fastest way to move files between your devices without cables, email, or messaging apps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1 mb-8 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-4">PC and Mobile, Connected</h3>
            <p className="text-gray-700">
              Break down the barriers between your devices. Whether you're sending 
              photos from your phone to your computer or documents from your PC to your 
              phone, QuickShareQR makes it seamless.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <Monitor size={120} className="text-gray-700" />
              <div className="absolute -right-6 -bottom-2">
                <Smartphone size={64} className="text-gray-700" />
              </div>
              <div className="absolute top-1/2 -right-2 w-10 h-0.5 bg-primary-500 transform rotate-45"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 