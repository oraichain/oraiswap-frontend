import { ChainInfo } from '@keplr-wallet/types';
import {
  ORAI_BRIDGE_CHAIN_ID,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI_BRIDGE_DENOM,
  ORAI_BRIDGE_LCD,
  ORAI_BRIDGE_RPC,
  ORAI_BRIDGE_UDENOM,
  ORAI_RPC,
  ORAI_LCD,
  ORAICHAIN_ID,
  ORAI_SCAN
} from './constants';

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 */
export interface ChainInfoCustom extends ChainInfo {
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
}

export const embedChainInfos: ChainInfoCustom[] = [
  {
    rpc: ORAI_RPC,
    rest: ORAI_LCD,
    chainId: ORAICHAIN_ID,
    chainName: ORAICHAIN_ID,
    stakeCurrency: {
      coinDenom: 'ORAI',
      coinMinimalDenom: 'orai',
      coinDecimals: 6,
      coinGeckoId: 'oraichain-token',
      coinImageUrl:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png'
    },
    walletUrl: 'https://api.wallet.orai.io',
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'orai',
      bech32PrefixAccPub: 'oraipub',
      bech32PrefixValAddr: 'oraivaloper',
      bech32PrefixValPub: 'oraivaloperpub',
      bech32PrefixConsAddr: 'oraivalcons',
      bech32PrefixConsPub: 'oraivalconspub'
    },
    get currencies() {
      return [this.stakeCurrency];
    },
    get feeCurrencies() {
      return [this.stakeCurrency];
    },
    walletUrlForStaking: `${ORAI_SCAN}/validators`,
    gasPriceStep: {
      low: 0.003,
      average: 0.005,
      high: 0.007
    },
    features: ['stargate', 'ibc-transfer', 'cosmwasm', 'wasmd_0.24+']
  },
  {
    rpc: ORAI_BRIDGE_RPC,
    rest: ORAI_BRIDGE_LCD,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    chainName: 'OraiBridge',
    stakeCurrency: {
      coinDenom: ORAI_BRIDGE_DENOM,
      coinMinimalDenom: ORAI_BRIDGE_UDENOM,
      coinDecimals: 6,
      coinGeckoId: 'oraichain-token',
      coinImageUrl:
        'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png'
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'oraib',
      bech32PrefixAccPub: 'oraibpub',
      bech32PrefixValAddr: 'oraibvaloper',
      bech32PrefixValPub: 'oraibvaloperpub',
      bech32PrefixConsAddr: 'oraibvalcons',
      bech32PrefixConsPub: 'oraibvalconspub'
    },
    get currencies() {
      return [this.stakeCurrency];
    },
    get feeCurrencies() {
      return [this.stakeCurrency];
    },
    gasPriceStep: {
      low: 0,
      average: 0,
      high: 0
    },
    features: ['stargate', 'ibc-transfer', 'cosmwasm']
  },
  {
    rpc: 'https://tendermint1.kawaii.global',
    rest: 'https://cosmos1.kawaii.global',
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    chainName: 'Kawaiiverse',
    stakeCurrency: {
      coinDenom: 'ORAIE',
      coinMinimalDenom: 'oraie',
      coinDecimals: 18,
      coinGeckoId: 'oraie'
    },
    bip44: {
      coinType: 60
    },
    bech32Config: {
      bech32PrefixAccAddr: 'oraie',
      bech32PrefixAccPub: 'oraiepub',
      bech32PrefixValAddr: 'oraievaloper',
      bech32PrefixValPub: 'oraievaloperpub',
      bech32PrefixConsAddr: 'oraievalcons',
      bech32PrefixConsPub: 'oraievalconspub'
    },
    get currencies() {
      return [this.stakeCurrency];
    },
    get feeCurrencies() {
      return [this.stakeCurrency];
    },
    gasPriceStep: {
      low: 0,
      average: 0.000025,
      high: 0.00004
    },
    features: [
      'ibc-transfer',
      'ibc-go',
      'stargate',
      'eth-address-gen',
      'eth-key-sign'
    ]
  }
];

// console.log(embedChainInfos[2]);
