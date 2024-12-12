import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatCurrency } from '../lib/utils';

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  profit?: number;
}

export interface Position {
  symbol: string;
  amount: number;
  averagePrice: number;
  totalCost: number;
}

interface TradingState {
  balance: number;
  positions: Record<string, Position>;
  trades: Trade[];
  executeTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => boolean;
  getPortfolioValue: (currentPrices: Record<string, number>) => number;
  getTotalProfitLoss: (currentPrices: Record<string, number>) => number;
}

const INITIAL_BALANCE = 10000; // 10,000 USDT

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      positions: {},
      trades: [],

      executeTrade: (trade) => {
        const state = get();
        const total = trade.price * trade.amount;

        // For sells, check if we have enough of the asset
        if (trade.type === 'sell') {
          const position = state.positions[trade.symbol];
          if (!position || position.amount < trade.amount) {
            console.error('Insufficient assets for sale');
            return false;
          }
        }
        // For buys, check if we have enough USDT
        else if (total > state.balance) {
          console.error('Insufficient funds');
          return false;
        }

        const newTrade: Trade = {
          ...trade,
          id: Date.now().toString(),
          timestamp: Date.now(),
          total,
        };

        set((state) => {
          const newBalance = trade.type === 'buy' 
            ? state.balance - total
            : state.balance + total;

          const newPositions = { ...state.positions };
          const currentPosition = newPositions[trade.symbol] || {
            symbol: trade.symbol,
            amount: 0,
            averagePrice: 0,
            totalCost: 0,
          };

          if (trade.type === 'buy') {
            const newTotalCost = currentPosition.totalCost + total;
            const newAmount = currentPosition.amount + trade.amount;
            newPositions[trade.symbol] = {
              ...currentPosition,
              amount: newAmount,
              averagePrice: newTotalCost / newAmount,
              totalCost: newTotalCost,
            };
          } else {
            const remainingAmount = currentPosition.amount - trade.amount;
            if (remainingAmount > 0) {
              newPositions[trade.symbol] = {
                ...currentPosition,
                amount: remainingAmount,
                totalCost: currentPosition.averagePrice * remainingAmount,
              };
            } else {
              delete newPositions[trade.symbol];
            }
          }

          return {
            balance: newBalance,
            positions: newPositions,
            trades: [newTrade, ...state.trades],
          };
        });

        return true;
      },

      getPortfolioValue: (currentPrices) => {
        const state = get();
        const positionsValue = Object.values(state.positions).reduce(
          (total, position) => {
            const currentPrice = currentPrices[position.symbol] || 0;
            return total + (position.amount * currentPrice);
          },
          0
        );
        return state.balance + positionsValue;
      },

      getTotalProfitLoss: (currentPrices) => {
        const state = get();
        const initialValue = INITIAL_BALANCE;
        const currentValue = state.getPortfolioValue(currentPrices);
        return currentValue - initialValue;
      },
    }),
    {
      name: 'trading-storage',
    }
  )
);