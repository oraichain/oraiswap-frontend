import { ReactComponent as AIRI } from 'assets/icons/airi.svg';
import { ReactComponent as ATOMCOSMOS } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as KWT } from 'assets/icons/kwt.svg';
import { ReactComponent as MILKY } from 'assets/icons/milky-token.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as ORAIX } from 'assets/icons/oraix.svg';
import { ReactComponent as scORAI } from 'assets/icons/orchai.svg';
import { ReactComponent as OSMO } from 'assets/icons/osmosis.svg';
import { ReactComponent as USDT } from 'assets/icons/tether.svg';
import { ReactComponent as TRON } from 'assets/icons/tron.svg';
import { ReactComponent as USDC } from 'assets/icons/usd_coin.svg';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import {
  ChainInfoCustom,
  CoinGeckoId,
  CoinIcon,
  embedChainInfos,
  NetworkChainId,
  NetworkName,
  oraichainNetwork
} from './chainInfos';

import {
  AIRI_BSC_CONTRACT,
  BEP20_ORAI,
  BSC_ORG,
  BSC_RPC,
  COSMOS_CHAIN_ID,
  COSMOS_DECIMALS,
  COSMOS_ORG,
  COSMOS_PREFIX,
  COSMOS_TYPE,
  ERC20_ORAI,
  ETHEREUM_ORG,
  ETHEREUM_RPC,
  EVM_DECIMALS,
  EVM_TYPE,
  KAWAII_CONTRACT,
  KAWAII_ORG,
  KAWAII_RPC,
  KWT_BSC_CONTRACT,
  KWT_DENOM,
  KWT_SUBNETWORK_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  MILKY_DENOM,
  MILKY_ERC_CONTRACT,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  ORAI_BRIDGE_ORG,
  ORAI_BRIDGE_PREFIX,
  ORAI_BRIDGE_RPC,
  ORAI_BSC_CONTRACT,
  ORAI_ETH_CONTRACT,
  ORAI_RPC,
  OSMOSIS_CHAIN_ID,
  OSMOSIS_ORG,
  OSMOSIS_PREFIX,
  STABLE_DENOM,
  TRON_CHAIN_ID,
  TRON_DENOM,
  TRON_ORG,
  TRON_RPC,
  USDC_ETH_CONTRACT,
  USDT_BSC_CONTRACT,
  USDT_TRON_CONTRACT,
  WRAP_TRON_TRX_CONTRACT
} from './constants';

export type TokenItemType = {
  name: string;
  org: NetworkName;
  denom: string;
  prefix?: string;
  contractAddress?: string;
  evmDenoms?: string[];
  bridgeNetworkIdentifier?: string;
  bridgeTo?: Array<string>;
  Icon: CoinIcon;
  chainId: NetworkChainId;
  coinType?: number;
  rpc: string;
  decimals: number;
  maxGas?: number;
  factoryV2?: boolean;
  coinGeckoId: CoinGeckoId;
  cosmosBased: Boolean;
  type?: string;
  minAmountSwap?: number;
};

// use factory v2 by looking up minimumDenom as key
const factoryV2CoinDenoms = ['usdc', 'scorai', 'trx'];
const evmDenomsMap = {
  kwt: [process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM],
  milky: [process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM]
};
const minAmountSwapMap = {
  trx: 10
};

