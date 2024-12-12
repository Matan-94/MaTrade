import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketOverview } from '../components/dashboard/MarketOverview';
import { RecentTrades } from '../components/dashboard/RecentTrades';
import { formatCurrency } from '../lib/utils';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/auth';

const portfolioValue = 125432.67;
const todayProfit = 1234.56;

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

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="py-6 space-y-6"
    >
      {/* Welcome Message */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Welcome back, {user.name}! 👋
        </motion.div>
      )}

      {/* Portfolio Overview */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500 p-8 rounded-2xl shadow-lg shadow-yellow-500/20"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-4 bg-white/20 backdrop-blur-lg rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Wallet className="w-8 h-8 text-black" />
              </motion.div>
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatCurrency(portfolioValue)}
                </motion.h2>
                <motion.p 
                  className="text-black/70 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Total Portfolio Value
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-xl">
                {todayProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-black" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-black" />
                )}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {todayProfit >= 0 ? '+' : ''}{formatCurrency(todayProfit)}
                  </p>
                  <p className="text-sm text-black/70">Today's Profit</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute top-1/2 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/4 w-48 h-48 bg-black/5 rounded-full blur-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      {/* Market Overview */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Market Overview
        </h2>
        <MarketOverview />
      </motion.div>

      {/* Recent Trades */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <RecentTrades />
      </motion.div>
    </motion.div>
  );
}