import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../ibc-routing';

export const useGetRoutingData = ({ txHash, chainId }) => {
  const { data } = useQuery(['routing_data', txHash, chainId], () => getTransaction({ txHash, chainId }), {
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    refetchInterval: 3000
  });
  return data?.data;
};
