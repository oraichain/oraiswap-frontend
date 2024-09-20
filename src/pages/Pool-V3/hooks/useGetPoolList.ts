import { PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { extractAddress } from '@oraichain/oraiswap-v3';
import { useQuery } from '@tanstack/react-query';
import { oraichainTokens } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { useEffect, useState } from 'react';
import { calcPrice } from '../components/PriceRangePlot/utils';

export const useGetPoolList = (coingeckoPrices: CoinGeckoPrices<string>) => {
  const [prices, setPrices] = useState<CoinGeckoPrices<string>>(coingeckoPrices);
  const {
    data: poolList,
    refetch: refetchPoolList,
    isLoading: isLoadingGetPoolList
  } = useQuery<PoolWithPoolKey[]>(['pool-v3-pools', coingeckoPrices], () => getPoolList(), {
    refetchOnWindowFocus: false,
    placeholderData: []
    // cacheTime: 5 * 60 * 1000
  });

  useEffect(() => {
    // console.log("set pool list again");
    if (poolList.length === 0 || Object.keys(coingeckoPrices).length === 0) return;
    
    const newPrice = { ...coingeckoPrices };
    for (const pool of poolList) {
      const tokenX = oraichainTokens.find((token) => extractAddress(token) === pool.pool_key.token_x);
      const tokenY = oraichainTokens.find((token) => extractAddress(token) === pool.pool_key.token_y);

      if (!prices[tokenX.coinGeckoId] || !tokenX) {
        if (prices[tokenY.coinGeckoId]) {
          // calculate price of X in Y from current sqrt price
          const price = calcPrice(pool.pool.current_tick_index, true, tokenX.decimals, tokenY.decimals);
          newPrice[tokenX.coinGeckoId || tokenX.denom] = price * prices[tokenY.coinGeckoId];
        }
      }

      if (!prices[tokenY.coinGeckoId] || !tokenY) {
        if (prices[tokenX.coinGeckoId]) {
          // calculate price of Y in X from current sqrt price
          const price = calcPrice(pool.pool.current_tick_index, false, tokenX.decimals, tokenY.decimals);
          newPrice[tokenY.coinGeckoId || tokenY.denom] = price * prices[tokenX.coinGeckoId];
        }
      }
    }
    setPrices(newPrice);
  }, [poolList, coingeckoPrices]);

  return {
    poolList,
    poolPrice: prices,
    isLoadingGetPoolList,
    refetchPoolList
  };
};

const getPoolList = async (): Promise<PoolWithPoolKey[]> => {
  try {
    const pools = await SingletonOraiswapV3.getPools();
    return pools;
  } catch (error) {
    console.error('Failed to fetch all positions:', error);
    return [];
  }
};
