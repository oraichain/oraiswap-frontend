import {
  BSC_SCAN,
  CosmosChainId,
  ETHEREUM_SCAN,
  HIGH_GAS_PRICE,
  KWT_SCAN,
  MULTIPLIER,
  TRON_SCAN,
  WalletType,
  ChainIdEnum,
  BigDecimal,
  COSMOS_CHAIN_ID_COMMON,
  evmChains,
  cosmosChains
} from '@oraichain/oraidex-common';
import { serializeError } from 'serialize-error';
import { network } from 'config/networks';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainIcons, chainInfos } from 'config/chainInfos';
import { CustomChainInfo, EvmDenom, NetworkChainId, TokenItemType } from '@oraichain/oraidex-common';
import Keplr from 'libs/keplr';
import { collectWallet } from 'libs/cosmjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { isMobile } from '@walletconnect/browser-utils';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { leapSnapId } from './constants';
import { getSnap } from '@leapwallet/cosmos-snap-provider';
import { Bech32Config } from '@keplr-wallet/types';

export interface Tokens {
  denom?: string;
  chainId?: NetworkChainId;
  bridgeTo?: Array<NetworkChainId>;
}

export interface InfoError {
  tokenName: string;
  chainName: string;
}

export type DecimalLike = string | number | bigint | BigDecimal;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const EVM_CHAIN_ID: NetworkChainId[] = evmChains.map((c) => c.chainId);
export const networks = chainInfos.filter((c) => c.chainId !== ChainIdEnum.OraiBridge && c.chainId !== '0x1ae6');
export const cosmosNetworks = chainInfos.filter(
  (c) => c.networkType === 'cosmos' && c.chainId !== ChainIdEnum.OraiBridge
);

// export const bitcoinNetworks = chainInfos.filter((c) => c.chainId === ChainIdEnum.Bitcoin);
export const tronNetworks = chainInfos.filter((c) => c.chainId === '0x2b6653dc');
export const filterChainBridge = (token: Tokens, item: CustomChainInfo) => {
  const tokenCanBridgeTo = token.bridgeTo ?? ['Oraichain'];
  return tokenCanBridgeTo.includes(item.chainId);
};

export const getDenomEvm = (): EvmDenom => {
  switch (Number(window.ethereum?.chainId)) {
    case Networks.bsc:
      return 'bep20_orai';
    case Networks.mainnet:
      return 'erc20_orai';
    default:
      return 'kawaii_orai';
  }
};

export const getTransactionUrl = (chainId: NetworkChainId, transactionHash: string) => {
  switch (Number(chainId)) {
    case Networks.bsc:
      return `${BSC_SCAN}/tx/${transactionHash}`;
    case Networks.mainnet:
      return `${ETHEREUM_SCAN}/tx/${transactionHash}`;
    case Networks.tron:
      return `${TRON_SCAN}/#/transaction/${transactionHash.replace(/^0x/, '')}`;
    default:
      // raw string
      switch (chainId) {
        case 'kawaii_6886-1':
          return `${KWT_SCAN}/tx/${transactionHash}`;
        case 'Oraichain':
          return `${network.explorer}/txs/${transactionHash}`;
      }
      return null;
  }
};

export const getAccountUrl = (account: string) => {
  return `${network.explorer}/account/${account}`;
}

export const getNetworkGasPrice = async (chainId): Promise<number> => {
  try {
    const chainInfosWithoutEndpoints = await window.Keplr?.getChainInfosWithoutEndpoints(chainId);
    const findToken = chainInfosWithoutEndpoints.find((e) => e.chainId === chainId);
    if (findToken) {
      return findToken.feeCurrencies[0].gasPriceStep.average;
    }
  } catch {}
  return 0;
};

//hardcode fee
export const feeEstimate = (tokenInfo: TokenItemType, gasDefault: number) => {
  if (!tokenInfo) return 0;
  const MULTIPLIER_ESTIMATE_OSMOSIS = 3.8;
  const MULTIPLIER_FIX = tokenInfo.chainId === 'osmosis-1' ? MULTIPLIER_ESTIMATE_OSMOSIS : MULTIPLIER;
  return new BigDecimal(MULTIPLIER_FIX)
    .mul(tokenInfo.feeCurrencies[0].gasPriceStep.high)
    .mul(gasDefault)
    .div(10 ** tokenInfo.decimals)
    .toNumber();
};

export const compareNumber = (coeff: number, number1: DecimalLike, number2: DecimalLike) => {
  return new BigDecimal(coeff).mul(new BigDecimal(number1).sub(number2)).toNumber();
};

export const subNumber = (number1: number, number2: number) => {
  return new BigDecimal(number1).sub(number2).toNumber();
};

export const mulNumber = (number1: number, number2: number) => {
  return new BigDecimal(number1).mul(number2).toNumber();
};

export const divNumber = (number1: number, number2: number) => {
  return new BigDecimal(number1).div(number2).toNumber();
};

