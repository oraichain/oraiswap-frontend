import { NetworkConfig } from 'types/network';
import { CustomChainInfo, oraichainNetwork } from './chainInfos';

export const network: CustomChainInfo & NetworkConfig = {
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
  oraidex_listing: process.env.REACT_APP_ORAIDEX_LISTING_CONTRACT,
  multicall: process.env.REACT_APP_MULTICALL_CONTRACT,
  explorer: 'https://scan.orai.io'
};
