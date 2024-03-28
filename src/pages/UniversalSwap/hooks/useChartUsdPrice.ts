import { CoinGeckoId } from '@oraichain/oraidex-common/build/network';
import { oraichainTokens, parseTokenInfoRawDenom, CW20_DECIMALS } from '@oraichain/oraidex-common';
import { useEffect, useState } from 'react';
import { FILTER_TIME_CHART } from 'reducer/type';
import axios from 'rest/request';
import { toFixedIfNecessary } from 'pages/Pools/helpers';

export const useChartUsdPrice = (
  type: FILTER_TIME_CHART,
  token: CoinGeckoId,
  onUpdateCurrentItem?: React.Dispatch<React.SetStateAction<number>>,
  onUpdatePricePercent?: React.Dispatch<React.SetStateAction<string | number>>
) => {
  const [currentData, setCurrentData] = useState([]);
  const [changePercent, setChangePercent] = useState<string | number>(0);

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
      const tokenOnOraichain = oraichainTokens.find((t) => t.coinGeckoId === token && t.decimals === CW20_DECIMALS);
      const tokenDenom = parseTokenInfoRawDenom(tokenOnOraichain);

      const data = await getDataPriceMarket(tokenDenom, type);

      const fmtData = (data || []).map((item) => {
        return {
          time: Number(item.time) * 1000,
          value: item.close || 0
        };
      });

      if (fmtData?.length) {
        const pricePercent = getPriceUsdChange(fmtData[0]?.value || 0, fmtData[fmtData.length - 1]?.value || 0);

        setChangePercent(pricePercent);
        onUpdatePricePercent && onUpdatePricePercent(pricePercent);
      }

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
    changePercent,
    currentData,
    currentItem,
    onCrossMove,
    onMouseLeave
  };
};
export const MINIMUM_YEAR_STATISTIC = 2000;

// map to seconds
export const FILTER_DAYS = {
  [FILTER_TIME_CHART['DAY']]: {
    range: 24 * 60 * 60,
    tf: 10 * 60
  },
  [FILTER_TIME_CHART['7DAY']]: {
    range: 7 * 24 * 60 * 60,
    tf: 60 * 60
  },
  [FILTER_TIME_CHART['MONTH']]: {
    range: 30 * 24 * 60 * 60,
    tf: 1 * 60 * 60
  },
  [FILTER_TIME_CHART['3MONTH']]: {
    range: 90 * 24 * 60 * 60,
    tf: 3 * 60 * 60
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

export const getPriceUsdChange = (startValue: number, endValue: number) => {
  if (!endValue) return '0.00';
  return toFixedIfNecessary((((endValue - startValue) / endValue) * 100).toString(), 2);
};
