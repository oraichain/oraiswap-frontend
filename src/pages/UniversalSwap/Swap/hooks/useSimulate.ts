import { useQuery } from '@tanstack/react-query';
import { TokenItemType } from 'config/bridgeTokens';
import { toAmount, toDisplay } from 'libs/utils';
import { handleSimulateSwap } from 'pages/UniversalSwap/helpers';
import { useEffect, useState } from 'react';
import { TokenInfo } from 'types/token';

/**
 * Simulate ratio between fromToken & toToken
 * @param queryKey
 * @param fromTokenInfoData
 * @param toTokenInfoData
 * @param initAmount
 * @returns
 */
export const useSimulate = (
  queryKey: string,
  fromTokenInfoData: TokenInfo,
  toTokenInfoData: TokenInfo,
  originalFromTokenInfo: TokenItemType,
  originalToTokenInfo: TokenItemType,
  initAmount?: number
) => {
  const [[fromAmountToken, toAmountToken], setSwapAmount] = useState([initAmount || 0, 0]);

  const { data: simulateData } = useQuery(
    [queryKey, fromTokenInfoData, toTokenInfoData, fromAmountToken],
    () =>
      handleSimulateSwap({
        fromInfo: fromTokenInfoData!,
        toInfo: toTokenInfoData!,
        originalFromInfo: originalFromTokenInfo,
        originalToInfo: originalToTokenInfo,
        amount: toAmount(fromAmountToken, fromTokenInfoData!.decimals).toString()
      }),
    { enabled: !!fromTokenInfoData && !!toTokenInfoData && fromAmountToken > 0 }
  );

  useEffect(() => {
    setSwapAmount([fromAmountToken, toDisplay(simulateData?.amount, toTokenInfoData?.decimals)]);
  }, [simulateData, fromAmountToken, fromTokenInfoData, toTokenInfoData]);

  return { simulateData, fromAmountToken, toAmountToken, setSwapAmount };
};
