import { BINANCE_WS_URL, SUPPORTED_PAIRS } from './constants';
import { useBinanceStore } from './store';

export function createWebSocketConnection() {
  const store = useBinanceStore.getState();
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout;
  let pingInterval: NodeJS.Timeout;

  const connect = () => {
    try {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }

      // Create individual streams for each pair
      const streams = SUPPORTED_PAIRS.flatMap(pair => [
        `${pair.toLowerCase()}@ticker`,
        `${pair.toLowerCase()}@depth20@100ms`
      ]);

      const wsUrl = `${BINANCE_WS_URL}/stream?streams=${streams.join('/')}`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        store.setError(null);
        store.setLoading(false);

        // Keep connection alive with ping/pong
        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ method: 'ping' }));
          }
        }, 5000);
      };

      ws.onmessage = (event) => {
        try {
          const { data } = event;
          const parsedData = JSON.parse(data);

          if (parsedData.stream?.includes('@ticker')) {
            const ticker = parsedData.data;
            store.updatePrice({
              symbol: ticker.s,
              price: parseFloat(ticker.c),
              change: parseFloat(ticker.p),
              volume: parseFloat(ticker.v),
              high: parseFloat(ticker.h),
              low: parseFloat(ticker.l),
            });
          } else if (parsedData.stream?.includes('@depth20')) {
            const depth = parsedData.data;
            store.updateOrderBook(depth.s, {
              bids: depth.b.slice(0, 20).map(([price, amount]: string[]) => ({
                price: parseFloat(price),
                amount: parseFloat(amount),
              })),
              asks: depth.a.slice(0, 20).map(([price, amount]: string[]) => ({
                price: parseFloat(price),
                amount: parseFloat(amount),
              })),
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.setError('Connection error occurred');
        reconnect();
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        clearInterval(pingInterval);
        reconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      store.setError('Failed to connect to market data');
      store.setLoading(false);
      reconnect();
    }
  };

  const reconnect = () => {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(connect, 2000);
  };

  connect();

  return () => {
    clearInterval(pingInterval);
    clearTimeout(reconnectTimeout);
    if (ws) {
      ws.close();
    }
  };
}