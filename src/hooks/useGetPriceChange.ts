import { useQuery } from '@tanstack/react-query';
import axios from 'rest/request';

export const useGetPriceChange = (params: { base_denom: string; quote_denom: string; tf: number }) => {
  const getPriceChange = async (queries: { base_denom: string; quote_denom: string; tf: number }) => {
    try {
      const res = await axios.get('/price', { params: queries });
      return res.data;
    } catch (e) {
      console.error('useGetPriceChange', e);
      return {
        price_change: 0,
        price: 0,
        isError: true
      };
    }
  };

  const { data: priceChange, isLoading } = useQuery(['price-change', params], () => getPriceChange(params), {
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    placeholderData: {
      price: 0,
      price_change: 0
    }
  });

  return {
    isLoading,
    priceChange
  };
};
