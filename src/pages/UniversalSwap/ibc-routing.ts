import Axios from 'axios';
import { throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import { AXIOS_TIMEOUT, AXIOS_THROTTLE_THRESHOLD } from '@oraichain/oraidex-common';
import { SubmitTransactionProps } from 'config/ibc-routing';

const axios = Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: process.env.REACT_APP_BASE_IBC_ROUTING_URL
  // baseURL: 'http://localhost:9001'
});

export const submitTransactionIBC = async (data: SubmitTransactionProps) => {
  try {
    const res = await axios.post('/api/routing', data);
    return [res.data, true];
  } catch (error) {
    return [
      {
        message: error?.message || 'Something went wrong',
        data: []
      },
      false
    ];
  }
};

export const getTransactionIBC = async (data: SubmitTransactionProps) => {
  try {
    const res = await axios.get('/api/routing', { params: data });
    return res.data;
  } catch (error) {
    return {
      message: 'Failed',
      data: {}
    };
  }
};

export const getAllTransactionIBC = async (data: { data: SubmitTransactionProps[] }) => {
  try {
    const res = await axios.get('/api/all-routing', { params: data });
    return res.data;
  } catch (error) {
    return {
      message: 'Failed',
      data: {}
    };
  }
};
