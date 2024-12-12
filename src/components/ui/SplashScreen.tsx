import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <div className="mb-8">
          <Logo />
        </div>
        <motion.div
          className="relative h-1.5 w-56 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-yellow-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p
          className="mt-6 text-yellow-400 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Connecting to market data...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}