import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Coins, RotateCw } from 'lucide-react';

interface AmountTypeToggleProps {
  amountType: 'asset' | 'usdt';
  onToggle: () => void;
}

export function AmountTypeToggle({ amountType, onToggle }: AmountTypeToggleProps) {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center">
          {amountType === 'asset' ? (
            <>
              <Coins className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Asset Amount</span>
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
              <span>USDT Amount</span>
            </>
          )}
        </div>
        <RotateCw className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </motion.button>
    </div>
  );
}