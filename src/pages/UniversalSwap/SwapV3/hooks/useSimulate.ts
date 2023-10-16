import { TokenItemType, network, toAmount, toDisplay } from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { handleSimulateSwap } from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
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
        originalFromInfo: originalFromTokenInfo,
        originalToInfo: originalToTokenInfo,
        originalAmount: fromAmountToken,
        routerClient: new OraiswapRouterQueryClient(window.client, network.router)
      }),
    { enabled: !!fromTokenInfoData && !!toTokenInfoData && fromAmountToken > 0 }
  );

  useEffect(() => {
    setSwapAmount([
      fromAmountToken,
      toDisplay(simulateData?.amount, originalToTokenInfo?.decimals, toTokenInfoData?.decimals)
    ]);
  }, [simulateData, fromAmountToken, fromTokenInfoData, toTokenInfoData]);

  return { simulateData, fromAmountToken, toAmountToken, setSwapAmount };
};
