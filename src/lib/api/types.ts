export interface CryptoPrice {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
}

export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}