import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../lib/utils';
import { format } from 'date-fns';

interface Trade {
  id: string;
  price: number;
  amount: number;
  time: number;
  isBuyer: boolean;
}

interface RecentTradesProps {
  trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <div className="h-[400px] overflow-y-auto">
      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <div>Price (USDT)</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
        <div className="text-right">Time</div>
      </div>

      <div className="space-y-1">
        {trades.map((trade) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-4 text-sm py-1 border-b border-gray-100 dark:border-gray-800"
          >
            <div className={`font-medium ${
              trade.isBuyer ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(trade.price)}
            </div>
            <div className="text-right text-gray-600 dark:text-gray-300">
              {trade.amount.toFixed(6)}
            </div>
            <div className="text-right text-gray-600 dark:text-gray-300">
              {(trade.price * trade.amount).toFixed(2)}
            </div>
            <div className="text-right text-gray-500 dark:text-gray-400">
              {format(trade.time, 'HH:mm:ss')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}