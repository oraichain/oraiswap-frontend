import { useQuery } from '@tanstack/react-query';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { PoolFeeAndLiquidityDaily } from 'libs/contractSingleton';
import { useEffect, useState } from 'react';
import { FeeDailyData, getFeeDailyData, getPoolDetail, PoolDetail } from 'rest/graphClient';
import { toDisplay } from '@oraichain/oraidex-common';

export type LiquidityDistribution = {
  total: number;
  allocation: {
    [key: string]: {
      address: string;
      balance: number;
      usdValue: number;
    };
  };
};

// const xUsd = (prices[tokenX.coinGeckoId] * Number(tvlX)) / 10 ** tokenX.decimals;
// toDisplay(tvlX, tokenX.decimals)

export const useGetPoolDetail = (poodKey: string, prices: CoinGeckoPrices<string>) => {
  const [liquidityDistribution, setLiquidityDistribution] = useState<LiquidityDistribution>({
    total: 0,
    allocation: {}
  });
  const { data, refetch: refetchPoolDetail } = useQuery<PoolDetail>(['pool-v3-detail'], () => getPoolDetail(poodKey), {
    refetchOnWindowFocus: true,
    placeholderData: null,
    cacheTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (data === null) return;

    const liquidityDistribution: LiquidityDistribution = {
      total: Number(data.totalValueLockedInUSD),
      allocation: {
        [data.tokenX.id]: {
          address: data.id,
          balance: toDisplay(data.totalValueLockedTokenX, data.tokenX.decimals),
          usdValue: (prices[data.tokenX.coingeckoId] * Number(data.totalValueLockedTokenX)) / 10 ** data.tokenX.decimals
        },
        [data.tokenY.id]: {
          address: data.id,
          balance: toDisplay(data.totalValueLockedTokenY, data.tokenY.decimals),
          usdValue: (prices[data.tokenY.coingeckoId] * Number(data.totalValueLockedTokenY)) / 10 ** data.tokenY.decimals
        }
      }
    };
    setLiquidityDistribution(liquidityDistribution);

  }, [data, prices]);

  return {
    data,
    liquidityDistribution,
    refetchPoolDetail
  };
};
