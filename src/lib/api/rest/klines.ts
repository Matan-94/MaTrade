import { BINANCE_REST_URL } from '../constants';
import type { Kline } from '../types';

export async function fetchKlines(symbol: string, interval: string): Promise<Kline[]> {
  try {
    const params = new URLSearchParams({
      symbol: symbol,
      interval: interval,
      limit: '100'
    });

    const response = await fetch(`${BINANCE_REST_URL}/v3/klines?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((k: any[]) => ({
      time: k[0] / 1000,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));
  } catch (error) {
    console.error('Error fetching klines:', error);
    throw error;
  }
}