import { calculatePercentPriceImpact } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';

const PRICE_IMPACT_WARNING_MILESTONE = 0.2; // 20%

type WarningSlippage = {
  minimumReceive: number;
  simulatedAmount: number;
};
export const useWarningSlippage = ({ minimumReceive, simulatedAmount }: WarningSlippage) => {
  const [priceImpact, setPriceImpact] = useState({
    isWarning: false,
    percentImpact: 0
  });

  useEffect(() => {
    const percentImpact = calculatePercentPriceImpact(minimumReceive, simulatedAmount);
    setPriceImpact({
      isWarning: percentImpact >= PRICE_IMPACT_WARNING_MILESTONE,
      percentImpact
    });
  }, [minimumReceive, simulatedAmount]);

  return priceImpact;
};
