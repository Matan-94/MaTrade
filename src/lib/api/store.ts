import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CryptoPrice } from './types';

interface BinanceStore {
  prices: Record<string, CryptoPrice>;
  isLoading: boolean;
  error: string | null;
  updatePrice: (price: CryptoPrice) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBinanceStore = create<BinanceStore>()(
  devtools(
    (set) => ({
      prices: {},
      isLoading: true,
      error: null,
      updatePrice: (price) =>
        set((state) => {
      
          let change = 0;
      
          if (price.low) {
            change = ((price.price - price.low) / price.low) * 100;
          }
      
          return {
            prices: {
              ...state.prices,
              [price.symbol]: {
                ...price,
                change: parseFloat(change.toFixed(2)), // Limit to 2 decimal places
                lastUpdate: Date.now(),
              },
            },
            isLoading: false,
          };
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'binance-store',
    }
  )
);

export type { BinanceStore };