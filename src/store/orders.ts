import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderCondition } from '../types/trading';

interface OrdersState {
  activeOrders: Record<string, OrderCondition[]>;
  addOrderConditions: (symbol: string, conditions: OrderCondition[]) => void;
  removeOrderConditions: (symbol: string) => void;
  checkOrderConditions: (symbol: string, currentPrice: number) => OrderCondition[];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      activeOrders: {},

      addOrderConditions: (symbol, conditions) => {
        set((state) => ({
          activeOrders: {
            ...state.activeOrders,
            [symbol]: conditions,
          },
        }));
      },

      removeOrderConditions: (symbol) => {
        set((state) => {
          const newOrders = { ...state.activeOrders };
          delete newOrders[symbol];
          return { activeOrders: newOrders };
        });
      },

      checkOrderConditions: (symbol, currentPrice) => {
        const conditions = get().activeOrders[symbol] || [];
        return conditions.filter((condition) => {
          if (condition.type === 'stop_loss') {
            return currentPrice <= condition.price;
          }
          return currentPrice >= condition.price;
        });
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);