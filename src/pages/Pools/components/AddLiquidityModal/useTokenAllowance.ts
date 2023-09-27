import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import { TokenItemType } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import { fetchTokenAllowance } from 'rest/api';

export const useTokenAllowance = (pairInfoData: PairInfo, tokenInfoData: TokenItemType) => {
  const [address] = useConfigReducer('address');

  return useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), tokenInfoData],
    () => {
      return fetchTokenAllowance(tokenInfoData.contractAddress!, address, pairInfoData!.contract_addr);
    },
    {
      enabled: !!address && !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );
};
