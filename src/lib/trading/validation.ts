import { OrderParams, OrderSide } from '../../types/orders';

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderValidationError';
  }
}

export function validateQuantity(quantity: number): void {
  if (quantity <= 0) {
    throw new OrderValidationError('Quantity must be greater than 0');
  }
  if (!Number.isFinite(quantity)) {
    throw new OrderValidationError('Invalid quantity');
  }
}

export function validatePrice(price: number): void {
  if (price <= 0) {
    throw new OrderValidationError('Price must be greater than 0');
  }
  if (!Number.isFinite(price)) {
    throw new OrderValidationError('Invalid price');
  }
}

export function validateTakeProfitPrice(
  takeProfit: number,
  entryPrice: number,
  side: OrderSide
): void {
  validatePrice(takeProfit);
  
  if (side === 'buy' && takeProfit <= entryPrice) {
    throw new OrderValidationError('Take profit must be higher than entry price for buy orders');
  }
  if (side === 'sell' && takeProfit >= entryPrice) {
    throw new OrderValidationError('Take profit must be lower than entry price for sell orders');
  }
}

export function validateStopLossPrice(
  stopLoss: number,
  entryPrice: number,
  side: OrderSide
): void {
  validatePrice(stopLoss);
  
  if (side === 'buy' && stopLoss >= entryPrice) {
    throw new OrderValidationError('Stop loss must be lower than entry price for buy orders');
  }
  if (side === 'sell' && stopLoss <= entryPrice) {
    throw new OrderValidationError('Stop loss must be higher than entry price for sell orders');
  }
}

export function validateOrderParams(params: OrderParams): void {
  const { quantity, price, type, takeProfit, stopLoss, side } = params;

  validateQuantity(quantity);

  if (type === 'limit' && !price) {
    throw new OrderValidationError('Price is required for limit orders');
  }

  if (price) {
    validatePrice(price);
  }

  if (takeProfit) {
    validateTakeProfitPrice(takeProfit, price || 0, side);
  }

  if (stopLoss) {
    validateStopLossPrice(stopLoss, price || 0, side);
  }

  if (takeProfit && stopLoss) {
    if (side === 'buy' && stopLoss >= takeProfit) {
      throw new OrderValidationError('Stop loss must be lower than take profit for buy orders');
    }
    if (side === 'sell' && stopLoss <= takeProfit) {
      throw new OrderValidationError('Stop loss must be higher than take profit for sell orders');
    }
  }
}