import { useQuery } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import { TransactionHistory } from 'libs/duckdb';

export const useGetTransHistory = () => {
  const [address] = useConfigReducer('address');

  const getTransactionHistory = async (): Promise<TransactionHistory[]> => {
    try {
      const transHistory = await window.duckDb.getTransHistory(address);
      return transHistory;
    } catch (e) {
      console.error('error getTransactionHistory: ', e);
    }
  };

  const { data: transHistory, refetch: refetchTransHistory } = useQuery(
    ['trans-history', address],
    () => getTransactionHistory(),
    {
      refetchOnWindowFocus: false,
      placeholderData: [],
      enabled: !!address && !!window.duckDb
    }
  );

  return { transHistory, refetchTransHistory };
};
