import Axios from 'axios';
import { throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import { AXIOS_TIMEOUT, AXIOS_THROTTLE_THRESHOLD } from '@oraichain/oraidex-common';
import { PendingDeposit, DepositInfo } from '../@types';
import { useQuery } from '@tanstack/react-query';

const axios = Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: 'https://btc.relayer.orai.io'
});

const getPendingDeposits = async (address?: String): Promise<DepositInfo[]> => {
  try {
    const res = await axios.get('/pending_deposits', {
      params: {
        receiver: address
      }
    });
    return res.data.map((item: PendingDeposit) => ({
      confirmations: item.confirmations,
      ...item.deposit
    })) as DepositInfo[];
  } catch (e) {
    console.error('getPendingDeposits', e);
    return [];
  }
};

export const useGetPendingDeposits = (address?: String) => {
  const { data } = useQuery(['pending_deposits', address], () => getPendingDeposits(address), {
    refetchOnWindowFocus: true,
    refetchInterval: 10000
  });
  return data;
};
