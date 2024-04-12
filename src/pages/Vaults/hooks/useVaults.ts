import { useQuery } from '@tanstack/react-query';
import { getListVaultAddrs, getVaultInfos } from '../helpers/vault-query';
import { EVM_DECIMALS } from 'helper/constants';

export type VaultInfo = {
  vaultAddr: string;
  symbols: [string, string];
  decimals: [number, number];
  apr: number;
  oraiBalance?: string;
  description: string;
  tvlByToken0: string;
  tvlByUsd: string;
  myShare: number;
  totalSupply: string;
};

export const useGetVaults = () => {
  const { data: vaultAddrs, refetch: refetchVaults, isLoading } = useQuery(['vault-addrs'], getListVaultAddrs);
  console.log({ vaultAddrs });
  const {
    data: vaultInfos,
    refetch: refetchVaultInfos,
    isLoading: isLoadingVaultInfos
  } = useQuery(['vault-infos'], () => getVaultInfos(vaultAddrs), {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    enabled: vaultAddrs?.length > 0
  });

  const totalVaultInfos: VaultInfo[] = vaultInfos
    ? vaultInfos.map((info) => {
        return {
          ...info,
          myShare: 1,
          tvlByUsd: '1000',
          symbols: ['USDT', 'WBNB'],
          decimals: [EVM_DECIMALS, EVM_DECIMALS],
          apr: 10,
          oraiBalance: '1',
          description:
            'Strategy: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          totalSupply: '123456'
        };
      })
    : [];
  console.log({ totalVaultInfos });

  return { totalVaultInfos, refetchVaults, isLoading };
};
