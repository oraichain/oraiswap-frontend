import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { fetchLpBalance } from 'rest/api';
import { PoolDetail } from 'types/pool';

export const useGetLpBalance = ({ info: pairInfoData }: PoolDetail) => {
  const [address] = useConfigReducer('address');

  const { data: lpBalanceInfoData, refetch: refetchLpBalanceInfoData } = useQuery(
    ['liquidity-token', address, pairInfoData],
    () => {
      return fetchLpBalance(address, pairInfoData.liquidityAddr);
    },
    {
      enabled: !!address && !!pairInfoData && !!pairInfoData.liquidityAddr,
      refetchOnWindowFocus: false
    }
  );

  return { lpBalanceInfoData, refetchLpBalanceInfoData };
};
