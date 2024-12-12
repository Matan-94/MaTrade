import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { CandlestickChart } from '../components/trade/CandlestickChart';
import { OrderBook } from '../components/trade/OrderBook';
import { RecentTrades } from '../components/trade/RecentTrades';
import { AmountTypeToggle } from '../components/trade/AmountTypeToggle';
import { TradingInfo } from '../components/trade/TradingInfo';
import { QuickTrade } from '../components/trade/QuickTrade';
import { PriceAlerts } from '../components/trade/PriceAlerts';
import { formatCurrency } from '../lib/utils';
import { fetchKlines } from '../lib/api/rest/klines';
import { fetchOrderBook } from '../lib/api/rest/orderbook';
import { SUPPORTED_PAIRS } from '../lib/api/constants';
import { useBinanceStore } from '../lib/api/binance';

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

export default function Trade() {
  const [selectedPair, setSelectedPair] = useState(SUPPORTED_PAIRS[0]);
  const [timeframe, setTimeframe] = useState('1m');
  const [amountType, setAmountType] = useState<'asset' | 'usdt'>('asset');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: any[], asks: any[] }>({ bids: [], asks: [] });
  const { prices } = useBinanceStore();

  const currentPrice = prices[selectedPair]?.price || 0;
  const priceChange = prices[selectedPair]?.change || 0;
  const volume = prices[selectedPair]?.volume || 0;
  const high24h = prices[selectedPair]?.high || 0;
  const low24h = prices[selectedPair]?.low || 0;

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchKlines(selectedPair, timeframe);
        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    const loadOrderBook = async () => {
      try {
        const data = await fetchOrderBook(selectedPair);
        setOrderBook(data);
      } catch (error) {
        console.error('Error loading order book:', error);
      }
    };

    loadChartData();
    loadOrderBook();

    // Set up intervals for updates
    const chartInterval = setInterval(loadChartData, 60000); // Update chart every minute
    const orderBookInterval = setInterval(loadOrderBook, 5000); // Update order book every 5 seconds

    return () => {
      clearInterval(chartInterval);
      clearInterval(orderBookInterval);
    };
  }, [selectedPair, timeframe]);

  // Only set initial limit price when switching to limit order type
  useEffect(() => {
    if (orderType === 'limit' && !limitPrice) {
      setLimitPrice(currentPrice.toFixed(2));
    }
  }, [orderType]);

  // Reset limit price when changing pairs
  useEffect(() => {
    if (orderType === 'limit') {
      setLimitPrice(currentPrice.toFixed(2));
    }
  }, [selectedPair]);

  const handleOrderTypeChange = (type: 'market' | 'limit') => {
    setOrderType(type);
    if (type === 'limit') {
      setLimitPrice(currentPrice.toFixed(2));
    } else {
      setLimitPrice('');
    }
  };

  const handleQuickTrade = (tradeAmount: number, isBuy: boolean) => {
    // Implement quick trade logic here
    console.log(`Quick ${isBuy ? 'buy' : 'sell'} for $${tradeAmount}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6 space-y-6"
    >
      {/* Asset Selection and Trading Info */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value as typeof SUPPORTED_PAIRS[number])}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-yellow-500"
              >
                {SUPPORTED_PAIRS.map((pair) => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentPrice)}
                </p>
                <div className="flex items-center mt-1">
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <TradingInfo
            symbol={selectedPair}
            price={currentPrice}
            high24h={high24h}
            low24h={low24h}
            volume24h={volume}
            priceChange24h={priceChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trading Interface */}
        <div className="space-y-6">
          {/* Place Order */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Place Order
            </h3>

            {/* Order Type */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => handleOrderTypeChange('market')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  orderType === 'market'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => handleOrderTypeChange('limit')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  orderType === 'limit'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Limit
              </button>
            </div>

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Limit Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    placeholder="Enter limit price"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-4">
              <AmountTypeToggle
                amountType={amountType}
                onToggle={() => setAmountType(amountType === 'asset' ? 'usdt' : 'asset')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount ({amountType === 'asset' ? selectedPair.replace('USDT', '') : 'USDT'})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="trade-input"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 rounded-lg bg-green-500 text-white font-medium"
              >
                Buy {selectedPair.replace('USDT', '')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-3 rounded-lg bg-red-500 text-white font-medium"
              >
                Sell {selectedPair.replace('USDT', '')}
              </motion.button>
            </div>
          </div>

          {/* Quick Trade */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
            <QuickTrade
              currentPrice={currentPrice}
              onQuickTrade={handleQuickTrade}
            />
          </div>

          {/* Price Alerts */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
            <PriceAlerts />
          </div>
        </div>

        {/* Center and Right Columns - Chart and Market Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
            {/* Timeframe Selector */}
            <div className="flex space-x-2 mb-6">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    timeframe === tf.value
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <CandlestickChart
              data={chartData}
              symbol={selectedPair}
              currentPrice={currentPrice}
            />
          </div>

          {/* Order Book and Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Book
              </h3>
              <OrderBook
                bids={orderBook.bids}
                asks={orderBook.asks}
                lastPrice={currentPrice}
              />
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Trades
              </h3>
              <RecentTrades trades={[]} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}