// other chains, oraichain
const otherChainTokens: TokenItemType[] = [
  {
    name: 'ATOM',
    org: 'Cosmos Hub',
    coinType: 118,
    prefix: COSMOS_PREFIX,
    coinGeckoId: 'cosmos',
    denom: 'uatom',
    decimals: COSMOS_DECIMALS,
    bridgeTo: [ORAICHAIN_ID],
    chainId: COSMOS_CHAIN_ID,
    rpc: 'https://rpc-cosmos.oraidex.io',
    // lcd: 'https://lcd-cosmoshub.blockapsis.com',
    cosmosBased: true,
    maxGas: 20000 * 0.16,
    Icon: ATOMCOSMOS
  },

  {
    name: 'OSMO',
    org: 'Osmosis',
    prefix: OSMOSIS_PREFIX,
    denom: 'uosmo',
    coinType: 118,
    chainId: OSMOSIS_CHAIN_ID,
    rpc: 'https://rpc.osmosis.interbloc.org',
    // lcd: 'https://lcd-osmosis.keplr.app',
    // lcd: 'https://lcd.osmosis.zone',
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'osmosis',
    bridgeTo: [ORAICHAIN_ID],
    cosmosBased: true,
    maxGas: 20000 * 0.025,
    Icon: OSMO
  },

  {
    name: 'ORAI',
    prefix: ORAI_BRIDGE_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + ORAI_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'oraichain-token',
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'ORAI',
    prefix: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + ORAI_ETH_CONTRACT,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'oraichain-token',
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'USDC',
    prefix: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + USDC_ETH_CONTRACT,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'usd-coin',
    cosmosBased: true,
    Icon: USDC
  },
  {
    name: 'AIRI',
    prefix: ORAI_BRIDGE_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'airight',
    cosmosBased: true,
    Icon: AIRI
  },
  {
    name: 'USDT',
    prefix: ORAI_BRIDGE_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'tether',
    cosmosBased: true,
    Icon: USDT
  },
  {
    name: 'USDT',
    prefix: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + USDT_TRON_CONTRACT,
    bridgeNetworkIdentifier: TRON_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'tether',
    cosmosBased: true,
    Icon: USDT
  },
  {
    name: 'wTRX',
    prefix: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + WRAP_TRON_TRX_CONTRACT,
    bridgeNetworkIdentifier: TRON_ORG,
    rpc: ORAI_BRIDGE_RPC,
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'tron',
    cosmosBased: true,
    Icon: TRON
  },
  {
    name: 'KWT',
    prefix: ORAI_BRIDGE_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    bridgeNetworkIdentifier: BSC_ORG,
    coinType: 118,
    denom: KWT_DENOM,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'kawaii-islands',
    cosmosBased: true,
    Icon: KWT
  },
  {
    name: 'MILKY',
    prefix: ORAI_BRIDGE_PREFIX,
    org: ORAI_BRIDGE_ORG,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    bridgeNetworkIdentifier: BSC_ORG,
    coinType: 118,
    denom: MILKY_DENOM,
    rpc: ORAI_BRIDGE_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'milky-token',
    cosmosBased: true,
    Icon: MILKY
  },

  {
    name: 'ORAI',
    org: BSC_ORG,
    chainId: '0x38',
    denom: BEP20_ORAI,
    contractAddress: ORAI_BSC_CONTRACT,
    rpc: BSC_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: EVM_DECIMALS,
    coinGeckoId: 'oraichain-token',
    cosmosBased: false,
    Icon: OraiIcon
  },
  {
    name: 'ORAI',
    org: ETHEREUM_ORG,
    chainId: '0x01',
    denom: ERC20_ORAI,
    contractAddress: ORAI_ETH_CONTRACT,
    rpc: ETHEREUM_RPC,
    decimals: EVM_DECIMALS,
    bridgeTo: [ORAICHAIN_ID],
    coinGeckoId: 'oraichain-token',
    cosmosBased: false,
    Icon: OraiIcon
  },
  {
    name: 'USDC',
    org: ETHEREUM_ORG,
    chainId: '0x01',
    denom: 'erc20_usdc',
    contractAddress: USDC_ETH_CONTRACT,
    rpc: ETHEREUM_RPC,
    decimals: COSMOS_DECIMALS,
    bridgeTo: [ORAICHAIN_ID],
    coinGeckoId: 'usd-coin',
    cosmosBased: false,
    Icon: USDC
  },
  {
    name: 'AIRI',
    org: BSC_ORG,
    chainId: '0x38',
    denom: 'bep20_airi',
    contractAddress: AIRI_BSC_CONTRACT,
    rpc: BSC_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: EVM_DECIMALS,
    coinGeckoId: 'airight',
    cosmosBased: false,
    Icon: AIRI
  },
  {
    name: 'USDT',
    org: BSC_ORG,
    chainId: '0x38',
    denom: 'bep20_usdt',
    contractAddress: USDT_BSC_CONTRACT,
    rpc: BSC_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: EVM_DECIMALS,
    coinGeckoId: 'tether',
    cosmosBased: false,
    Icon: USDT
  },
  {
    name: 'USDT',
    org: TRON_ORG,
    chainId: '0x2b6653dc',
    denom: 'trx20_usdt',
    contractAddress: USDT_TRON_CONTRACT,
    rpc: TRON_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'tether',
    cosmosBased: false,
    Icon: USDT
  },
  {
    name: 'wTRX',
    org: TRON_ORG,
    chainId: '0x2b6653dc',
    denom: 'trx20_trx',
    contractAddress: WRAP_TRON_TRX_CONTRACT,
    rpc: TRON_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: COSMOS_DECIMALS,
    coinGeckoId: 'tron',
    cosmosBased: false,
    Icon: TRON
  },
  {
    name: 'KWT',
    org: BSC_ORG,
    chainId: '0x38',
    denom: 'bep20_kwt',
    contractAddress: KWT_BSC_CONTRACT,
    rpc: BSC_RPC,
    bridgeTo: [ORAICHAIN_ID],
    decimals: EVM_DECIMALS,
    coinGeckoId: 'kawaii-islands',
    cosmosBased: false,
    Icon: KWT
  },
  {
    name: 'MILKY',
    org: BSC_ORG,
    chainId: '0x38',
    denom: 'bep20_milky',
    contractAddress: MILKY_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'milky-token',
    bridgeTo: [ORAICHAIN_ID],
    cosmosBased: false,
    Icon: MILKY
  },
  {
    name: 'MILKY',
    org: KAWAII_ORG,
    coinGeckoId: 'milky-token',
    denom: process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM,
    decimals: EVM_DECIMALS,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    rpc: KAWAII_RPC,
    bridgeTo: [ORAICHAIN_ID, KAWAII_ORG],
    cosmosBased: true,
    type: 'milky',
    maxGas: 200000 * 2,
    Icon: MILKY
  },
  {
    name: 'ERC20 MILKY',
    org: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    denom: 'erc20_milky',
    bridgeTo: [ORAICHAIN_ID, KAWAII_ORG],
    contractAddress: MILKY_ERC_CONTRACT,
    rpc: KAWAII_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'milky-token',
    cosmosBased: false,
    maxGas: 200000 * 2,
    type: 'milky',
    Icon: MILKY
  },
  {
    name: 'KWT',
    org: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    denom: process.env.REACT_APP_KWT_SUB_NETWORK_DENOM,
    decimals: EVM_DECIMALS,
    bridgeTo: [ORAICHAIN_ID, KAWAII_ORG],
    coinGeckoId: 'kawaii-islands',
    rpc: KAWAII_RPC,
    cosmosBased: true,
    maxGas: 200000 * 2,
    type: 'kawaii',
    Icon: KWT
  },
  {
    name: 'ERC20 KWT',
    org: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    bridgeTo: [ORAICHAIN_ID, KAWAII_ORG],
    denom: 'erc20_kwt',
    contractAddress: KAWAII_CONTRACT,
    rpc: KAWAII_RPC,
    decimals: EVM_DECIMALS,
    coinGeckoId: 'kawaii-islands',
    cosmosBased: false,
    type: 'kawaii',
    Icon: KWT
  }
];

