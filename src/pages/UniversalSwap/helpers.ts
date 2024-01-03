import { CwIcs20LatestQueryClient, Uint128 } from '@oraichain/common-contracts-sdk';
import { Ratio } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';
import {
  CoinGeckoId,
  CoinIcon,
  IBC_WASM_CONTRACT,
  NetworkChainId,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  TokenItemType
} from '@oraichain/oraidex-common';
import { PAIRS_CHART } from 'config/pools';
import { generateError } from 'libs/utils';
import { PairToken } from 'reducer/type';

export enum SwapDirection {
  From,
  To
}

export interface SimulateResponse {
  amount: Uint128;
  displayAmount: number;
}

export interface SwapData {
  metamaskAddress?: string;
  tronAddress?: string;
}

export const TYPE_TAB_HISTORY = {
  ASSETS: 'Assets',
  HISTORY: 'History'
};

export interface NetworkFilter {
  label?: string;
  value?: string;
  Icon?: CoinIcon;
  IconLight?: CoinIcon;
}

export const initNetworkFilter = { label: 'All networks', value: '', Icon: undefined, IconLight: undefined };

/**
 * Get transfer token fee when universal swap
 * @param param0
 * @returns
 */
export const getTransferTokenFee = async ({ remoteTokenDenom }): Promise<Ratio | undefined> => {
  try {
    const ibcWasmContractAddress = IBC_WASM_CONTRACT;
    const ibcWasmContract = new CwIcs20LatestQueryClient(window.client, ibcWasmContractAddress);
    const ratio = await ibcWasmContract.getTransferTokenFee({ remoteTokenDenom });
    return ratio;
  } catch (error) {
    console.log({ error });
  }
};

export const checkEvmAddress = (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
  switch (chainId) {
    case '0x01':
    case '0x38':
      if (!metamaskAddress) {
        throw generateError('Please login Metamask wallet!');
      }
      break;
    case '0x2b6653dc':
      if (!tronAddress) {
        throw generateError('Please login Tron wallet!');
      }
  }
};

export const relayerFeeInfo = {
  [ORAI_BRIDGE_EVM_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX]: 6
};

export const AMOUNT_BALANCE_ENTRIES: [number, string, string][] = [
  [0.25, '25%', 'one-quarter'],
  [0.5, '50%', 'half'],
  [0.75, '75%', 'three-quarters'],
  [1, '100%', 'max']
];

export type SwapType = 'Swap' | 'Bridge' | 'Universal Swap';
export const getSwapType = ({
  fromChainId,
  toChainId,
  fromCoingeckoId,
  toCoingeckoId
}: {
  fromChainId: NetworkChainId;
  toChainId: NetworkChainId;
  fromCoingeckoId: CoinGeckoId;
  toCoingeckoId: CoinGeckoId;
}): SwapType => {
  if (fromChainId === 'Oraichain' && toChainId === 'Oraichain') return 'Swap';

  if (fromCoingeckoId === toCoingeckoId) return 'Bridge';

  return 'Universal Swap';
};

export const getExplorerScan = (chainId: NetworkChainId) => {
  switch (chainId) {
    case '0x01':
      return 'https://etherscan.io/tx';
    case '0x38':
      return 'https://bscscan.com/tx';
    case '0x2b6653dc':
      return 'https://tronscan.org/#/transaction';
    case '0x1ae6':
      return 'https://scan.kawaii.global/tx';
    case 'Oraichain':
      return 'https://scan.orai.io/txs';
    case 'osmosis-1':
      return 'https://www.mintscan.io/osmosis/tx';
    case 'cosmoshub-4':
      return 'https://www.mintscan.io/cosmos/tx';
    case 'injective-1':
      return 'https://explorer.injective.network/transaction';
    case 'kawaii_6886-1':
      return 'https://scan.kawaii.global/tx';
    // case: 'noble-1':
    default:
      return 'https://scan.orai.io/txs';
  }
};

// generate TradingView pair base on from & to token in universal-swap
export const generateNewSymbol = (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  currentPair: PairToken
): PairToken | null => {
  let newTVPair: PairToken = { ...currentPair };
  // example: ORAI/ORAI
  let findedPair;
  const isFromTokenEqualToToken = fromToken.name === toToken.name;
  const fromTokenIsOrai = fromToken.name === 'ORAI';
  if (isFromTokenEqualToToken) {
    const symbol = fromTokenIsOrai ? 'USDT' : 'ORAI';
    findedPair = PAIRS_CHART.find((p) => p.symbol.includes(fromToken.name) && p.symbol.includes(symbol));
    if (!findedPair)
      return {
        ...newTVPair,
        symbol: `${fromToken.name}/${toToken.name}`,
        info: ''
      };

    newTVPair.symbol = findedPair.symbol;
    newTVPair.info = findedPair.info;
    return newTVPair;
  }

  findedPair = PAIRS_CHART.find((p) => p.symbol.includes(fromToken.name) && p.symbol.includes(toToken.name));
  // this case when pair NOT in pool
  if (!findedPair) {
    findedPair = PAIRS_CHART.find((p) => p.symbols.includes(fromToken.name));
  }

  if (!findedPair) {
    findedPair = PAIRS_CHART.find((p) => p.symbols.includes(toToken.name));
  }

  if (!findedPair) {
    // this case when user click button reverse swap flow  of pair NOT in pool.
    // return null to prevent re-call api of this pair.
    if (currentPair.symbol.split('/').includes(fromToken.name) && currentPair.symbol.split('/').includes(toToken.name))
      return null;
    newTVPair.symbol = `${fromToken.name}/${toToken.name}`;
    newTVPair.info = '';
  } else {
    // this case when user click button reverse swap flow of pair in pool.
    // return null to prevent re-call api of this pair.
    if (findedPair.symbol === currentPair.symbol) return null;
    newTVPair.symbol = findedPair.symbol;
    newTVPair.info = findedPair.info;
  }
  return newTVPair;
};
