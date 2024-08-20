import { Position } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { useQuery } from '@tanstack/react-query';
import SingletonOraiswapV3 from 'libs/contractSingleton';

export const useGetPositions = (address: string) => {
  const { data: positions, refetch: refetchPositions } = useQuery<Position[]>(
    ['pool-v3-positions', address],
    () => getPositions(address),
    {
      refetchOnWindowFocus: true,
      placeholderData: [],
      cacheTime: 5 * 60 * 1000
    }
  );

  return {
    positions,
    refetchPositions
  };
};

const getPositions = async (address: string): Promise<Position[]> => {
  try {
    const positions = await SingletonOraiswapV3.getPosition(address);
    return positions;
  } catch (error) {
    console.error('Failed to fetch all positions:', error);
    return [];
  }
};
