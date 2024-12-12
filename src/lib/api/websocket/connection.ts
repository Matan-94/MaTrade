import { BINANCE_WS_URL, SUPPORTED_PAIRS } from '../constants';
import { useBinanceStore } from '../store';
import { handleTickerMessage } from './messageHandlers';

export function createWebSocketConnection() {
  const store = useBinanceStore.getState();
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout;
  let pingInterval: NodeJS.Timeout;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const INITIAL_RECONNECT_DELAY = 1000;

  const connect = () => {
    try {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }

      // Create streams for tickers only
      const streams = SUPPORTED_PAIRS.map(pair => `${pair.toLowerCase()}@ticker`);

      const wsUrl = `${BINANCE_WS_URL}/stream?streams=${streams.join('/')}`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        store.setError(null);
        store.setLoading(false);
        reconnectAttempts = 0;

        // Keep connection alive with ping/pong
        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ method: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.stream?.includes('@ticker')) {
            handleTickerMessage(data.data, store);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.setError('Unable to connect to market data');
        reconnect();
      };

      ws.onclose = () => {
        clearInterval(pingInterval);
        reconnect();
      };
    } catch (error) {
      store.setError('Failed to connect to market data');
      store.setLoading(false);
      reconnect();
    }
  };

  const reconnect = () => {
    clearTimeout(reconnectTimeout);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      const delay = Math.min(
        INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1),
        10000
      );
      reconnectTimeout = setTimeout(connect, delay);
    } else {
      store.setError('Unable to establish connection after multiple attempts. Please refresh the page.');
    }
  };

  // Initial connection
  connect();

  // Cleanup function
  return () => {
    clearInterval(pingInterval);
    clearTimeout(reconnectTimeout);
    if (ws) {
      ws.close();
    }
  };
}