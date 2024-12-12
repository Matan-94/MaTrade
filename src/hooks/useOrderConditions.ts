import { useState } from 'react';

export function useOrderConditions(currentPrice: number) {
  const [showConditions, setShowConditions] = useState(false);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const validateConditions = () => {
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit);

    if (stopLoss && (!stopLossNum || stopLossNum >= currentPrice)) {
      return 'Stop loss must be below current price';
    }

    if (takeProfit && (!takeProfitNum || takeProfitNum <= currentPrice)) {
      return 'Take profit must be above current price';
    }

    if (stopLoss && takeProfit && stopLossNum >= takeProfitNum) {
      return 'Stop loss must be below take profit';
    }

    return null;
  };

  const resetConditions = () => {
    setStopLoss('');
    setTakeProfit('');
    setShowConditions(false);
  };

  return {
    showConditions,
    stopLoss,
    takeProfit,
    setShowConditions,
    setStopLoss,
    setTakeProfit,
    validateConditions,
    resetConditions,
  };
}