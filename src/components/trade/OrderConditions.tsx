import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface OrderConditionsProps {
  currentPrice: number;
  stopLoss: string;
  takeProfit: string;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
  showConditions: boolean;
  onToggleConditions: () => void;
}

export function OrderConditions({
  currentPrice,
  stopLoss,
  takeProfit,
  onStopLossChange,
  onTakeProfitChange,
  showConditions,
  onToggleConditions,
}: OrderConditionsProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggleConditions}
        className="text-sm font-medium text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400"
      >
        {showConditions ? 'Hide' : 'Add'} Stop Loss / Take Profit
      </button>

      {showConditions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stop Loss (optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => onStopLossChange(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder={`Below ${currentPrice}`}
                step="0.01"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter price to automatically sell if price falls below this level
            </p>
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Take Profit (optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => onTakeProfitChange(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder={`Above ${currentPrice}`}
                step="0.01"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter price to automatically sell if price rises above this level
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}