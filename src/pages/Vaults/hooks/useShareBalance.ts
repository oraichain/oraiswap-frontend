import { BigDecimal } from '@oraichain/oraidex-common';
import { useQuery } from '@tanstack/react-query';
import { VaultClients } from '../helpers/vault-query';
import { calculateSharePrice } from './useVaults';
import { useVaultDetail } from 'pages/VaultDetail/hooks/useVaultDetail';
import { EVM_DECIMALS } from 'helper/constants';
import axios from 'rest/request';

export const useGetShareBalance = ({ vaultAddress, userAddress, oraiVaultShare }) => {
  const { vaultDetail } = useVaultDetail(vaultAddress);

  const {
    data,
    refetch: refetchShareBalance,
    isLoading
  } = useQuery<{ correspondingShare: string, depositNumber: string }>(
    ['share-balance', vaultDetail, vaultAddress],
    () => getShareBalance({ vaultAddress, userAddress, oraiVaultShare, network: vaultDetail.network }),
    {
      enabled: !!vaultAddress && !!userAddress && !!oraiVaultShare,
      placeholderData: { correspondingShare: '0', depositNumber: '0' },
      keepPreviousData: true
    }
  );

  const sharePrice = vaultDetail ? calculateSharePrice(vaultDetail.totalSupply, vaultDetail.tvl) : 0;

  return {
    shareBalance: data.correspondingShare,
    depositNumber: data.depositNumber,
    refetchShareBalance,
    isLoading,
    shareBalanceInUsd: new BigDecimal(sharePrice).mul(data.correspondingShare).toString()
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
  oraiVaultShare,
  network
}: {
  vaultAddress: string;
  userAddress: string;
  oraiVaultShare: string;
  network: string;
}): Promise<{ correspondingShare: string, depositNumber: string }> => {
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

    const res = await axios.get(
      `/deposit-order/deposit-status?vault=${vaultAddress}&depositor=${userAddress}&network=${network}`,
      { baseURL: process.env.REACT_APP_WORKER_API_URL }
    );

    return { correspondingShare, depositNumber: res.data.length };
  } catch (error) {
    console.error('Error getShareBalance: ', error);
    return { correspondingShare: '0', depositNumber: '0' };
  }
};
