import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import {
  ChainInfoCustom,
  CoinGeckoId,
  CoinIcon,
  embedChainInfos,
  EvmChainId,
  NetworkChainId,
  NetworkName,
  oraichainNetwork
} from './chainInfos';

import { KWT_SUBNETWORK_CHAIN_ID } from './constants';

export type TokenItemType = {
  name: string;
  org: NetworkName;
  denom: string;
  prefix?: string;
  contractAddress?: string;
  evmDenoms?: string[];
  bridgeNetworkIdentifier?: NetworkChainId;
  bridgeTo?: NetworkChainId[];
  Icon: CoinIcon;
  chainId: NetworkChainId;
  coinType?: number;
  rpc: string;
  decimals: number;
  maxGas?: number;
  factoryV2?: boolean;
  coinGeckoId: CoinGeckoId;
  cosmosBased: Boolean;
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

export const getTokensFromNetwork = (network: ChainInfoCustom): TokenItemType[] => {
  return network.currencies.map((currency) => ({
    name: currency.coinDenom,
    org: network.chainName,
    coinType: network.bip44.coinType,
    prefix: network.bech32Config?.bech32PrefixAccAddr,
    coinGeckoId: currency.coinGeckoId,
    denom: currency.coinMinimalDenom,
    bridgeNetworkIdentifier: currency.bridgeNetworkIdentifier,
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

// other chains, oraichain
const otherChainTokens = flatten(
  embedChainInfos.filter((chainInfo) => chainInfo.chainId !== 'Oraichain').map(getTokensFromNetwork)
);
const oraichainTokens: TokenItemType[] = getTokensFromNetwork(oraichainNetwork);

export const tokens = [otherChainTokens, oraichainTokens];
export const flattenTokens = flatten(tokens);

export const tokenMap = Object.fromEntries(flattenTokens.map((c) => [c.denom, c]));

export const cosmosTokens = uniqBy(
  flattenTokens.filter(
    (token) =>
      // !token.contractAddress &&
      token.denom && token.cosmosBased && token.coinGeckoId
  ),
  (c) => c.denom
);

export const cw20Tokens = uniqBy(
  cosmosTokens.filter(
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
  cosmosTokens.filter((token) => token.chainId === KWT_SUBNETWORK_CHAIN_ID),
  (c) => c.denom
);

console.log(cosmosTokens);
export const gravityContracts: Omit<Record<EvmChainId, string>, '0x1ae6'> = {
  ['0x38']: process.env.REACT_APP_GRAVITY_BSC_CONTRACT,
  ['0x01']: process.env.REACT_APP_GRAVITY_ETH_CONTRACT,
  ['0x2b6653dc']: process.env.REACT_APP_GRAVITY_TRON_CONTRACT
};
