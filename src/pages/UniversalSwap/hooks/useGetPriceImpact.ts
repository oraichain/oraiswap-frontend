import { BigDecimal } from '@oraichain/oraidex-common';
import { TransactionHistory } from 'libs/duckdb';

const useGetPriceImpact = ({ data }: { data: TransactionHistory }) => {
  const { fromAmount: fromAmountToken, toAmount: toAmountToken, avgSimulate, expectedOutput } = data;

  const isImpactPrice = fromAmountToken && avgSimulate;

  let impactWarning = 0;

  if (isImpactPrice) {
    const calculateImpactPrice = new BigDecimal(expectedOutput || toAmountToken)
      .div(fromAmountToken)
      .div(avgSimulate)
      .mul(100)
      .toNumber();

    impactWarning = 100 - calculateImpactPrice;
  }

  return {
    impactWarning
  };
};

export default useGetPriceImpact;
