import { useQuery } from '@tanstack/react-query';
import { getAllTransactionIBC, getTransactionIBC } from '../ibc-routing';
import { TransactionHistory } from 'libs/duckdb';
import { StateDBStatus } from 'config/ibc-routing';

export const useGetRoutingData = ({ txHash, chainId }: { txHash: string; chainId: string }) => {
  const { data } = useQuery(['routing_data', txHash, chainId], () => getTransactionIBC({ txHash, chainId }), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    refetchInterval: (data) => {
      const routeData = data?.data || [];
      const pendingItems = routeData.filter((item: any) => item.data.status === StateDBStatus.PENDING);
      const isFinished = !routeData.length || (pendingItems.length === 0 && routeData.length !== 0);

      return isFinished ? false : 3000;
    }
  });
  return data?.data;
};

export const useGetAllRoutingData = (transHistory: TransactionHistory[]) => {
  const params = transHistory?.map((tx) => {
    return {
      txHash: tx.initialTxHash,
      chainId: tx.fromChainId
    };
  });

  const { data } = useQuery(['routing_data', params], () => getAllTransactionIBC({ data: params }), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    enabled: !!params,
    refetchInterval: (data) => {
      const routeDatas: any = Object.values(data?.data || {});
      let isFinished = true;

      for (const r of routeDatas) {
        const pendingItems = r.filter((item: any) => item.data.status === StateDBStatus.PENDING);
        const checkFinish = !r.length || (pendingItems.length === 0 && r.length !== 0);

        if (!checkFinish) {
          isFinished = false;
          break;
        }
      }

      return isFinished ? false : 3000;
    }
  });
  return data?.data;
};
