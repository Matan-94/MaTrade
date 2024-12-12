import { BINANCE_REST_URL } from '../constants';

export async function fetchOrderBook(symbol: string) {
  try {
    const response = await fetch(`${BINANCE_REST_URL}/v3/depth?symbol=${symbol}&limit=20`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      bids: data.bids.map(([price, amount]: string[]) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
      })),
      asks: data.asks.map(([price, amount]: string[]) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
      })),
    };
  } catch (error) {
    console.error('Error fetching order book:', error);
    throw error;
  }
}