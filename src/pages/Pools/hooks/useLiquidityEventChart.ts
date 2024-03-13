import { sleep } from 'helper';
import { useEffect, useRef, useState } from 'react';
import { FILTER_DAY } from 'reducer/type';
import axios from 'rest/request';

export const useLiquidityEventChart = (
  type: FILTER_DAY,
  onUpdateCurrentItem?: React.Dispatch<React.SetStateAction<number>>,
  pair?: string
) => {
  const [currentDataLiquidity, setCurrentDataLiquidity] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState<{
    value: number;
    time: string | number;
  }>({ value: 0, time: 0 });

  const dataClick = useRef({ time: { day: 1, month: 1, year: 1 }, value: 0, clickedTwice: true });

  const onCrossMove = (item) => {
    setCurrentItem(item);
    onUpdateCurrentItem && onUpdateCurrentItem(item?.value || 0);
  };

  const onMouseLiquidityLeave = () => {
    if (currentDataLiquidity.length > 0) {
      setCurrentItem(currentDataLiquidity[currentDataLiquidity.length - 1]);
      onUpdateCurrentItem && onUpdateCurrentItem(currentDataLiquidity[currentDataLiquidity.length - 1]?.value || 0);
    }
  };

  const onChangeRangeLiquidity = async (value: FILTER_DAY = FILTER_DAY.DAY) => {
    try {
      setIsLoading(true);
      let data = [];

      if (pair) {
        data = await getDataLiquidityHistoricalByPair(pair, value);
      } else {
        data = await getDataLiquidityHistoricalAll(value);
      }

      setCurrentDataLiquidity(data);
      if (data.length > 0) {
        setCurrentItem({ ...data[data.length - 1] });
        onUpdateCurrentItem && onUpdateCurrentItem(data[data.length - 1]?.value || 0);
      }
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
    currentDataLiquidity,
    currentItem,
    onCrossMove,
    onMouseLiquidityLeave
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
