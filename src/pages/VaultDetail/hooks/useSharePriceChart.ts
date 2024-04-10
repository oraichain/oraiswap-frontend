import { useEffect, useState } from 'react';
import { FILTER_DAY } from 'reducer/type';
import axios from 'rest/request';

export const useSharePriceChart = (type: FILTER_DAY, pair?: string) => {
  const [currentDataLiquidity, setCurrentDataLiquidity] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onChangeRangeLiquidity = async (value = FILTER_DAY.DAY) => {
    try {
      setIsLoading(true);
      let data = [];

      if (pair) {
        data = await getDataLiquidityHistoricalByPair(pair, value);
      } else {
        data = await getDataLiquidityHistoricalAll(value);
      }

      setCurrentDataLiquidity(data);
      setIsLoading(false);
    } catch (e) {
      console.log('Liquidity ERROR: e', 'background: #FF0000; color:#FFFFFF', e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onChangeRangeLiquidity(type);
  }, [type]);

  return {
    currentDataLiquidity
  };
};
export const MINIMUM_YEAR_STATISTIC = 2000;

export const getDataLiquidityHistoricalAll = async (type: FILTER_DAY = FILTER_DAY.DAY) => {
  try {
    const res = await axios.get('/v1/liquidity/historical/all-charts', {
      params: {
        type
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error('getDataLiquidityHistoricalAll', e);
    return [];
  }
};

export const getDataLiquidityHistoricalByPair = async (pair: string, type: FILTER_DAY = FILTER_DAY.DAY) => {
  try {
    const res = await axios.get('/v1/liquidity/historical/chart', {
      params: {
        type,
        pair
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error(`getDataLiquidityHistoricalByPair - pair: ${pair}`, e);
    return [];
  }
};
