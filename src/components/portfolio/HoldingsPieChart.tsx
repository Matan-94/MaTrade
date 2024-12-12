import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Holding {
  crypto: string;
  symbol: string;
  amount: number;
  value: number;
  profit: number;
}

interface HoldingsPieChartProps {
  holdings: Holding[];
}

const COLORS = [
  '#F7931A', // Bitcoin Orange
  '#627EEA', // Ethereum Blue
  '#00FFA3', // Solana Green
  '#3C3C3D', // Cardano Blue
  '#E84142', // Additional color if needed
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          {data.name} ({data.symbol})
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Value: {formatCurrency(data.value)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Share: {formatPercentage(data.percentage)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <motion.div
          key={`legend-${index}`}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {entry.payload.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatPercentage(entry.payload.percentage)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export function HoldingsPieChart({ holdings }: HoldingsPieChartProps) {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  
  const data = holdings.map((holding) => ({
    name: holding.crypto,
    symbol: holding.symbol,
    value: holding.value,
    percentage: (holding.value / totalValue) * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={2}
                stroke="rgba(255, 255, 255, 0.1)"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}