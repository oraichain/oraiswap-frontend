import { BigDecimal } from '@oraichain/oraidex-common';
import { useQuery } from '@tanstack/react-query';
import { VaultClients } from '../helpers/vault-query';
import { calculateSharePrice } from './useVaults';
import { useVaultDetail } from 'pages/VaultDetail/hooks/useVaultDetail';
import { EVM_DECIMALS } from 'helper/constants';

export const useGetShareBalance = ({ vaultAddress, userAddress, oraiVaultShare }) => {
  const { vaultDetail } = useVaultDetail(vaultAddress);

  const {
    data: shareBalance,
    refetch: refetchShareBalance,
    isLoading
  } = useQuery<string>(
    ['share-balance', vaultDetail, vaultAddress],
    () => getShareBalance({ vaultAddress, userAddress, oraiVaultShare }),
    {
      enabled: !!vaultAddress && !!userAddress && !!oraiVaultShare,
      placeholderData: '0',
      keepPreviousData: true
    }
  );

  const sharePrice = vaultDetail ? calculateSharePrice(vaultDetail.totalSupply, vaultDetail.tvl) : 0;

  return {
    shareBalance,
    refetchShareBalance,
    isLoading,
    shareBalanceInUsd: new BigDecimal(sharePrice).mul(shareBalance).toString()
  };
};

/**
 * Get share balance in vault for user address
 * @param vaultAddr - contract address of vault
 * @param userAddress - user address
 * @param oraiVaultShare - vault balance in Oraichain
 * @returns
 */
export const getShareBalance = async ({
  vaultAddress,
  userAddress,
  oraiVaultShare
}: {
  vaultAddress: string;
  userAddress: string;
  oraiVaultShare: string;
}): Promise<string> => {
  try {
    const shareOfUser = await VaultClients.getOraiGateway(userAddress).balance({
      userAddress,
      vaultAddress
    });

    const totalSupply = await VaultClients.getOraiGateway(userAddress).totalSupply({ vaultAddress });

    let correspondingShare = '0';
    if (new BigDecimal(totalSupply.total_supply).toNumber() !== 0) {
      correspondingShare = new BigDecimal(shareOfUser.amount, EVM_DECIMALS)
        .mul(oraiVaultShare)
        .div(totalSupply.total_supply)
        .toString(); // corresponding share in lp token
    }
    return correspondingShare;
  } catch (error) {
    console.error('Error getShareBalance: ', error);
    return '0';
  }
};
