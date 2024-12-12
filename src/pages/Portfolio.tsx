import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { HoldingsPieChart } from '../components/portfolio/HoldingsPieChart';

const holdings = [
  {
    crypto: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.75,
    value: 48574.08,
    profit: 12.5,
    color: '#F7931A',
  },
  {
    crypto: 'Ethereum',
    symbol: 'ETH',
    amount: 5.2,
    value: 18313.78,
    profit: -3.2,
    color: '#627EEA',
  },
  {
    crypto: 'Solana',
    symbol: 'SOL',
    amount: 45.8,
    value: 5654.21,
    profit: 8.7,
    color: '#00FFA3',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Portfolio() {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalProfit = holdings.reduce((sum, holding) => sum + (holding.value * holding.profit / 100), 0);
  const profitPercentage = (totalProfit / (totalValue - totalProfit)) * 100;

  const stats = [
    {
      label: 'Total Value',
      value: formatCurrency(totalValue),
      icon: Wallet,
      change: formatPercentage(profitPercentage),
      trend: profitPercentage >= 0 ? 'up' : 'down',
    },
    {
      label: 'Total Profit/Loss',
      value: formatCurrency(totalProfit),
      icon: DollarSign,
      change: formatPercentage(profitPercentage),
      trend: profitPercentage >= 0 ? 'up' : 'down',
    },
    {
      label: 'Best Performer',
      value: 'BTC',
      icon: TrendingUp,
      change: '+12.5%',
      trend: 'up',
    },
    {
      label: 'Worst Performer',
      value: 'ETH',
      icon: TrendingDown,
      change: '-3.2%',
      trend: 'down',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="py-6 space-y-6"
    >
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/5 dark:hover:shadow-yellow-500/10 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                stat.trend === 'up' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-500' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-500'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Portfolio Distribution */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Portfolio Distribution
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Asset allocation breakdown
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10"
            >
              <BarChart2 className="w-5 h-5 text-yellow-500" />
            </motion.div>
          </div>
          <HoldingsPieChart holdings={holdings} />
        </motion.div>

        {/* Holdings List */}
        <motion.div
          variants={item}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Holdings
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-lg transition-colors"
            >
              View History
            </motion.button>
          </div>

          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <motion.div
                key={holding.symbol}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/5 dark:hover:shadow-yellow-500/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${holding.color}20` }}
                    >
                      <span 
                        className="text-lg font-bold"
                        style={{ color: holding.color }}
                      >
                        {holding.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {holding.crypto}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {holding.amount} {holding.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(holding.value)}
                    </p>
                    <div className="flex items-center justify-end mt-1">
                      {holding.profit >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          holding.profit >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {formatPercentage(holding.profit)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar showing percentage of total portfolio */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(holding.value / totalValue) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: holding.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatPercentage((holding.value / totalValue) * 100)} of portfolio
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}