import { TokenItemType } from '@oraichain/oraidex-common';
import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { fetchTokenAllowance } from 'rest/api';

export const useTokenAllowance = (pairAddr: string, tokenInfoData: TokenItemType) => {
  const [address] = useConfigReducer('address');

  return useQuery(
    ['token-allowance', pairAddr, tokenInfoData],
    () => {
      return fetchTokenAllowance(tokenInfoData.contractAddress!, address, pairAddr);
    },
    {
      enabled: !!address && !!pairAddr,
      refetchOnWindowFocus: false
    }
  );
};
