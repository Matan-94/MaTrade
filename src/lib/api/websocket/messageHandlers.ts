import type { BinanceStore } from '../store';

export function handleTickerMessage(data: any, store: BinanceStore) {
  if (!data || !data.s) return;

  store.updatePrice({
    symbol: data.s,
    price: parseFloat(data.c),
    change: parseFloat(data.p),
    volume: parseFloat(data.v),
    high: parseFloat(data.h),
    low: parseFloat(data.l),
  });
}