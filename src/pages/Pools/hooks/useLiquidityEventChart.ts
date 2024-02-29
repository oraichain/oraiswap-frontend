import { sleep } from 'helper';
import { useEffect, useRef, useState } from 'react';
import { FILTER_DAY } from '../components/Header';
import axios from 'rest/request';

export const useLiquidityEventChart = (
  type: FILTER_DAY,
  onUpdateCurrentItem: React.Dispatch<React.SetStateAction<number>>
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
      let data = await getDataLiquidityHistorical(value);

      sleep(1000);

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

export const getDataLiquidityHistorical = async (type: FILTER_DAY = FILTER_DAY.DAY) => {
  try {
    const res = await axios.get('/v1/liquidity/historical/all-charts', {
      params: {
        type
      }
    });
    return res.data;
  } catch (e) {
    console.error('getDataLiquidityHistorical', e);
    return [];
  }
};
