export type OrderType = 'market' | 'limit';

export interface OrderCondition {
  price: number;
  type: 'stop_loss' | 'take_profit';
}

export interface TradeOrder {
  type: OrderType;
  limitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  amount: number;
  total: number;
}

export interface Position {
  symbol: string;
  amount: number;
  averagePrice: number;
  totalCost: number;
  stopLoss?: number;
  takeProfit?: number;
}