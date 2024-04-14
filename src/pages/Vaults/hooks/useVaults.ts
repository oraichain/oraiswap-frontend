import { useQuery } from '@tanstack/react-query';
import { flattenTokensWithIcon } from 'config/chainInfos';
import axios from 'rest/request';
import { getVaultInfosFromContract } from '../helpers/vault-query';
import { VaultInfo, VaultInfoBackend, VaultInfoContract } from '../type';

export const useGetVaults = () => {
  const { data: vaultsBackend, refetch: refetchVaults, isLoading } = useQuery(['vaults-backend'], getVaultsInfoFromBackend);
  console.log({
    vaultsBackend

  });
  const {
    data: vaultInfosContract,
    refetch: refetchVaultInfos,
    isLoading: isLoadingVaultInfos
  } = useQuery<VaultInfoContract[]>(['vaults-contract'], () => getVaultInfosFromContract(vaultsBackend?.map(vault => vault.vaultAddr)), {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    enabled: vaultsBackend?.length > 0
  });

  // combine data from vault backend & vault contract
  const totalVaultInfos: VaultInfo[] = vaultInfosContract
    ? vaultInfosContract.map((vaultInfoContract, index) => {
      const vaultInfoBackend = vaultsBackend[index]
      if (!vaultInfoBackend) return null
      return {
        ...vaultInfoContract,
        ...vaultInfoBackend,
        token0: JSON.parse(vaultInfoBackend.token0),
        token1: JSON.parse(vaultInfoBackend.token1),
        tokenInfo0: flattenTokensWithIcon.find(token => token.name === JSON.parse(vaultInfoBackend.token0).symbol),
        tokenInfo1: flattenTokensWithIcon.find(token => token.name === JSON.parse(vaultInfoBackend.token1).symbol),
      };
    }).filter(Boolean)
    : [];

  console.log({ totalVaultInfos });

  return { totalVaultInfos, refetchVaults, isLoading, refetchVaultInfos, isLoadingVaultInfos };
};


export const getVaultsInfoFromBackend = async (): Promise<VaultInfoBackend[]> => {
  try {
    const res = await axios.get('/v1/vaults/', { baseURL: process.env.REACT_APP_VAULT_API_URL });
    return res.data;
  } catch (error) {
    console.error("Error getVaultsInfoFromBackend: ", error);
    return []
  }
}