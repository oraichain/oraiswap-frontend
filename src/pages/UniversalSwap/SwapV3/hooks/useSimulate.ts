import { useQuery } from '@tanstack/react-query';
import { TokenItemType } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { TokenInfo } from 'types/token';
import { SimulateResponse, handleSimulateSwap } from '@oraichain/oraidex-universal-swap';
import { OraiswapRouterReadOnlyInterface } from '@oraichain/oraidex-contracts-sdk';

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
  routerClient: OraiswapRouterReadOnlyInterface,
  initAmount?: number
) => {
  const [[fromAmountToken, toAmountToken], setSwapAmount] = useState([initAmount || 0, 0]);

  const { data: simulateData } = useQuery(
    [queryKey, fromTokenInfoData, toTokenInfoData, fromAmountToken],
    () => {
      return handleSimulateSwap({
        originalFromInfo: originalFromTokenInfo,
        originalToInfo: originalToTokenInfo,
        originalAmount: fromAmountToken,
        routerClient
      });
    },
    {
      enabled: !!fromTokenInfoData && !!toTokenInfoData && fromAmountToken > 0
    }
  );

  useEffect(() => {
    setSwapAmount([fromAmountToken, Number(simulateData?.displayAmount)]);
  }, [simulateData, fromAmountToken, fromTokenInfoData, toTokenInfoData]);

  return { simulateData, fromAmountToken, toAmountToken, setSwapAmount };
};
