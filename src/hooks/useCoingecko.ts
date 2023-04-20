import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { cosmosTokens } from 'config/bridgeTokens';
import { CoinGeckoId } from 'config/chainInfos';
import useConfigReducer from './useConfigReducer';
import { fetchPriceMarket } from 'helper';

/**
 * Prices of each token.
 */
export type CoinGeckoPrices<T extends string> = {
  [C in T]: number | null;
};

/**
 * Fetches prices of tokens from CoinGecko.
 * @returns The CoinGecko prices.
 */
export const useCoinGeckoPrices = <T extends CoinGeckoId>(
  options: Omit<UseQueryOptions<CoinGeckoPrices<T>, unknown, CoinGeckoPrices<T>, string[]>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<CoinGeckoPrices<T>, unknown> => {
  const tokens = [...new Set(cosmosTokens.map((t) => t.coinGeckoId))];
  tokens.sort();

  // use cached first then update by query, if is limited then return cached version
  const [cachePrices, setCachePrices] = useConfigReducer('coingecko');

  return useQuery({
    initialData: cachePrices,
    ...options,
    // make unique
    queryKey: ['coinGeckoPrices', ...tokens],
    queryFn: async ({ signal }) => {
      const prices = await fetchPriceMarket(cachePrices, signal);
      setCachePrices(prices);
      return Object.fromEntries(tokens.map((token) => [token, prices[token]])) as CoinGeckoPrices<T>;
    }
  });
};
