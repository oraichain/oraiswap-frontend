import { NetworkConfig } from 'types/network';
import { oraichainNetwork } from './chainInfos';
import {
  CONVERTER_CONTRACT,
  CustomChainInfo,
  FACTORY_CONTRACT,
  FACTORY_V2_CONTRACT,
  MULTICALL_CONTRACT,
  ORACLE_CONTRACT,
  ORAIDEX_LISTING_CONTRACT,
  REWARDER_CONTRACT,
  ROUTER_V2_CONTRACT,
  STAKING_CONTRACT,
  ORAIDEX_BID_POOL_CONTRACT,
  CW20_STAKING_CONTRACT
} from '@oraichain/oraidex-common';

// const POOL_V3 = 'orai10s0c75gw5y5eftms5ncfknw6lzmx0dyhedn75uz793m8zwz4g8zq4d9x9a';
const POOL_V3 = 'orai1wsemv2wuyfeesh3afcxy02lh8sy4yz2wjj6cxgzmcxklpdyyxjfs5qzl7q';

export const network: CustomChainInfo & NetworkConfig & { pool_v3: string } = {
  ...oraichainNetwork,
  prefix: oraichainNetwork.bech32Config.bech32PrefixAccAddr,
  denom: 'orai',
  coinType: oraichainNetwork.bip44.coinType,
  fee: { gasPrice: '0.00506', amount: '1518', gas: '2000000' }, // 0.000500 ORAI
  factory: FACTORY_CONTRACT,
  factory_v2: FACTORY_V2_CONTRACT,
  router: ROUTER_V2_CONTRACT,
  oracle: ORACLE_CONTRACT,
  staking: STAKING_CONTRACT,
  rewarder: REWARDER_CONTRACT,
  converter: CONVERTER_CONTRACT,
  oraidex_listing: ORAIDEX_LISTING_CONTRACT,
  bid_pool: ORAIDEX_BID_POOL_CONTRACT,
  staking_oraix: CW20_STAKING_CONTRACT,
  multicall: MULTICALL_CONTRACT,
  explorer: 'https://scan.orai.io',
  pool_v3: POOL_V3
};
