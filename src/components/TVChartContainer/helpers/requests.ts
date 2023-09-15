import { PeriodParams } from 'charting_library';
import { Bar } from './types';
import axios, { withBaseApiUrl } from 'rest/request';

export const getTokenChartPrice = async (
  pair: string,
  periodParams: PeriodParams,
  resolution: string
): Promise<Bar[]> => {
  try {
    const res = await axios.get(withBaseApiUrl('/v1/candles/'), {
      params: {
        pair,
        startTime: periodParams.from,
        endTime: periodParams.to,
        tf: +resolution * 60
      }
    });
    return res.data;
  } catch (e) {
    console.error('GetTokenChartPrice', e);
    return [];
  }
};
