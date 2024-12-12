import { Order, OrderParams, OrderResult, OrderStatus } from '../../types/orders';
import { validateOrderParams } from './validation';
import { v4 as uuidv4 } from 'uuid';

function createOrder(params: OrderParams, isConditional = false, parentOrderId?: string): Order {
  const timestamp = Date.now();
  const price = params.type === 'market' ? 0 : params.price!;

  return {
    id: uuidv4(),
    symbol: params.symbol,
    type: params.type,
    side: params.side,
    quantity: params.quantity,
    price,
    status: 'pending',
    timestamp,
    remainingQuantity: params.quantity,
    isConditional,
    parentOrderId,
  };
}

function createConditionalOrders(
  mainOrder: Order,
  params: OrderParams
): { takeProfitOrder?: Order; stopLossOrder?: Order } {
  const result: { takeProfitOrder?: Order; stopLossOrder?: Order } = {};

  if (params.takeProfit) {
    result.takeProfitOrder = createOrder(
      {
        ...params,
        type: 'limit',
        price: params.takeProfit,
        side: params.side === 'buy' ? 'sell' : 'buy',
      },
      true,
      mainOrder.id
    );
  }

  if (params.stopLoss) {
    result.stopLossOrder = createOrder(
      {
        ...params,
        type: 'limit',
        price: params.stopLoss,
        side: params.side === 'buy' ? 'sell' : 'buy',
      },
      true,
      mainOrder.id
    );
  }

  return result;
}

export async function placeOrder(params: OrderParams): Promise<OrderResult> {
  try {
    // Validate order parameters
    validateOrderParams(params);

    // Create main order
    const mainOrder = createOrder(params);

    // Create conditional orders if specified
    const { takeProfitOrder, stopLossOrder } = createConditionalOrders(mainOrder, params);

    // Simulate order execution (replace with actual exchange API calls)
    await simulateOrderExecution(mainOrder);

    if (takeProfitOrder) {
      await simulateOrderExecution(takeProfitOrder);
    }

    if (stopLossOrder) {
      await simulateOrderExecution(stopLossOrder);
    }

    return {
      mainOrder,
      takeProfitOrder,
      stopLossOrder,
      success: true,
    };
  } catch (error) {
    return {
      mainOrder: createOrder(params),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Simulate order execution (replace with actual exchange API integration)
async function simulateOrderExecution(order: Order): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  order.status = 'filled';
  order.filled = order.quantity;
  order.remainingQuantity = 0;
  order.avgFillPrice = order.price;
}