import { CoinGeckoId } from '@oraichain/oraidex-common/build/network';
import { oraichainTokens, parseTokenInfoRawDenom } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { FILTER_TIME_CHART } from 'reducer/type';
import axios from 'rest/request';

export const useChartUsdPrice = (
  type: FILTER_TIME_CHART,
  token: CoinGeckoId,
  onUpdateCurrentItem?: React.Dispatch<React.SetStateAction<number>>
) => {
  const [currentData, setCurrentData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState<{
    value: number;
    time: string | number;
  }>({ value: 0, time: 0 });

  const onCrossMove = (item) => {
    if (!item) return;

    setCurrentItem(item);
    onUpdateCurrentItem && onUpdateCurrentItem(item?.value || 0);
  };

  const onMouseLeave = () => {
    if (currentData.length > 0) {
      setCurrentItem(currentData[currentData.length - 1]);
      onUpdateCurrentItem && onUpdateCurrentItem(currentData[currentData.length - 1]?.value || 0);
    } else {
      setCurrentItem({ value: 0, time: 0 });
      onUpdateCurrentItem && onUpdateCurrentItem(0);
    }
  };

  const onChangeRange = async (type: FILTER_TIME_CHART = FILTER_TIME_CHART.DAY) => {
    try {
      setIsLoading(true);
      const tokenOnOraichain = oraichainTokens.find((t) => t.coinGeckoId === token);
      const tokenDenom = parseTokenInfoRawDenom(tokenOnOraichain);

      const data = await getDataPriceMarket(tokenDenom, type);

      const fmtData = (data || []).map((item) => {
        return {
          time: Number(item.time) * 1000,
          value: item.close || 0
        };
      });

      setCurrentData(fmtData);
      if (fmtData.length > 0) {
        setCurrentItem({ ...fmtData[fmtData.length - 1] });
        onUpdateCurrentItem && onUpdateCurrentItem(fmtData[fmtData.length - 1]?.value || 0);
      } else {
        setCurrentItem({ value: 0, time: 0 });
        onUpdateCurrentItem && onUpdateCurrentItem(0);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(' ERROR: e', 'background: #FF0000; color:#FFFFFF', e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onChangeRange(type);
  }, [type, token]);

  // useEffect(() => {
  //   onMouseLeave();
  // }, [currentData]);

  return {
    currentData,
    currentItem,
    onCrossMove,
    onMouseLeave
  };
};
export const MINIMUM_YEAR_STATISTIC = 2000;

// map to seconds
export const FILTER_DAYS = {
  '1H': {
    range: 60 * 60,
    tf: 60
  },
  '4H': {
    range: 4 * 60 * 60,
    tf: 4 * 60
  },
  '1D': {
    range: 24 * 60 * 60,
    tf: 10 * 60
  },
  '1M': {
    range: 30 * 24 * 60 * 60,
    tf: 4 * 60 * 60
  }
};

export const getDataPriceMarket = async (tokenDenom: string, type: FILTER_TIME_CHART = FILTER_TIME_CHART.DAY) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const res = await axios.get(`v2/candles`, {
      params: {
        denom: tokenDenom,
        tf: FILTER_DAYS[type].tf,
        startTime: now - FILTER_DAYS[type].range,
        endTime: now
      }
    });

    return res?.data || [];
  } catch (e) {
    console.error('getCoinPriceMarket', e);
    return [];
  }
};

export const groupDataByTime = (timeType: FILTER_TIME_CHART, data: { time: number; value: number }[]) => {
  switch (timeType) {
    case FILTER_TIME_CHART.ONE_HOUR:
    case FILTER_TIME_CHART.DAY:
      return data.filter((item) => !!item?.value);

    case FILTER_TIME_CHART.FOUR_HOUR: {
      const fmtData = formatDataMarket(data, FILTER_TIME_CHART.FOUR_HOUR, 4 * 60 * 60 * 1000);

      return fmtData;
    }

    case FILTER_TIME_CHART.MONTH: {
      const fmtData = formatDataMarket(data, FILTER_TIME_CHART.MONTH, 30 * 24 * 60 * 60 * 1000);

      return fmtData;
    }

    default:
      return data.filter((item) => !!item?.value);
  }
};

export const formatDataMarket = (
  data: { time: number; value: number }[],
  timeType: FILTER_TIME_CHART,
  coeff: number
) => {
  const groupData = {};
  const fmtData = [];

  data.map((item) => {
    const representedTime = getRepresentedTime(item.time, timeType, coeff);

    if (representedTime) {
      groupData[representedTime] = [...(groupData[representedTime] || []), { ...item, roundTime: representedTime }];
    }

    return { ...item, roundTime: representedTime };
  });

  for (const keyTime in groupData) {
    let sumValue = 0;

    for (const item of groupData[keyTime] || []) {
      sumValue = item.value + sumValue;
    }

    const avgValue = !groupData[keyTime]?.length ? 0 : sumValue / groupData[keyTime]?.length;

    if (avgValue) {
      fmtData.push({
        time: Number(keyTime),
        value: avgValue
      });
    }
  }

  return fmtData;
};

export const getRepresentedTime = (time: number, typeTime: FILTER_TIME_CHART, coeff: number) => {
  if (typeTime === FILTER_TIME_CHART.MONTH) {
    const dateFm = new Date(time);
    const currentMonth = dateFm.getMonth();
    const currentYear = dateFm.getFullYear();

    return new Date(`${currentYear}-${currentMonth}-01`).getTime();
  }

  return Math.floor(time / coeff) * coeff;
};
