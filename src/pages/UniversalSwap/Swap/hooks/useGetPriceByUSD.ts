import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { CoinGeckoId } from '@oraichain/oraidex-common/build/network';
import { useQuery } from '@tanstack/react-query';
import axios from 'rest/request';

export type GetPriceHookParam = { denom?: string; contractAddress?: string; cachePrices: CoinGeckoPrices<CoinGeckoId> };

export const getPriceByUSDT = async (queries: { denom?: string; contractAddress?: string }): Promise<number> => {
  try {
    const res = await axios.get('/price-by-usdt/', { params: queries });
    return res.data.price;
  } catch (e) {
    console.error('getPools', e);
    return 0;
  }
};

export const getPriceTokenInUSD = async ({
  denom,
  contractAddress,
  cachePrices
}: GetPriceHookParam): Promise<number> => {
  const priceByUsdt = await getPriceByUSDT({ denom, contractAddress });
  return cachePrices['tether'] * priceByUsdt;
};

export const useGetPriceByUSD = ({ denom, contractAddress, cachePrices }: GetPriceHookParam) => {
  const { data: price, refetch: refetchPrice } = useQuery(
    ['useGetPriceByUSDT', denom, contractAddress],
    () => getPriceTokenInUSD({ denom, contractAddress, cachePrices }),
    { enabled: !!denom || !!contractAddress, refetchOnWindowFocus: true }
  );

  return { price, refetchPrice };
};
