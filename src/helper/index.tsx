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
  BigDecimal
} from '@oraichain/oraidex-common';

import { network } from 'config/networks';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos } from 'config/chainInfos';
import { CustomChainInfo, EvmDenom, NetworkChainId, TokenItemType } from '@oraichain/oraidex-common';
import Keplr from 'libs/keplr';
import { collectWallet } from 'libs/cosmjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { isMobile } from '@walletconnect/browser-utils';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
export interface Tokens {
  denom?: string;
  chainId?: NetworkChainId;
  bridgeTo?: Array<NetworkChainId>;
}

export type DecimalLike = string | number | bigint | BigDecimal;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const networks = chainInfos.filter((c) => c.chainId !== ChainIdEnum.OraiBridge && c.chainId !== '0x1ae6');
export const cosmosNetworks = chainInfos.filter(
  (c) => c.networkType === 'cosmos' && c.chainId !== ChainIdEnum.OraiBridge
);
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

export const getNetworkGasPrice = async (): Promise<number> => {
  try {
    const chainInfosWithoutEndpoints = await window.Keplr?.getChainInfosWithoutEndpoints();
    const findToken = chainInfosWithoutEndpoints.find((e) => e.chainId == network.chainId);
    if (findToken) {
      return findToken.feeCurrencies[0].gasPriceStep.average;
    }
  } catch { }
  return 0;
};

//hardcode fee
export const feeEstimate = (tokenInfo: TokenItemType, gasDefault: number) => {
  if (!tokenInfo) return 0;

  return new BigDecimal(MULTIPLIER)
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
  if (!keplr) {
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
    throw new Error('Please login both metamask and keplr!');
  }
  return cosmosAddress;
};

export const handleErrorMsg = (error: any) => {
  let finalError = '';
  if (typeof error === 'string' || error instanceof String) {
    finalError = error as string;
  } else {
    if (error?.ex?.message) finalError = String(error.ex.message);
    else if (error?.message) finalError = String(error.message);
    else finalError = JSON.stringify(error);
  }
  return finalError
}

export const handleErrorTransaction = (error: any) => {
  const finalError = handleErrorMsg(error)
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
  if (!!value === false) return true;
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries?.length === 0) {
      return true;
    }
    for (const key in value) {
      if (value[key] !== undefined) {
        return false;
      }
    }
    return true;
  }
  return true;
};

export const switchWalletCosmos = async (type: WalletType) => {
  window.Keplr = new Keplr(type);
  setStorageKey('typeWallet', type);
  if (!(await window.Keplr.getKeplr())) {
    return displayInstallWallet();
  }
  const wallet = await collectWallet(network.chainId);
  window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
    gasPrice: GasPrice.fromString(`0.002${network.denom}`)
  });
};

export const switchWalletTron = async () => {
  let tronAddress: string;
  if (isMobile()) {
    const addressTronMobile = await window.tronLink.request({
      method: 'tron_requestAccounts'
    });
    //@ts-ignore
    tronAddress = addressTronMobile?.base58;
  } else {
    if (!window.tronWeb.defaultAddress?.base58) {
      const { code, message = 'Tronlink is not ready' } = await window.tronLink.request({
        method: 'tron_requestAccounts'
      });
      // throw error when not connected
      if (code !== 200) {
        throw Error(message);
      }
    }
    tronAddress = window.tronWeb.defaultAddress.base58;
  }
  return {
    tronAddress
  };
};

const getAddress = (addr, prefix: string) => {
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
  const kwtAddress = await window.Keplr.getKeplrAddr('kawaii_6886-1');
  if (!kwtAddress) return { listAddressCosmos };
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
