import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import { chainInfos, oraichainNetwork } from './chainInfos';
import {
  CustomChainInfo,
  INJECTIVE_ORAICHAIN_DENOM,
  KWTBSC_ORAICHAIN_DENOM,
  MILKYBSC_ORAICHAIN_DENOM,
  TokenItemType
} from '@oraichain/oraidex-common';

const evmDenomsMap = {
  kwt: [KWTBSC_ORAICHAIN_DENOM],
  milky: [MILKYBSC_ORAICHAIN_DENOM],
  injective: [INJECTIVE_ORAICHAIN_DENOM]
};
const minAmountSwapMap = {
  trx: 10
};

export const getTokensFromNetwork = (network: CustomChainInfo): TokenItemType[] => {
  return network.currencies.map((currency) => ({
    name: currency.coinDenom,
    org: network.chainName,
    coinType: network.bip44.coinType,
    contractAddress: currency.contractAddress,
    prefix: currency?.prefixToken ?? network.bech32Config?.bech32PrefixAccAddr,
    coinGeckoId: currency.coinGeckoId,
    denom: currency.coinMinimalDenom,
    bridgeNetworkIdentifier: currency.bridgeNetworkIdentifier,
    decimals: currency.coinDecimals,
    bridgeTo: currency.bridgeTo,
    chainId: network.chainId,
    rpc: network.rpc,
    lcd: network.rest,
    cosmosBased: network.networkType === 'cosmos',
    maxGas: (network.feeCurrencies?.[0].gasPriceStep?.high ?? 0) * 20000,
    gasPriceStep: currency.gasPriceStep,
    feeCurrencies: network.feeCurrencies,
    minAmountSwap: minAmountSwapMap[currency.coinMinimalDenom],
    evmDenoms: evmDenomsMap[currency.coinMinimalDenom],
    Icon: currency.Icon,
    IconLight: currency?.IconLight
  }));
};
