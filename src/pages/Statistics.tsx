import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart2, PieChart, Activity, Calendar } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../lib/utils';

const performanceData = [
  { date: '2024-03-01', value: 100000, trades: 15, winRate: 73 },
  { date: '2024-03-02', value: 102000, trades: 12, winRate: 67 },
  { date: '2024-03-03', value: 101500, trades: 18, winRate: 78 },
  { date: '2024-03-04', value: 103000, trades: 21, winRate: 71 },
  { date: '2024-03-05', value: 105000, trades: 16, winRate: 81 },
  { date: '2024-03-06', value: 104500, trades: 14, winRate: 64 },
  { date: '2024-03-07', value: 106000, trades: 19, winRate: 74 },
];

const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

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

export default function Statistics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');

  const stats = [
    {
      label: 'Total Trades',
      value: '156',
      change: '+12%',
      icon: Activity,
      trend: 'up',
    },
    {
      label: 'Win Rate',
      value: '68%',
      change: '+5%',
      icon: TrendingUp,
      trend: 'up',
    },
    {
      label: 'Best Trade',
      value: formatCurrency(2456.78),
      change: 'BTC/USDT',
      icon: BarChart2,
      trend: 'up',
    },
    {
      label: 'Worst Trade',
      value: formatCurrency(-876.54),
      change: 'ETH/USDT',
      icon: TrendingDown,
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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

      {/* Portfolio Performance Chart */}
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Portfolio Performance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your portfolio's growth over time
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {timeframes.map((timeframe) => (
              <motion.button
                key={timeframe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                }`}
              >
                {timeframe}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
                stroke="#6B7280"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
                stroke="#6B7280"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  'Portfolio Value',
                ]}
                labelFormatter={(date) =>
                  new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EAB308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Activity */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trading Activity
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <Bar dataKey="trades" fill="#EAB308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Win Rate Trend */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Win Rate Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                  stroke="#6B7280"
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  stroke="#6B7280"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Win Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#EAB308"
                  strokeWidth={2}
                  dot={{ fill: '#EAB308', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}