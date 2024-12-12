import { useState } from 'react';
import { OrderParams, OrderResult } from '../types/orders';
import { placeOrder } from '../lib/trading/orderExecution';
import { orderTracker } from '../lib/trading/orderTracking';
import { useBinanceStore } from '../lib/api/binance';

export function useOrderPlacement() {
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { prices } = useBinanceStore();

  const submitOrder = async (params: OrderParams): Promise<OrderResult | null> => {
    setIsPlacing(true);
    setError(null);

    try {
      // Get current market price for the symbol
      const currentPrice = prices[params.symbol]?.price;
      if (!currentPrice) {
        throw new Error('Unable to get current market price');
      }

      // If it's a market order, use current price
      if (params.type === 'market') {
        params.price = currentPrice;
      }

      const result = await placeOrder(params);

      if (!result.success) {
        throw new Error(result.error || 'Failed to place order');
      }

      // Track orders
      orderTracker.addOrder(result.mainOrder);
      if (result.takeProfitOrder) {
        orderTracker.addOrder(result.takeProfitOrder);
      }
      if (result.stopLossOrder) {
        orderTracker.addOrder(result.stopLossOrder);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsPlacing(false);
    }
  };

  return {
    submitOrder,
    isPlacing,
    error,
  };
}