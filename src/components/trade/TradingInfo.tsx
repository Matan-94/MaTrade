import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, TrendingUp, Volume2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface TradingInfoProps {
  symbol: string;
  price: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  priceChange24h: number;
}

export function TradingInfo({ symbol, price, high24h, low24h, volume24h, priceChange24h }: TradingInfoProps) {
  const stats = [
    {
      label: '24h High',
      value: formatCurrency(high24h),
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: '24h Low',
      value: formatCurrency(low24h),
      icon: TrendingUp,
      color: 'text-red-500',
    },
    {
      label: '24h Volume',
      value: volume24h.toFixed(2),
      icon: Volume2,
      color: 'text-yellow-500',
    },
    {
      label: '24h Change',
      value: `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`,
      icon: Clock,
      color: priceChange24h >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-yellow-500/10"
        >
          <div className="flex items-center space-x-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
          </div>
          <p className={`mt-1 text-lg font-semibold ${stat.color}`}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}