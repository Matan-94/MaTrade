export function calculateProfitLoss(
  entryPrice: number,
  currentPrice: number,
  amount: number
): number {
  return (currentPrice - entryPrice) * amount;
}

export function calculateProfitLossPercentage(
  entryPrice: number,
  currentPrice: number
): number {
  return ((currentPrice - entryPrice) / entryPrice) * 100;
}

export function validateTradeAmount(
  amount: string,
  balance: number,
  price: number,
  type: 'buy' | 'sell'
): string | null {
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return 'Please enter a valid amount';
  }

  const total = price * parsedAmount;

  if (type === 'buy' && total > balance) {
    return 'Insufficient balance';
  }

  return null;
}