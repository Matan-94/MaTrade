import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface QuickTradeProps {
  currentPrice: number;
  onQuickTrade: (amount: number, isBuy: boolean) => void;
}

export function QuickTrade({ currentPrice, onQuickTrade }: QuickTradeProps) {
  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Quick Trade (USDT)
      </h3>
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((amount) => (
          <motion.div
            key={amount}
            className="flex-1 min-w-[100px] flex flex-col gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuickTrade(amount, true)}
              className="w-full px-2 py-1.5 bg-green-500/90 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3 h-3" />
              <span>{amount}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuickTrade(amount, false)}
              className="w-full px-2 py-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3 h-3" />
              <span>{amount}</span>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}