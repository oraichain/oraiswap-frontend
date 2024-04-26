import { useGetVaults } from 'pages/Vaults/hooks';
import { VaultInfo } from 'pages/Vaults/type';
import { useEffect, useState } from 'react';

/**
 * Get vault detail from list vaults find by vaultAddr
 * @param vaultAddr
 * @returns
 */
export const useVaultDetail = (vaultAddr: string) => {
  const { totalVaultInfos } = useGetVaults();
  const [vaultDetail, setVaultDetail] = useState<VaultInfo>();

  useEffect(() => {
    if (!vaultAddr || !totalVaultInfos.length) return;

    const vaultDetail = totalVaultInfos.find((vaultInfo) => vaultInfo.vaultAddr === vaultAddr);
    setVaultDetail(vaultDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddr, totalVaultInfos.length]);

  return { vaultDetail };
};
