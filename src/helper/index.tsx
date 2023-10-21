import {
  BSC_SCAN,
  CosmosChainId,
  ETHEREUM_SCAN,
  HIGH_GAS_PRICE,
  KWT_SCAN,
  MULTIPLIER,
  ORAI,
  TRON_SCAN,
  WalletType
} from '@oraichain/oraidex-common';

import { network } from 'config/networks';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos } from 'config/chainInfos';
import { CustomChainInfo, EvmDenom, NetworkChainId, TokenItemType } from '@oraichain/oraidex-common';
import Keplr from 'libs/keplr';

export interface Tokens {
  denom?: string;
  chainId?: NetworkChainId;
  bridgeTo?: Array<NetworkChainId>;
}

export const networks = chainInfos.filter((c) => c.chainId !== 'oraibridge-subnet-2' && c.chainId !== '0x1ae6');
export const cosmosNetworks = chainInfos.filter(
  (c) => c.networkType === 'cosmos' && c.chainId !== 'oraibridge-subnet-2'
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
  } catch {}
  return 0;
};

//hardcode fee
export const feeEstimate = (tokenInfo: TokenItemType, gasDefault: number) => {
  if (!tokenInfo) return 0;
  return (gasDefault * MULTIPLIER * HIGH_GAS_PRICE) / 10 ** tokenInfo?.decimals;
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

export const handleErrorTransaction = (error: any) => {
  let finalError = '';
  if (typeof error === 'string' || error instanceof String) {
    finalError = error as string;
  } else {
    if (error?.ex?.message) finalError = String(error.ex.message);
    else if (error?.message) finalError = String(error.message);
    else finalError = JSON.stringify(error);
  }
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

export const isUnlockMetamask = async () => {
  const isMetamask = !!window?.ethereum?.isMetaMask;
  if (isMetamask) {
    const isUnlock = await window.ethereum._metamask.isUnlocked();
    return isUnlock;
  }
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
