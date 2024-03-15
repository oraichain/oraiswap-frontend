import { useEffect, useState } from 'react';
import { FILTER_TIME_CHART } from 'reducer/type';
import axios from 'rest/request';

export const useChartUsdPrice = (
  type: FILTER_TIME_CHART,
  onUpdateCurrentItem?: React.Dispatch<React.SetStateAction<number>>,
  token?: string
) => {
  const [currentData, setCurrentData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState<{
    value: number;
    time: string | number;
  }>({ value: 0, time: 0 });

  const onCrossMove = (item) => {
    setCurrentItem(item);
    onUpdateCurrentItem && onUpdateCurrentItem(item?.value || 0);
  };

  const onMouseLeave = () => {
    if (currentData.length > 0) {
      setCurrentItem(currentData[currentData.length - 1]);
      onUpdateCurrentItem && onUpdateCurrentItem(currentData[currentData.length - 1]?.value || 0);
    }
  };

  const onChangeRange = async (value: FILTER_TIME_CHART = FILTER_TIME_CHART.DAY) => {
    try {
      setIsLoading(true);
      let data = [];

      if (token) {
        data = await getDataHistoricalByPair(token, value);
      } else {
        data = await getDataHistoricalAll(value);
      }

      setCurrentData(data);
      if (data.length > 0) {
        setCurrentItem({ ...data[data.length - 1] });
        onUpdateCurrentItem && onUpdateCurrentItem(data[data.length - 1]?.value || 0);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(' ERROR: e', 'background: #FF0000; color:#FFFFFF', e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onChangeRange(type);
  }, [type]);

  return {
    currentData,
    currentItem,
    onCrossMove,
    onMouseLeave
  };
};
export const MINIMUM_YEAR_STATISTIC = 2000;

export const getDataHistoricalAll = async (type: FILTER_TIME_CHART = FILTER_TIME_CHART.DAY) => {
  try {
    const res = await axios.get('/v1/liquidity/historical/all-charts', {
      params: {
        type: 'day'
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error('getDataHistoricalAll', e);
    return [];
  }
};

export const getDataHistoricalByPair = async (pair: string, type: FILTER_TIME_CHART = FILTER_TIME_CHART.DAY) => {
  try {
    const res = await axios.get('/v1/liquidity/historical/chart', {
      params: {
        type: 'day',
        pair
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error(`getDataHistoricalByPair - pair: ${pair}`, e);
    return [];
  }
};
