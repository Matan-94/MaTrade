import React from 'react';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl shadow-lg shadow-yellow-500/20"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-black font-bold text-xl">M</span>
        </motion.div>
      </div>
      <motion.div 
        className="ml-2 flex flex-col"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
          MaTrade
        </span>
        <span className="text-xs text-yellow-500/50">Crypto Trading Simulator</span>
      </motion.div>
    </motion.div>
  );
}