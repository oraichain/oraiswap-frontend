import { TokenItemType } from '@oraichain/oraidex-common';
import { OraiswapRouterReadOnlyInterface } from '@oraichain/oraidex-contracts-sdk';
import { handleSimulateSwap } from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TokenInfo } from 'types/token';
import { useDebounce } from 'hooks/useDebounce';
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
  const [[fromAmountToken, toAmountToken], setSwapAmount] = useState([initAmount || null, 0]);
  const debouncedFromAmount = useDebounce(fromAmountToken, 500);
  const { data: simulateData } = useQuery(
    [queryKey, fromTokenInfoData, toTokenInfoData, debouncedFromAmount],
    () => {
      return handleSimulateSwap({
        originalFromInfo: originalFromTokenInfo,
        originalToInfo: originalToTokenInfo,
        originalAmount: debouncedFromAmount,
        routerClient,
        useSmartRoute: true,
        urlRouter: 'https://osor.oraidex.io'
      });
    },
    {
      refetchInterval: 300000,
      staleTime: 1000,
      enabled: !!fromTokenInfoData && !!toTokenInfoData && !!debouncedFromAmount && fromAmountToken > 0
    }
  );

  useEffect(() => {
    // initAmount used for simulate averate ratio
    const fromAmount = initAmount ?? fromAmountToken;
    setSwapAmount([fromAmount, Number(simulateData?.displayAmount)]);
  }, [simulateData, fromAmountToken, fromTokenInfoData, toTokenInfoData]);

  return { simulateData, fromAmountToken, toAmountToken, setSwapAmount, debouncedFromAmount };
};
