import { TokenItemType } from '@oraichain/oraidex-common';
import { OraiswapRouterReadOnlyInterface } from '@oraichain/oraidex-contracts-sdk';
import { UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
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
  initAmount?: number,
  simulateOption?: {
    useAlphaSmartRoute?: boolean;
    useIbcWasm?: boolean;
    protocols?: string[];
    isAvgSimulate?: boolean;
  }
) => {
  const [[fromAmountToken, toAmountToken], setSwapAmount] = useState([initAmount || null, 0]);
  const debouncedFromAmount = useDebounce(fromAmountToken, 800);
  let enabled = !!fromTokenInfoData && !!toTokenInfoData && !!debouncedFromAmount && fromAmountToken > 0;
  if (simulateOption?.isAvgSimulate) enabled = false;
  const { data: simulateData, isPreviousData: isPreviousSimulate } = useQuery(
    [queryKey, fromTokenInfoData, toTokenInfoData, debouncedFromAmount],
    () => {
      return UniversalSwapHelper.handleSimulateSwap({
        originalFromInfo: originalFromTokenInfo,
        originalToInfo: originalToTokenInfo,
        originalAmount: debouncedFromAmount,
        routerClient,
        routerOption: {
          useAlphaSmartRoute: simulateOption?.useAlphaSmartRoute,
          useIbcWasm: simulateOption?.useIbcWasm
        },
        routerConfig: {
          url: 'https://osor.oraidex.io',
          path: '/smart-router/alpha-router',
          protocols: simulateOption?.protocols ?? ['Oraidex', 'OraidexV3'],
          dontAllowSwapAfter: ['Oraidex', 'OraidexV3']
        }
      });
    },
    {
      keepPreviousData: true,
      refetchInterval: 15000,
      staleTime: 1000,
      enabled,
      onError: (error) => {
        console.log('isAvgSimulate:', simulateOption?.isAvgSimulate, 'error when simulate: ', error);
      }
    }
  );

  useEffect(() => {
    // initAmount used for simulate averate ratio
    const fromAmount = initAmount ?? fromAmountToken;
    setSwapAmount([fromAmount ?? null, !!fromAmount ? Number(simulateData?.displayAmount) : 0]);
  }, [simulateData, fromAmountToken, fromTokenInfoData, toTokenInfoData]);

  return {
    simulateData,
    fromAmountToken,
    toAmountToken,
    setSwapAmount,
    debouncedFromAmount,
    isPreviousSimulate
  };
};
