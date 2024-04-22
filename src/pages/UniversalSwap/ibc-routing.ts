import Axios from 'axios';
import { throttleAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions';
import { AXIOS_TIMEOUT, AXIOS_THROTTLE_THRESHOLD } from '@oraichain/oraidex-common';

const axios = Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: 'http://127.0.0.1:9001'
});

export const DbStateToChainName = {
  OraichainState: 'Oraichain',
  OraiBridgeState: 'OraiBridge',
  EvmState: 'Evm',
  OraiBridgeState_Next: 'OraiBridge',
  EvmState_Next: 'Evm',
  CosmosState: 'Cosmos'
};

export enum StateDBStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED'
}

export enum EvmChainPrefix {
  BSC_MAINNET = 'oraib',
  ETH_MAINNET = 'eth-mainnet',
  TRON_MAINNET = 'trontrx-mainnet'
}

export interface SubmitTransactionProps {
  txHash: string;
  chainId: string;
}

export const submitTransaction = async (data: SubmitTransactionProps) => {
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

export const getTransaction = async (data: SubmitTransactionProps) => {
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

export interface EvmState {
  txHash: string;
  height: number;
  prevState: string;
  prevTxHash: string;
  nextState: string;
  destination: string;
  fromAmount: string;
  oraiBridgeChannelId: string;
  oraiReceiver: string;
  destinationDenom: string;
  destinationChannelId: string;
  destinationReceiver: string;
  eventNonce: number;
  evmChainPrefix: string;
  status: string;
}

export interface OraiBridgeState {
  txHash: string;
  height: number;
  prevState: string;
  prevTxHash: string;
  nextState: string;
  eventNonce: number;
  batchNonce: number;
  txId: number;
  evmChainPrefix: string;
  packetSequence: number;
  amount: string;
  denom: string;
  memo: string;
  receiver: string;
  sender: string;
  srcPort: string;
  srcChannel: string;
  dstPort: string;
  dstChannel: string;
  status: string;
}

export interface OraichainState {
  txHash: string;
  height: number;
  prevState: string;
  prevTxHash: string;
  nextState: string;
  packetSequence: number;
  packetAck: string;
  sender: string;
  localReceiver: string;
  nextPacketSequence: number;
  nextMemo: string;
  nextAmount: string;
  nextReceiver: string;
  nextDestinationDenom: string;
  srcChannel: string;
  dstChannel: string;
  status: string;
}

export interface CosmosState {
  txHash: string;
  height: number;
  chainId: string;
  prevState: string;
  prevTxHash: string;
  nextState: string;
  packetSequence: number;
  amount: string;
  denom: string;
  memo: string;
  receiver: string;
  sender: string;
  srcPort: string;
  srcChannel: string;
  dstPort: string;
  dstChannel: string;
  status: string;
}
export enum DatabaseEnum {
  Evm = 'EvmState',
  OraiBridge = 'OraiBridgeState',
  Oraichain = 'OraichainState',
  Cosmos = 'CosmosState'
}

export type DBStateType = EvmState | OraiBridgeState | OraichainState | CosmosState;

export type RoutingQueryItem =
  | {
      type: DatabaseEnum.Evm;
      data: EvmState;
    }
  | {
      type: DatabaseEnum.Cosmos;
      data: CosmosState;
    }
  | {
      type: DatabaseEnum.OraiBridge;
      data: OraiBridgeState;
    }
  | {
      type: DatabaseEnum.Oraichain;
      data: OraichainState;
    };
