import { useQuery } from '@tanstack/react-query';
import { useVaultDetail } from 'pages/VaultDetail/hooks/useVaultDetail';
import axios from 'rest/request';

export const useGetDepositStatus = ({ vaultAddress, userAddress }) => {
  const { vaultDetail } = useVaultDetail(vaultAddress);
  console.log('111', 111);
  const {
    data: numberOfPendingDepositOrders,
    refetch: refetchDepositStatus,
    isLoading
  } = useQuery<number>(
    [`deposit-status`, vaultAddress],
    () => getDepositStatus({ vaultAddress, userAddress, network: vaultDetail.network }),
    {
      //   enabled: !!vaultAddress && !!userAddress
      //   placeholderData: 0
      //   keepPreviousData: true
      enabled: true,
      refetchOnWindowFocus: true
    }
  );

  return {
    numberOfPendingDepositOrders,
    isLoading,
    refetchDepositStatus
  };
};

/**
 * Get deposit status in vault for user address
 * @param vaultAddr - contract address of vault
 * @param userAddress - user address
 * @param network - network of vault
 * @returns number of pending deposit orders
 */
export const getDepositStatus = async ({
  vaultAddress,
  userAddress,
  network
}: {
  vaultAddress: string;
  userAddress: string;
  network: string;
}): Promise<number> => {
  console.log('getDepositStatus');
  try {
    const res = await axios.get(
      `/deposit-order/deposit-status?vault=${vaultAddress}&depositor=${userAddress}&network=${network}`,
      { baseURL: process.env.REACT_APP_WORKER_API_URL }
    );

    console.log({ depositNumber: res.data });

    return res.data.length;
  } catch (error) {
    console.error('Error getVaultsInfoFromBackend: ', error);
    return 0;
  }
};
