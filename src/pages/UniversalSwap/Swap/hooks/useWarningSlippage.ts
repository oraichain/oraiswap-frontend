import { useEffect, useState } from 'react';

type WarningSlippage = {
  minimumReceive: string;
  simulatedAmount: string;
};
export const useWarningSlippage = ({ minimumReceive, simulatedAmount }: WarningSlippage) => {
  const [isWarningSlippage, setIsWarningSlippage] = useState(false);
  // console.log({ minimumReceive, simulatedAmount });
  useEffect(() => {
    setIsWarningSlippage(+minimumReceive >= +simulatedAmount);
  }, [minimumReceive, simulatedAmount]);

  return isWarningSlippage;
};
