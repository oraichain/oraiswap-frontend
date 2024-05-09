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
  denom: string;
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

export const DbStateToChainName = {
  OraichainState: 'Oraichain',
  OraiBridgeState: 'OBridge',
  EvmState: 'Evm',
  OraiBridgeState_Next: 'OBridge',
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
