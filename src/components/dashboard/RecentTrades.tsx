import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, TrendingUp, History } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { ViewAllTradesModal } from '../modals/ViewAllTradesModal';
import { Button } from '../ui/Button';

const recentTrades = [
  {
    id: 1,
    type: 'buy',
    crypto: 'BTC',
    amount: 0.05,
    price: 65432.10,
    timestamp: '2024-03-10T14:30:00Z',
    profit: 234.56,
    status: 'completed',
  },
  {
    id: 2,
    type: 'sell',
    crypto: 'ETH',
    amount: 1.5,
    price: 3521.88,
    timestamp: '2024-03-10T14:15:00Z',
    profit: -123.45,
    status: 'completed',
  },
  {
    id: 3,
    type: 'buy',
    crypto: 'SOL',
    amount: 10,
    price: 123.45,
    timestamp: '2024-03-10T14:00:00Z',
    profit: 567.89,
    status: 'completed',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function RecentTrades() {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-500/10 rounded-xl">
                <History className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your latest trading activities
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsViewAllOpen(true)}
              className="text-sm"
            >
              View All
            </Button>
          </div>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="divide-y divide-gray-100 dark:divide-gray-700"
        >
          {recentTrades.map((trade) => (
            <motion.div
              key={trade.id}
              variants={item}
              className="p-4 hover:bg-gray-50 dark:hover:bg-yellow-500/5 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    trade.type === 'buy' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-500' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {trade.type === 'buy' ? (
                    <ArrowUpRight className="w-6 h-6" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6" />
                  )}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <motion.p 
                      className="text-base font-semibold text-gray-900 dark:text-white truncate"
                      initial={false}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.2 }}
                    >
                      {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount} {trade.crypto}
                    </motion.p>
                    <motion.div 
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trade.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                      }`}>
                        {trade.status}
                      </span>
                    </motion.div>
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="flex items-center text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(trade.price)}
                        </span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                        <span className={`font-medium ${
                          trade.profit >= 0 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ViewAllTradesModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
      />
    </>
  );
}