import { PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { useQuery } from '@tanstack/react-query';
import SingletonOraiswapV3 from 'libs/contractSingleton';

export const useGetPoolList = () => {
  const { data: poolList, refetch: refetchPoolList, isLoading: isLoadingGetPoolList } = useQuery<PoolWithPoolKey[]>(
    ['pool-v3-pools'],
    () => getPoolList(),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  return {
    poolList,
    isLoadingGetPoolList,
    refetchPoolList
  };
};

const getPoolList = async (): Promise<PoolWithPoolKey[]> => {
    try {
        const pools = await SingletonOraiswapV3.getPools();
        return pools;
    } catch (error) {
        console.log('error getAllPositions', error);
        return [];
    }
}