import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { fetchLpBalance } from 'rest/api';
import { PoolDetail } from 'types/pool';

export const useGetLpBalance = ({ info: pairInfoData }: PoolDetail) => {
  const [address] = useConfigReducer('address');

  const { data: lpBalanceInfoData } = useQuery(
    ['liquidity-token', pairInfoData],
    () => {
      return fetchLpBalance(address, pairInfoData.liquidityAddr);
    },
    {
      enabled: !!address && !!pairInfoData && !!pairInfoData.liquidityAddr,
      refetchOnWindowFocus: false
    }
  );

  return { lpBalanceInfoData };
};
