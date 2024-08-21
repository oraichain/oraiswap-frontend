import { parsePoolKey } from '@oraichain/oraiswap-v3';
import { useQuery } from '@tanstack/react-query';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { useEffect, useState } from 'react';
import { getPoolsLiqudityAndVolumeAmount, PoolLiquidityAndVolumeAmount } from 'rest/graphClient';

export const useGetPoolLiquidityVolume = (prices: CoinGeckoPrices<string>) => {
  const [poolLiquidities, setPoolLiquidities] = useState<Record<string, number>>({});
  const [poolVolume, setPoolVolume] = useState<Record<string, number>>({});

  const { data, refetch: refetchPoolLiquidityVolume } = useQuery<PoolLiquidityAndVolumeAmount[]>(
    ['pool-v3-liquidty-volume-daily', prices],
    () => getPoolsLiqudityAndVolumeAmount(),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  useEffect(() => {
    if (data.length === 0 || prices.length === 0) return;
    console.log('price', prices);
    data.forEach((item) => {
      //   if (item.poolDayData.nodes.length > 0) {

      //       console.log(item.poolDayData.nodes[0].volumeTokenX, item.poolDayData.nodes[0].volumeTokenY, prices[item.tokenX.coingeckoId], prices[item.tokenY.coingeckoId]);
      //     }
      setPoolLiquidities((prevState) => ({
        ...prevState,
        [item.id]:
          (item.totalValueLockedTokenX / 10 ** item.tokenX.decimals) * prices[item.tokenX.coingeckoId] +
          (item.totalValueLockedTokenY / 10 ** item.tokenY.decimals) * prices[item.tokenY.coingeckoId]
      }));
      setPoolVolume((prevState) => ({
        ...prevState,
        [item.id]:
          item.poolDayData.nodes.length > 0
            ? (item.poolDayData.nodes[0].volumeTokenX / 10 ** item.tokenX.decimals) * prices[item.tokenX.coingeckoId] +
              (item.poolDayData.nodes[0].volumeTokenY / 10 ** item.tokenY.decimals) * prices[item.tokenY.coingeckoId]
            : 0
      }));
    });
  }, [data, prices]);

  return {
    poolLiquidities,
    poolVolume,
    refetchPoolLiquidityVolume
  };
};
