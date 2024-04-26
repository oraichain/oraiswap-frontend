import { useQuery } from '@tanstack/react-query';
import axios from 'rest/request';

export const useGetTotalDeposit = () => {
  const { data: totalDepositInUsd, refetch: refetchTotalDepositInUsd } = useQuery<number>(
    ['get-total-deposit'],
    () => getTotalDepositInUsdFromBackend(),
    {
      refetchOnWindowFocus: true,
      placeholderData: 0
    }
  );

  return {
    totalDepositInUsd: totalDepositInUsd < 0 ? 0 : totalDepositInUsd,
    refetchTotalDepositInUsd
  };
};

export const getTotalDepositInUsdFromBackend = async (): Promise<number> => {
  try {
    const res = await axios.get('/v1/tvl/total-deposit-usd', { baseURL: process.env.REACT_APP_VAULT_API_URL });
    return res.data;
  } catch (error) {
    console.error('Error getTotalDepositInUsdFromBackend: ', error);
    return 0;
  }
};
