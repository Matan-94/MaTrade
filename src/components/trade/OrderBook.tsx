import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../lib/utils';

interface OrderBookEntry {
  price: number;
  amount: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastPrice: number;
}

export function OrderBook({ bids, asks, lastPrice }: OrderBookProps) {
  const maxTotal = Math.max(
    ...bids.map(bid => bid.amount),
    ...asks.map(ask => ask.amount)
  );

  return (
    <div className="h-[400px] overflow-hidden">
      <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <div>Price (USDT)</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="space-y-1 mb-4">
        {asks.slice().reverse().map((ask, i) => (
          <motion.div
            key={`ask-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-3 gap-4 text-sm relative"
          >
            <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10" style={{
              width: `${(ask.amount / maxTotal) * 100}%`,
              left: 'auto',
              right: 0,
            }} />
            <div className="relative text-red-500 font-medium">
              {formatCurrency(ask.price)}
            </div>
            <div className="relative text-right text-gray-600 dark:text-gray-300">
              {ask.amount.toFixed(6)}
            </div>
            <div className="relative text-right text-gray-600 dark:text-gray-300">
              {(ask.price * ask.amount).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Last Price */}
      <div className="text-center py-2 mb-4">
        <motion.span
          key={lastPrice}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-lg font-bold text-yellow-500"
        >
          {formatCurrency(lastPrice)}
        </motion.span>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="space-y-1">
        {bids.map((bid, i) => (
          <motion.div
            key={`bid-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-3 gap-4 text-sm relative"
          >
            <div className="absolute inset-0 bg-green-500/5 dark:bg-green-500/10" style={{
              width: `${(bid.amount / maxTotal) * 100}%`,
              left: 'auto',
              right: 0,
            }} />
            <div className="relative text-green-500 font-medium">
              {formatCurrency(bid.price)}
            </div>
            <div className="relative text-right text-gray-600 dark:text-gray-300">
              {bid.amount.toFixed(6)}
            </div>
            <div className="relative text-right text-gray-600 dark:text-gray-300">
              {(bid.price * bid.amount).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}