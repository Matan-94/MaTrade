import { Order, OrderStatus } from '../../types/orders';

interface OrderUpdate {
  orderId: string;
  status: OrderStatus;
  filled?: number;
  avgFillPrice?: number;
}

class OrderTracker {
  private orders: Map<string, Order> = new Map();
  private listeners: Map<string, ((order: Order) => void)[]> = new Map();

  addOrder(order: Order): void {
    this.orders.set(order.id, order);
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  updateOrder(update: OrderUpdate): void {
    const order = this.orders.get(update.orderId);
    if (!order) return;

    Object.assign(order, {
      status: update.status,
      filled: update.filled ?? order.filled,
      avgFillPrice: update.avgFillPrice ?? order.avgFillPrice,
      remainingQuantity: order.quantity - (update.filled ?? 0),
    });

    this.notifyListeners(order);
  }

  onOrderUpdate(orderId: string, callback: (order: Order) => void): () => void {
    if (!this.listeners.has(orderId)) {
      this.listeners.set(orderId, []);
    }
    this.listeners.get(orderId)!.push(callback);

    return () => {
      const callbacks = this.listeners.get(orderId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(order: Order): void {
    const callbacks = this.listeners.get(order.id);
    if (callbacks) {
      callbacks.forEach(callback => callback(order));
    }
  }
}

export const orderTracker = new OrderTracker();