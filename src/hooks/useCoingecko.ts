import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useConfigReducer from './useConfigReducer';

/**
 * Constructs the URL to retrieve prices from CoinGecko.
 * @param tokens
 * @returns
 */
export const buildCoinGeckoPricesURL = (tokens: readonly string[]): string =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(
    '%2C'
  )}&vs_currencies=usd`;

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
export const useCoinGeckoPrices = <T extends string>(
  tokens: readonly T[],
  options: Omit<
    UseQueryOptions<CoinGeckoPrices<T>, unknown, CoinGeckoPrices<T>, string[]>,
    'queryKey' | 'queryFn'
  > = {}
): UseQueryResult<CoinGeckoPrices<T>, unknown> => {
  const filteredTokens = [...new Set(tokens)];
  filteredTokens.sort();

  // use cached first then update by query, if is limited then return cached version
  const [cachePrices, setCachePrices] = useConfigReducer('coingecko');

  return useQuery({
    initialData: cachePrices,
    ...options,
    // make unique
    queryKey: ['coinGeckoPrices', ...tokens],
    queryFn: async ({ signal }) => {
      const coingeckoPricesURL = buildCoinGeckoPricesURL(tokens);

      const prices = { ...cachePrices };

      // by default not return data then use cached version
      try {
        const resp = await fetch(coingeckoPricesURL, { signal });
        const rawData = (await resp.json()) as {
          [C in T]?: {
            usd: number;
          };
        };
        // update cached
        for (const key in rawData) {
          prices[key] = rawData[key].usd;
        }

        setCachePrices(prices);
      } catch {
        // remain old cache
      }

      return Object.fromEntries(
        tokens.map((token) => [token, prices[token]])
      ) as CoinGeckoPrices<T>;
    }
  });
};
