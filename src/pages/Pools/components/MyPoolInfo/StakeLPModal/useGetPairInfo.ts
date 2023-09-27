import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import { TokenItemType, oraichainTokens } from 'config/bridgeTokens';
import { fetchPairInfo, fetchTokenInfo, getPairAmountInfo } from 'rest/api';

export type PairInfoData = {
  info: PairInfo;
  token1: TokenItemType;
  token2: TokenItemType;
  apr: number;
};
export const useGetPairInfo = (poolUrl: string) => {
  const getPairInfo = async () => {
    if (!poolUrl) return;
    const pairRawData = poolUrl.split('_');
    const tokenTypes = pairRawData.map((raw) =>
      oraichainTokens.find((token) => token.denom === raw || token.contractAddress === raw)
    );
    let isPairExist = true;
    let info: PairInfo;
    try {
      info = await fetchPairInfo([tokenTypes[0], tokenTypes[1]]);
    } catch (error) {
      console.log('error getting pair info in pool details: ', error);
      isPairExist = false;
    }
    if (!isPairExist) return;
    return {
      info,
      token1: tokenTypes[0],
      token2: tokenTypes[1],
      apr: 1
    };
  };
  const {
    data: pairInfo,
    isLoading,
    isError
  } = useQuery(['pair-info', poolUrl], () => getPairInfo(), {
    refetchOnWindowFocus: false
  });

  const { data: lpTokenInfoData } = useQuery(
    ['token-info', pairInfo],
    () =>
      fetchTokenInfo({
        contractAddress: pairInfo.info.liquidity_token
      } as TokenItemType),
    {
      enabled: !!pairInfo,
      refetchOnWindowFocus: false
    }
  );

  const { data: pairAmountInfoData, refetch: refetchPairAmountInfo } = useQuery(
    ['pair-amount-info', pairInfo],
    () => {
      return getPairAmountInfo(pairInfo.token1, pairInfo.token2);
    },
    {
      enabled: !!pairInfo,
      refetchOnWindowFocus: false,
      refetchInterval: 15000
    }
  );

  return { pairInfo, isLoading, isError, lpTokenInfoData, pairAmountInfoData, refetchPairAmountInfo };
};
