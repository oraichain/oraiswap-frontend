import { useQuery } from '@tanstack/react-query';
import { oraichainTokens } from 'config/bridgeTokens';
import axios from 'rest/request';
import { PoolInfoResponse } from 'types/pool';

export const useGetPoolDetail = ({ pairDenoms }: { pairDenoms: string }) => {
  const getPoolDetail = async (queries: { pairDenoms: string }): Promise<PoolInfoResponse> => {
    try {
      const res = await axios.get('/v1/pool-detail/', { params: queries });
      return res.data;
    } catch (e) {
      console.error('error getPoolDetail: ', e);
    }
  };

  const { data: poolDetail, isLoading } = useQuery(['pool-detail', pairDenoms], () => getPoolDetail({ pairDenoms }), {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    enabled: !!pairDenoms
  });

  const pairRawData = pairDenoms.split('_');
  const tokenTypes = pairRawData.map((raw) =>
    oraichainTokens.find((token) => token.denom === raw || token.contractAddress === raw)
  );
  return {
    info: poolDetail,
    token1: tokenTypes[0],
    token2: tokenTypes[1],
    isLoading
  };
};
