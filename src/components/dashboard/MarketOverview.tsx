import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, RefreshCcw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import { useBinanceStore } from '../../lib/api/binance';
import { motion, AnimatePresence } from 'framer-motion';

export function MarketOverview() {
  const { prices, isLoading, error } = useBinanceStore();

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cryptoData = Object.values(prices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatePresence >
        {cryptoData.map((crypto) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/5 dark:hover:shadow-yellow-500/10 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <motion.h3 
                  className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  initial={false}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {crypto.symbol.replace('USDT', '')}
                </motion.h3>
                <div className="flex items-center mt-1">
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: crypto.change >= 0 ? 0 : 180,
                    }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`${
                      crypto.change >= 0 
                        ? 'text-green-500 dark:text-green-400' 
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {crypto.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </motion.div>
                  <motion.span
                    key={crypto.change}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`ml-1.5 text-sm font-medium ${
                      crypto.change >= 0 
                        ? 'text-green-500 dark:text-green-400' 
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {crypto.change >= 0 ? '+' : ''}{formatPercentage(crypto.change)}
                  </motion.span>
                </div>
              </div>
              <motion.div 
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-yellow-500/10 text-gray-600 dark:text-yellow-500"
                whileHover={{ scale: 1.05 }}
              >
                24h
              </motion.div>
            </div>

            <motion.div 
              className="space-y-3"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.p
                key={crypto.price}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {formatCurrency(crypto.price)}
              </motion.p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">24h High</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(crypto.high)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">24h Low</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(crypto.low)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {Number(crypto.volume).toLocaleString()} {crypto.symbol.replace('USDT', '')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}