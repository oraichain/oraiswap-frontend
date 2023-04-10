import { NetworkConfig } from 'types/network';
import { ChainInfoCustom, oraichainNetwork } from './chainInfos';
import { ORAI_SCAN } from './constants';

export const network: ChainInfoCustom & NetworkConfig = {
  ...oraichainNetwork,
  prefix: oraichainNetwork.bech32Config.bech32PrefixAccAddr,
  denom: 'orai',
  coinType: oraichainNetwork.bip44.coinType,
  fee: { gasPrice: '0.00506', amount: '1518', gas: '2000000' }, // 0.000500 ORAI
  factory: process.env.REACT_APP_FACTORY_CONTRACT,
  factory_v2: process.env.REACT_APP_FACTORY_V2_CONTRACT,
  router: process.env.REACT_APP_ROUTER_V2_CONTRACT,
  oracle: process.env.REACT_APP_ORACLE_CONTRACT,
  staking: process.env.REACT_APP_STAKING_CONTRACT,
  rewarder: process.env.REACT_APP_REWARDER_CONTRACT,
  converter: process.env.REACT_APP_CONVERTER_CONTRACT,
  multicall: process.env.REACT_APP_MULTICALL_CONTRACT,
  explorer: ORAI_SCAN
};

export interface NetworkItem {
  cosmosBased: boolean;
  name: string;
  chainId: string;
  icon: string;
  rpc: string;
}

// sadly our Oraichain is not added into keplr yet
export const mobileBlacklistNetworks: string[] = [network.chainId];
