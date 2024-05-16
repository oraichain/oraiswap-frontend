import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'rest/request';

export const useTvlChart = () => {
  const { vaultUrl } = useParams();

  const {
    data: tvlChartData,
    refetch: refetchTvlChartData,
    isLoading
  } = useQuery<any[]>(['tvl-chart'], () => getTvlHistoricalChart(vaultUrl), {
    enabled: !!vaultUrl,
    placeholderData: []
  });

  return {
    tvlChartData,
    refetchTvlChartData,
    isLoading
  };
};

export const getTvlHistoricalChart = async (vaultAddr: string) => {
  try {
    const res = await axios.get('/v1/tvl/historical-chart', {
      params: {
        vaultAddr
      },
      baseURL: process.env.REACT_APP_VAULT_API_URL
    });
    return (res.data || []).filter((item) => item.value > 0);
  } catch (e) {
    console.error('getTvlHistoricalChart', e);
    return [];
  }
};
