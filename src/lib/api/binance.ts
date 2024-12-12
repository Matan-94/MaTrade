import { createWebSocketConnection } from './websocket/connection';
import { useBinanceStore } from './store';

export function initializeBinanceWebSocket() {
  return createWebSocketConnection();
}

export { useBinanceStore };