export const getTokensFromNetwork = (network: ChainInfoCustom): TokenItemType[] => {
  return network.currencies.map((currency) => ({
    name: currency.coinDenom,
    org: network.chainName,
    coinType: network.bip44.coinType,
    prefix: network.bech32Config.bech32PrefixAccAddr,
    coinGeckoId: currency.coinGeckoId,
    denom: currency.coinMinimalDenom,
    decimals: currency.coinDecimals,
    bridgeTo: currency.bridgeTo,
    chainId: network.chainId,
    rpc: network.rpc,
    lcd: network.rest,
    cosmosBased: network.networkType === 'cosmos',
    maxGas: (network.gasPriceStep?.high ?? 0) * 20000,
    minAmountSwap: minAmountSwapMap[currency.coinMinimalDenom],
    evmDenoms: evmDenomsMap[currency.coinMinimalDenom],
    factoryV2: factoryV2CoinDenoms.includes(currency.coinMinimalDenom),
    Icon: currency.Icon
  }));
};

const oraichainTokens: TokenItemType[] = getTokensFromNetwork(oraichainNetwork);

export const tokens = [otherChainTokens, oraichainTokens];
export const flattenTokens = flatten(tokens);

export const tokenMap = Object.fromEntries(flattenTokens.map((c) => [c.denom, c]));

export const filteredTokens = uniqBy(
  flattenTokens.filter(
    (token) =>
      // !token.contractAddress &&
      token.denom && token.cosmosBased && token.coinGeckoId
  ),
  (c) => c.denom
);

export const cw20Tokens = uniqBy(
  filteredTokens.filter(
    // filter cosmos based tokens to collect tokens that have contract addresses
    (token) =>
      // !token.contractAddress &&
      token.contractAddress
  ),
  (c) => c.denom
);

export const cw20TokenMap = Object.fromEntries(cw20Tokens.map((c) => [c.contractAddress, c]));

export const evmTokens = uniqBy(
  flattenTokens.filter(
    (token) =>
      // !token.contractAddress &&
      token.denom && !token.cosmosBased && token.coinGeckoId && token.chainId !== KWT_SUBNETWORK_CHAIN_ID
  ),
  (c) => c.denom
);

export const evmChains = uniqBy(
  flattenTokens.filter(
    (token) =>
      // !token.contractAddress &&
      token.denom && !token.cosmosBased && token.coinGeckoId && token.chainId !== KWT_SUBNETWORK_CHAIN_ID
  ),
  (c) => c.chainId
);

export const evmChainsWithoutTron = evmChains.filter((chain) => chain.chainId !== '0x2b6653dc');
export const tronChain = evmChains.filter((chain) => chain.chainId === '0x2b6653dc');

export const kawaiiTokens = uniqBy(
  filteredTokens.filter((token) => token.chainId === KWT_SUBNETWORK_CHAIN_ID),
  (c) => c.denom
);

export const gravityContracts: { [key: string]: string } = {
  ['0x38']: process.env.REACT_APP_GRAVITY_BSC_CONTRACT,
  ['0x01']: process.env.REACT_APP_GRAVITY_ETH_CONTRACT,
  ['0x2b6653dc']: process.env.REACT_APP_GRAVITY_TRON_CONTRACT
};
