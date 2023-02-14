import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useLocalStorage from './useLocalStorage';

/**
 * Performs a GET request, returning `null` if 404.
 *
 * @param url
 * @param signal
 * @returns
 */
export const fetchNullable = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  try {
    const resp = await fetch(url, { signal });
    return (await resp.json()) as T;
  } catch (ex) {
    return {} as T;
  }
};

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
  const [cachePrices, setCachePrices] = useLocalStorage<
    CoinGeckoPrices<string>
  >('cg_prices', {});

  return useQuery({
    initialData: cachePrices,
    ...options,
    // make unique
    queryKey: ['coinGeckoPrices', ...tokens],
    queryFn: async ({ signal }) => {
      const coingeckoPricesURL = buildCoinGeckoPricesURL(tokens);

      // by default not return data then use cached version
      const rawData = await fetchNullable<{
        [C in T]?: {
          usd: number;
        };
      }>(coingeckoPricesURL, signal);

      // update cached
      for (const key in rawData) {
        cachePrices[key] = rawData[key].usd;
      }

      setCachePrices(cachePrices);

      return Object.fromEntries(
        tokens.map((token) => [token, cachePrices[token]])
      ) as CoinGeckoPrices<T>;
    }
  });
};
