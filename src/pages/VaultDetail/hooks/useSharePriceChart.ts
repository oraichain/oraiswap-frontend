import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'rest/request';

export const useSharePriceChart = () => {
  const { vaultUrl } = useParams();

  const {
    data: sharePriceChartData,
    refetch: refetchSharePriceChartData,
    isLoading
  } = useQuery<any[]>(['share-price-chart'], () => getSharePriceHistoricalChart(vaultUrl), {
    enabled: !!vaultUrl,
    placeholderData: []
  });

  return {
    sharePriceChartData,
    refetchSharePriceChartData,
    isLoading
  };
};

export const getSharePriceHistoricalChart = async (vaultAddr: string) => {
  try {
    const res = await axios.get('/v1/share-price/historical-chart', {
      params: {
        vaultAddr
      },
      baseURL: process.env.REACT_APP_VAULT_API_URL
    });
    return (res.data || []).filter((item) => item.value > 0);
  } catch (e) {
    console.error('getSharePriceHistoricalChart', e);
    return [];
  }
};
