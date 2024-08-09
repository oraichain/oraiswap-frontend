import { useQuery } from '@tanstack/react-query';
import { PoolFeeAndLiquidityDaily } from 'libs/contractSingleton';
import { FeeDailyData, getFeeDailyData, getPoolsLiquidityAndVolume, PoolLiquidityAndVolume } from 'rest/graphClient';

export const useGetPoolLiqAndVol = (dayIndex: number) => {
  const { data, refetch: refetchPoolLiqAndVol } = useQuery<PoolLiquidityAndVolume[]>(
    ['pool-v3-liquidty-volume-daily'],
    () => getPoolsLiquidityAndVolume(dayIndex),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  const poolLiquidities: Record<string, number> = {};
  const poolVolume: Record<string, number> = {};
  data.forEach((item) => {
    poolLiquidities[item.id] = item.totalValueLockedInUSD;
    poolVolume[item.id] = item.poolDayData.aggregates.sum.volumeInUSD;
  });

  return {
    poolLiquidities,
    poolVolume,
    refetchPoolLiqAndVol
  };
};
