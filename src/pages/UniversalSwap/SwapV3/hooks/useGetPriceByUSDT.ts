import { useQuery } from '@tanstack/react-query';
import axios from 'rest/request';

export const getPriceByUSDT = async (queries: { denom?: string; contractAddress?: string }): Promise<number> => {
  try {
    const res = await axios.get('/price-by-usdt/', { params: queries });
    return res.data.price;
  } catch (e) {
    console.error('getPools', e);
    return 0;
  }
};

export const useGetPriceByUSDT = ({ denom, contractAddress }: { denom?: string; contractAddress?: string }) => {
  const { data: price, refetch: refetchPrice } = useQuery(
    ['useGetPriceByUSDT', denom, contractAddress],
    () => {
      return getPriceByUSDT({ denom, contractAddress });
    },
    { enabled: !!denom || !!contractAddress, refetchOnWindowFocus: true }
  );

  return { price, refetchPrice };
};
