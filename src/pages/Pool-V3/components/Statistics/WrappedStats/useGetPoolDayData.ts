import { useQuery } from '@tanstack/react-query';
import { DAY_IN_MILIS } from 'helper/constants';
import { getPoolDayDataV3, PoolDayDataV3 } from 'rest/graphClient';

export const useGetPoolDayData = () => {
  const { data: poolsDayData, isLoading: isLoadingPoolsDayData } = useQuery(['pool-day-data'], getPoolDayDataV3, {
    refetchOnWindowFocus: true,
    placeholderData: []
  });

  const convertPoolDayDataToLiquidityPlotData = (poolDayData: PoolDayDataV3) => {
    return {
      timestamp: Number(poolDayData.keys[0]) * DAY_IN_MILIS,
      value: poolDayData.sum.tvlUSD
    };
  };

  const convertPoolDayDataToVolumePlotData = (poolDayData: PoolDayDataV3) => {
    return {
      timestamp: Number(poolDayData.keys[0]) * DAY_IN_MILIS,
      value: poolDayData.sum.volumeInUSD
    };
  };

  const sortedPoolsDayData = [...poolsDayData].sort((a, b) => Number(a.keys[0]) - Number(b.keys[0]));

  const liquidityPlotData = sortedPoolsDayData.map(convertPoolDayDataToLiquidityPlotData);
  const volumePlotData = sortedPoolsDayData
    .map(convertPoolDayDataToVolumePlotData)
    .slice(0, sortedPoolsDayData.length - 1);

  const volume24h = {
    value: volumePlotData[volumePlotData.length - 1]?.value ?? 0,
    change:
      ((volumePlotData[volumePlotData.length - 1]?.value - volumePlotData[volumePlotData.length - 2]?.value) /
        volumePlotData[volumePlotData.length - 2]?.value) *
      100
  };
  const tvl24h = {
    value: liquidityPlotData[liquidityPlotData.length - 1]?.value ?? 0,
    change:
      ((liquidityPlotData[liquidityPlotData.length - 1]?.value -
        liquidityPlotData[liquidityPlotData.length - 2]?.value) /
        liquidityPlotData[liquidityPlotData.length - 2]?.value) *
      100
  };
  const fees24h = {
    value: sortedPoolsDayData[sortedPoolsDayData.length - 1]?.sum.feesInUSD ?? 0,
    change:
      ((sortedPoolsDayData[sortedPoolsDayData.length - 1]?.sum.feesInUSD -
        sortedPoolsDayData[sortedPoolsDayData.length - 2]?.sum.feesInUSD) /
        sortedPoolsDayData[sortedPoolsDayData.length - 2]?.sum.feesInUSD) *
      100
  };

  return {
    liquidityPlotData,
    volumePlotData,
    isLoadingPoolsDayData,
    volume24h,
    tvl24h,
    fees24h
  };
};
