import OraiBtc from 'assets/icons/btc-icon.svg';
import { config } from '../config';
import Orai from 'assets/icons/btc-icon.svg';

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
  logo: OraiBtc,
  chainId: config.chainId,
  rpcEndpoint: config.rpcUrl,
  source: {
    channelId: 'channel-0',
    port: 'transfer',
    nBtcIbcDenom: 'usat'
  },
  destination: {
    channelId: 'channel-227',
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
    channelId: 'channel-227',
    port: 'wasm.orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm',
    nBtcIbcDenom: 'usat'
  },
  destination: {
    channelId: 'channel-0',
    port: 'transfer'
  },
  locked: true
};

const OBTCContractAddressMainnet = 'orai10g6frpysmdgw5tdqke47als6f97aqmr8s3cljsvjce4n5enjftcqtamzsd';
export const OBTCContractAddress = OBTCContractAddressMainnet;
export const Chains: IbcChain[] = [OraiBtcSubnetChain, OraichainChain];