export const addNumber = (number1: number, number2: number) => {
  return new BigDecimal(number1).add(number2).toNumber();
};

export const handleCheckWallet = async () => {
  const keplr = await window.Keplr.getKeplr();
  const isSnap = await getSnap();
  if (!keplr && !isSnap) {
    return displayInstallWallet();
  }
};

export const displayInstallWallet = (altWallet = 'Keplr', message?: string, link?: string) => {
  displayToast(
    TToastType.TX_INFO,
    {
      message: message ?? `You need to install OWallet or ${altWallet} to continue.`,
      customLink: link ?? 'https://chrome.google.com/webstore/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga',
      textLink: 'View on store'
    },
    {
      toastId: 'install_keplr'
    }
  );
};

export const handleCheckAddress = async (chainId: CosmosChainId): Promise<string> => {
  const cosmosAddress = await window.Keplr.getKeplrAddr(chainId);
  if (!cosmosAddress) {
    throw new Error('Please login cosmos wallet Owallet or Keplr!');
  }
  return cosmosAddress;
};

const transferMsgError = (message: string, info?: InfoError) => {
  if (message.includes('invalid hash')) return `Transation was not included to block`;
  if (message.includes('Assertion failed; minimum receive amount'))
    return `Because of high demand, You can increase slippage to increase success rate of the swap!`;
  if (message.includes("Cannot read properties of undefined (reading 'signed')")) return `User rejected transaction`;
  if (message.includes('account sequence mismatch'))
    return `Your previous transaction has not been included in a block. Please wait until it is included before creating a new transaction!`;

  const network = info?.chainName
    ? [...evmChains, ...cosmosChains].find((evm) => evm.chainId === info.chainName)?.chainName
    : '';
  if (message.includes('Insufficient funds to redeem voucher'))
    return `Insufficient ${info?.tokenName ?? ''} liquidity on ${network} Bridge`;
  if (message.includes('user rejected transaction')) return `${network} tokens bridging rejected`;
  if (message.includes('Cannot read property'))
    return `There has been a mistake on the development side causing this issue: ${message}. Please notify the team to fix this bug asap!`;
  if (message.includes('is smaller than') && message.includes('insufficient funds'))
    return `Your wallet does not have enough ${info?.tokenName ?? ''}  funds to execute this transaction.`;
  return String(message);
};

export const handleErrorMsg = (error: any, info?: InfoError) => {
  let finalError = '';
  if (typeof error === 'string' || error instanceof String) {
    finalError = error as string;
  } else {
    if (error?.ex?.message) finalError = transferMsgError(error.ex.message, info);
    else if (error?.message) finalError = transferMsgError(error.message, info);
    else finalError = JSON.stringify(serializeError(error));
  }
  return finalError;
};

export const handleErrorTransaction = (error: any, info?: InfoError) => {
  const finalError = handleErrorMsg(error, info);
  displayToast(TToastType.TX_FAILED, {
    message: finalError
  });
};

export const floatToPercent = (value: number): number => {
  return value * 100;
};

// Switch Wallet Keplr Owallet
export const getStorageKey = (key = 'typeWallet') => {
  return localStorage.getItem(key);
};

export const setStorageKey = (key = 'typeWallet', value) => {
  return localStorage.setItem(key, value);
};

export const checkVersionWallet = () => {
  return window.keplr && window.keplr.version.slice(0, 3) === '0.9'; // TODO: hardcode version of owallet
};

export const keplrCheck = (type: WalletType) => {
  return (type === 'owallet' && !window.owallet) || (type === 'keplr' && !checkVersionWallet());
};

export const owalletCheck = (type: WalletType) => {
  return (type === 'owallet' && !!window.owallet) || (type === 'keplr' && checkVersionWallet());
};

export const switchWallet = (type: WalletType) => {
  if (type === 'owallet' && window.owallet) {
    window.Keplr = new Keplr(type);
    return true;
  }
  return false;
};

export const isUnlockMetamask = async (): Promise<boolean> => {
  const ethereum = window.ethereum;
  if (!ethereum || !ethereum.isMetaMask || !ethereum._metamask) return false;
  return await window.ethereum._metamask.isUnlocked();
};

export const isEmptyObject = (value: object) => {
  if (!value) return true;
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries?.length === 0) return true;
    for (const key in value) {
      if (value[key] !== undefined) return false;
    }
    return true;
  }
  return true;
};

export const switchWalletCosmos = async (type: WalletType) => {
  window.Keplr = new Keplr(type);
  setStorageKey('typeWallet', type);
  const isKeplr = await window.Keplr.getKeplr();
  const isLeapSnap = await getSnap();
  if (!isKeplr && !isLeapSnap) {
    return displayInstallWallet();
  }
  // const wallet = await collectWallet(network.chainId);
  // window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
  //   gasPrice: GasPrice.fromString(`0.002${network.denom}`)
  // });
};

