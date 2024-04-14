import { useQuery } from '@tanstack/react-query';
import { flattenTokensWithIcon } from 'config/chainInfos';
import axios from 'rest/request';
import { getVaultInfosFromContract } from '../helpers/vault-query';
import { VaultInfo, VaultInfoBackend, VaultInfoContract } from '../type';
import { useEffect, useState } from 'react';

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
        lpToken: JSON.parse(vaultInfoBackend.lpToken),
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


/**
 * Get vault detail from list vaults find by vaultAddr
 * @param vaultUrl 
 * @returns 
 */
export const useVaultDetail = (vaultUrl: string) => {
  const { totalVaultInfos } = useGetVaults();
  const [vaultDetail, setVaultDetail] = useState<VaultInfo>();

  useEffect(() => {
    if (!vaultUrl || !totalVaultInfos.length) return;

    const vaultDetail = totalVaultInfos.find((vaultInfo) => vaultInfo.vaultAddr === vaultUrl);
    setVaultDetail(vaultDetail);
  }, [vaultUrl, totalVaultInfos.length]);

  return { vaultDetail }

}

