import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Search, Calendar, Filter } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';

interface Trade {
  id: number;
  type: 'buy' | 'sell';
  crypto: string;
  amount: number;
  price: number;
  timestamp: string;
  profit: number;
  status: string;
}

interface ViewAllTradesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allTrades: Trade[] = [
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
  // Add more trades here...
];

export function ViewAllTradesModal({ isOpen, onClose }: ViewAllTradesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTrades = allTrades.filter(trade => {
    const matchesSearch = trade.crypto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'buy' && trade.type === 'buy') ||
      (selectedFilter === 'sell' && trade.type === 'sell') ||
      (selectedFilter === 'profit' && trade.profit > 0) ||
      (selectedFilter === 'loss' && trade.profit < 0);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recent Trading Activity"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crypto..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="all">All Trades</option>
            <option value="buy">Buy Orders</option>
            <option value="sell">Sell Orders</option>
            <option value="profit">Profitable</option>
            <option value="loss">Loss</option>
          </select>
        </div>

        {/* Trades List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {filteredTrades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    trade.type === 'buy' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-500' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-500'
                  }`}>
                    {trade.type === 'buy' ? (
                      <ArrowUpRight className="w-6 h-6" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount} {trade.crypto}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(trade.price)}
                  </p>
                  <p className={`text-sm font-medium ${
                    trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No trades found matching your criteria
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}