export const switchWalletTron = async () => {
  let tronAddress: string;
  const res = await window.tronLink.request({
    method: 'tron_requestAccounts'
  });
  if (isMobile()) {
    // @ts-ignore
    tronAddress = res?.base58;
    // @ts-ignore
  } else if (!window.owallet?.isOwallet) {
    if (!window.tronWeb.defaultAddress?.base58) {
      const { code, message = 'Tronlink is not ready' } = res;
      if (code !== 200) {
        throw new Error(message);
      }
    }
    tronAddress = window.tronWeb.defaultAddress.base58;
    // @ts-ignore
  } else tronAddress = res?.base58;
  return {
    tronAddress
  };
};

export const getAddress = (addr, prefix: string) => {
  if (!addr) return '';
  const { data } = fromBech32(addr);
  return toBech32(prefix, data);
};

export const genAddressCosmos = (info, address60, address118) => {
  const mapAddress = {
    60: address60,
    118: address118
  };
  const addr = mapAddress[info.bip44.coinType || 118];
  const cosmosAddress = getAddress(addr, info.bech32Config.bech32PrefixAccAddr);
  return { cosmosAddress };
};

export const getListAddressCosmos = async (oraiAddr) => {
  let listAddressCosmos = {};
  const kwtAddress = getAddress(await window.Keplr.getKeplrAddr(COSMOS_CHAIN_ID_COMMON.INJECTVE_CHAIN_ID), 'oraie');
  for (const info of cosmosNetworks) {
    if (!info) continue;
    const { cosmosAddress } = genAddressCosmos(info, kwtAddress, oraiAddr);
    listAddressCosmos = {
      ...listAddressCosmos,
      [info.chainId]: cosmosAddress
    };
  }
  return { listAddressCosmos };
};
export const getChainSupported = async () => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: leapSnapId,
      request: {
        method: 'getSupportedChains'
      }
    }
  });
};
export const getAddressBySnap = async (chainId) => {
  await window.Keplr.suggestChain(chainId);
  const rs = await getChainSupported();
  if (rs?.[chainId]) {
    const { bech32Address } = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: leapSnapId,
        request: {
          method: 'getKey',
          params: {
            chainId: chainId
          }
        }
      }
    });
    if (!bech32Address) throw Error(`Not get bech32Address by ${chainId}`);
    return bech32Address;
  }
  return null;
};

type ChainInfoWithoutIcons = Omit<CustomChainInfo, 'currencies' | 'Icon' | 'IconLight' | 'bech32Config'> & {
  currencies: Array<Omit<CustomChainInfo['currencies'][number], 'Icon' | 'IconLight'>>;
  bech32Config: Bech32Config;
};
const checkErrorObj = (info) => {
  if (info?.Icon && info?.IconLight) {
    const { Icon, IconLight, ...data } = info;
    return data;
  } else if (info?.Icon && !info?.IconLight) {
    const { Icon, ...data } = info;
    return data;
  } else if (!info?.Icon && info?.IconLight) {
    const { IconLight, ...data } = info;
    return data;
  }
  return info;
};
export const chainInfoWithoutIcon = (): ChainInfoWithoutIcons[] => {
  let chainInfoData = [...chainInfos];
  return (chainInfoData as any).map((info) => {
    const infoWithoutIcon = checkErrorObj(info);

    const currenciesWithoutIcons = info.currencies.map((currency) => {
      const currencyWithoutIcons = checkErrorObj(currency);
      return currencyWithoutIcons;
    });

    const stakeCurrencyyWithoutIcons = checkErrorObj(info.stakeCurrency);
    const feeCurrenciesWithoutIcons =
      info?.feeCurrencies &&
      info.feeCurrencies.map((feeCurrency) => {
        const feeCurrencyyWithoutIcon = checkErrorObj(feeCurrency);

        return feeCurrencyyWithoutIcon;
      });

    return {
      ...infoWithoutIcon,
      currencies: currenciesWithoutIcons,
      feeCurrencies: feeCurrenciesWithoutIcons,
      stakeCurrency: stakeCurrencyyWithoutIcons
    };
  });
};
export const getListAddressCosmosByLeapSnap = async () => {
  let listAddressCosmos = {};
  const cosmosNetworksFilter = cosmosNetworks.filter(
    (item, index) => item.chainId !== 'kawaii_6886-1' && item.chainId !== 'injective-1'
  );

  for (const info of cosmosNetworksFilter) {
    if (!info) continue;
    try {
      const cosmosAddress = await getAddressBySnap(info.chainId);
      listAddressCosmos[info.chainId] = cosmosAddress;
    } catch (error) {
      console.log(`🚀 ~ file: index.tsx:316 ~ getListAddressCosmosByLeapSnap ~ error ${info.chainId}:`, error);
    }
  }
  return { listAddressCosmos };
};
