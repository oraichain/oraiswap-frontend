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
  const { data: pairInfoData } = useQuery(['pair-info', poolUrl], () => getPairInfo(), {
    refetchOnWindowFocus: false
  });

  return pairInfoData;
};

export const useGetLpTokenInfo = (pairInfoData: PairInfoData) => {
  const { data: lpTokenInfoData } = useQuery(
    ['token-info', pairInfoData],
    () =>
      fetchTokenInfo({
        contractAddress: pairInfoData?.info.liquidity_token
      } as TokenItemType),
    {
      enabled: !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );

  return lpTokenInfoData;
};

export const useGetPairAmountInfoData = (pairInfoData: PairInfoData) => {
  let { data: pairAmountInfoData, refetch: refetchPairAmountInfo } = useQuery(
    ['pair-amount-info', pairInfoData],
    () => {
      return getPairAmountInfo(pairInfoData.token1, pairInfoData.token2);
    },
    {
      enabled: !!pairInfoData,
      refetchOnWindowFocus: false,
      refetchInterval: 15000
    }
  );
  return { pairAmountInfoData, refetchPairAmountInfo };
};
