import { useQuery } from '@tanstack/react-query';
import axios from 'rest/request';
import { PoolInfoResponse } from 'types/pool';
import { STALE_TIME } from '../constants';

export const getPools = async (): Promise<PoolInfoResponse[]> => {
  try {
    const res = await axios.get('/v1/pools/', {});
    return res.data;
  } catch (e) {
    console.error('getPools', e);
    return [];
  }
};

export const useGetPools = () => {
  const { data: pools } = useQuery(['pools'], getPools, {
    refetchOnWindowFocus: true,
    placeholderData: [],
    staleTime: STALE_TIME
  });
  return pools;
};
