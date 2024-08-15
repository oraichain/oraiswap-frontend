import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getPoolsLiquidityAndVolume, PoolLiquidityAndVolume } from 'rest/graphClient';

export const useGetPoolLiqAndVol = () => {
  const [poolLiquidities, setPoolLiquidities] = useState<Record<string, number>>({});
  const [poolVolume, setPoolVolume] = useState<Record<string, number>>({});

  const { data, refetch: refetchPoolLiqAndVol } = useQuery<PoolLiquidityAndVolume[]>(
    ['pool-v3-liquidty-volume-daily'],
    () => getPoolsLiquidityAndVolume(),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  useEffect(() => {
    if (data.length === 0) return;
    data.forEach((item) => {
      setPoolLiquidities((prevState) => ({
        ...prevState,
        [item.id]: item.totalValueLockedInUSD
      }));
      setPoolVolume((prevState) => ({
        ...prevState,
        [item.id]: item.poolDayData.aggregates.sum.volumeInUSD
      }));
    });
  }, [data]);

  return {
    poolLiquidities,
    poolVolume,
    refetchPoolLiqAndVol
  };
};
