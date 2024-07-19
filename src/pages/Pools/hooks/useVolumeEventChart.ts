import { useEffect, useRef, useState } from 'react';
import axios from 'rest/request';
import { getInclude } from '../helpers';
import { MINIMUM_YEAR_STATISTIC } from './useLiquidityEventChart';
import { FILTER_DAY } from 'reducer/type';

export const useVolumeEventChart = (
  type: FILTER_DAY,
  onUpdateCurrentItem?: React.Dispatch<React.SetStateAction<number>>,
  pair?: string
) => {
  const [currentDataVolume, setCurrentDataVolume] = useState([]);

  const [currentItem, setCurrentItem] = useState<{
    value: number;
    time: string | number;
  }>({ value: 0, time: 0 });

  const dataClick = useRef({ time: { day: 1, month: 1, year: 1 }, value: 0, clickedTwice: true });

  const onCrossMove = (item) => {
    setCurrentItem(item);
    onUpdateCurrentItem && onUpdateCurrentItem(item?.value || 0);
  };

  const onMouseVolumeLeave = () => {
    if (currentDataVolume.length > 0)
      if (dataClick.current.clickedTwice) {
        const lastElt = currentDataVolume[currentDataVolume.length - 1];
        setCurrentItem({ time: lastElt.time, value: lastElt.value });
        onUpdateCurrentItem && onUpdateCurrentItem(lastElt?.value || 0);
      }
  };

  const onClickChart = (e) => {
    const index = getInclude(currentDataVolume, (item) => {
      return item.time.year === e.time.year && item.time.month === e.time.month && item.time.day === e.time.day;
    });
    if (index > -1) {
      const same =
        e.time.year === dataClick.current.time.year &&
        e.time.month === dataClick.current.time.month &&
        e.time.day === dataClick.current.time.day;

      dataClick.current = {
        time: currentDataVolume[index].time,
        value: currentDataVolume[index].value,
        clickedTwice: same ? !dataClick.current.clickedTwice : false
      };
    }
  };

  const onChangeRangeVolume = async (value: FILTER_DAY = FILTER_DAY.DAY) => {
    try {
      let data = [];

      if (pair) {
        data = await getDataVolumeHistoricalByPair(pair, value);
      } else {
        data = await getDataVolumeHistoricalAll(value);
      }

      setCurrentDataVolume(data);
      if (data.length > 0) {
        setCurrentItem({ ...data[data.length - 1] });
        onUpdateCurrentItem && onUpdateCurrentItem(data[data.length - 1]?.value || 0);
      }
    } catch (e) {
      console.log('Volume ERROR: e', e);
    }
  };

  useEffect(() => {
    onChangeRangeVolume(type);
  }, [type]);

  return {
    currentDataVolume,
    currentItem,
    onCrossMove,
    onClickChart,
    onMouseVolumeLeave
  };
};

export const getDataVolumeHistoricalAll = async (type: FILTER_DAY = FILTER_DAY.DAY) => {
  try {
    const res = await axios.get('/v1/volume/historical/all-charts', {
      params: {
        type
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error('getDataVolumeHistoricalAll', e);
    return [];
  }
};

export const getDataVolumeHistoricalByPair = async (pair: string, type: FILTER_DAY = FILTER_DAY.DAY) => {
  try {
    const res = await axios.get('/v1/volume/historical/chart', {
      params: {
        type,
        pair
      }
    });
    return (res.data || []).filter((item) => item?.time && new Date(item?.time).getFullYear() > MINIMUM_YEAR_STATISTIC);
  } catch (e) {
    console.error(`getDataVolumeHistoricalByPair - pair: ${pair}`, e);
    return [];
  }
};
