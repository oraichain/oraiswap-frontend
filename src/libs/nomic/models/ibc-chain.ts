import Nomic from 'assets/icons/logo.svg';
import { config } from '../config';
import Orai from 'assets/icons/logo.svg';

export interface ChainInfo {
  name: string;
  logo: string;
  chainId: string;
  rpcEndpoint: string;
}

export interface IbcInfo {
  source: {
    channelId: string;
    port: string;
    nBtcIbcDenom: string;
  };
  destination: {
    channelId: string;
    port: string;
  };
  locked: boolean;
}

export type IbcChain = ChainInfo & IbcInfo;

export const OraiBtcSubnetChain: IbcChain = {
  name: 'OraiBtcSubnet',
  logo: Nomic,
  chainId: config.chainId,
  rpcEndpoint: config.rpcUrl,
  source: {
    channelId: 'channel-1',
    port: 'transfer',
    nBtcIbcDenom: 'usat'
  },
  destination: {
    channelId: 'channel-170',
    port: 'wasm.orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm'
  },
  locked: true
};

export const OraichainChain: IbcChain = {
  name: 'Oraichain Mainnet',
  logo: Orai,
  chainId: 'Oraichain',
  rpcEndpoint: 'https://rpc.orai.io',
  source: {
    channelId: 'channel-170',
    port: 'wasm.orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm',
    nBtcIbcDenom: 'usat'
  },
  destination: {
    channelId: 'channel-1',
    port: 'transfer'
  },
  locked: true
};

export const OBTCContractAddress = 'orai1d2hq8pzf0nswlqhhng95hkfnmgutpmz6g8hd8q7ec9q9pj6t3r2q7vc646';

export const Chains: IbcChain[] = [OraiBtcSubnetChain, OraichainChain];
