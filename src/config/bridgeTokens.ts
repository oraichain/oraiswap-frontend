import { Currency } from '@keplr-wallet/types';
import {
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  BSC_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  KWT_SUBNETWORK_CHAIN_ID,
  TRON_CHAIN_ID
} from 'config/constants';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import { embedNetworkInfos } from './networkInfos';

export type IBCCurrency = Currency & {
  paths: {
    portId: string;
    channelId: string;
  }[];
  /**
   * The chain id that the currency is from.
   * If that chain is unknown, this will be undefined.
   */
  originChainId: string | undefined;
  originCurrency: Currency | undefined;
};

/**
 * Remove chainId, coinType, decimals, denom, coingeckoId
 * Add
 *    readonly coinDenom: string;
      readonly coinMinimalDenom: string;
      readonly coinDecimals: number;
      readonly coingGeckoId: string;
      bridgePrefix: prefix for oraibridge token
 */
export type TokenItemType = (Currency | IBCCurrency) & {
  name: string;
  org:
    | 'Oraichain'
    | 'Cosmos Hub'
    | 'Osmosis'
    | 'OraiBridge'
    | 'BNB Chain'
    | 'Ethereum'
    | 'Kawaiiverse'
    | 'Tron Network'
    | string;
  contractAddress?: string;
  evmDenoms?: string[];
  bridgeNetworkIdentifier?: string;
  bridgeTo?: Array<string>;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  maxGas?: number;
  factoryV2?: boolean;
  cosmosBased: Boolean;
  minAmountSwap?: number;
  rpc: string;
  bridgePrefix?: string;
  chainId: string | number;
  type?: string;
};

export const tokens = embedNetworkInfos.map((i) => i.chainCurrencies);
export const flattenTokens = flatten(tokens);

export const tokenMap = Object.fromEntries(flattenTokens.map((c) => [c.coinDenom, c]));

// cosmos based tokens
export const filteredTokens = uniqBy(
  flattenTokens.filter((token) => token.cosmosBased),
  (c) => c.coinDenom
);

// filter cosmos based tokens to collect tokens that have contract addresses
export const cw20Tokens = uniqBy(
  filteredTokens.filter((token) => token.contractAddress),
  (c) => c.coinDenom
);
export const cw20TokenMap = Object.fromEntries(cw20Tokens.map((c) => [c.contractAddress, c]));

export const evmChains = embedNetworkInfos.filter(
  (i) =>
    i.chainId === String(BSC_CHAIN_ID) || i.chainId === String(ETHEREUM_CHAIN_ID || i.chainId === String(TRON_CHAIN_ID))
);

export const evmTokens = flatten(evmChains.map((chain) => chain.chainCurrencies));
export const evmChainsWithoutTron = evmChains.filter((chain) => chain.chainId !== String(TRON_CHAIN_ID));

// evm map and no bridge to option
export const evmMapToken = embedNetworkInfos
  .find((chain) => chain.chainId === ORAICHAIN_ID)
  .chainCurrencies.filter((t) => t.name.includes('BEP20'));

export const kawaiiTokens = embedNetworkInfos.find((i) => i.chainId === KWT_SUBNETWORK_CHAIN_ID).chainCurrencies;

export const tronChain = embedNetworkInfos.find((i) => i.chainId === String(TRON_CHAIN_ID));

export const cosmosNetworks = embedNetworkInfos.filter((network) => network.isCosmosBased);

export const networksWithoutOraib = embedNetworkInfos.filter((network) => network.chainId !== ORAI_BRIDGE_CHAIN_ID);

export const gravityContracts: { [key: string]: string } = {
  [BSC_CHAIN_ID]: process.env.REACT_APP_GRAVITY_BSC_CONTRACT,
  [ETHEREUM_CHAIN_ID]: process.env.REACT_APP_GRAVITY_ETH_CONTRACT,
  [TRON_CHAIN_ID]: process.env.REACT_APP_GRAVITY_TRON_CONTRACT
};
