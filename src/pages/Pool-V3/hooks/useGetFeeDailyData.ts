import { useQuery } from '@tanstack/react-query';
import { PoolFeeAndLiquidityDaily } from 'libs/contractSingleton';
import { FeeDailyData, getFeeDailyData } from 'rest/graphClient';

export const useGetFeeDailyData = (dayIndex: number) => {
  const { data, refetch: refetchfeeDailyData } = useQuery<FeeDailyData[]>(
    ['pool-v3-fee-daily-data'],
    () => getFeeDailyData(dayIndex),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  const feeDailyData: PoolFeeAndLiquidityDaily[] = data.map((item) => {
    return {
      poolKey: item.poolId,
      feeDaily: item.feesInUSD,
      liquidityDaily: item.tvlUSD
    };
  });

  return {
    feeDailyData,
    refetchfeeDailyData
  };
};
