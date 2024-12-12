import { useState } from 'react';
import { useTradingStore } from '../store/trading';
import { useBinanceStore } from '../lib/api/binance';

export function useTrading(symbol: string) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const executeTrade = useTradingStore(state => state.executeTrade);
  const balance = useTradingStore(state => state.balance);
  const positions = useTradingStore(state => state.positions);
  const { prices } = useBinanceStore();

  const currentPrice = prices[symbol]?.price || 0;
  const currentPosition = positions[symbol];

  const handleTrade = async (type: 'buy' | 'sell') => {
    setError('');
    setIsLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const total = currentPrice * parsedAmount;

      if (type === 'buy' && total > balance) {
        throw new Error('Insufficient USDT balance');
      }

      if (type === 'sell' && (!currentPosition || parsedAmount > currentPosition.amount)) {
        throw new Error(`Insufficient ${symbol.replace('USDT', '')} balance`);
      }

      const success = executeTrade({
        symbol,
        type,
        amount: parsedAmount,
        price: currentPrice,
        total,
      });

      if (success) {
        setAmount('');
      } else {
        throw new Error('Trade execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    amount,
    setAmount,
    error,
    isLoading,
    handleTrade,
    currentPrice,
    balance,
    currentPosition,
  };
}