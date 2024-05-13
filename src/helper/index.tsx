import {
  BigDecimal,
  BSC_SCAN,
  ChainIdEnum,
  COSMOS_CHAIN_ID_COMMON,
  CosmosChainId,
  cosmosChains,
  ETHEREUM_SCAN,
  evmChains,
  KWT_SCAN,
  MULTIPLIER,
  TRON_SCAN,
  EVM_CHAIN_ID_COMMON,
  WalletType as WalletCosmosType
} from '@oraichain/oraidex-common';
import { network } from 'config/networks';
import { serializeError } from 'serialize-error';

import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { bitcoinChainId, leapSnapId } from './constants';
import { getSnap } from '@leapwallet/cosmos-snap-provider';
import { Bech32Config } from '@keplr-wallet/types';
import { CustomChainInfo, EvmDenom, NetworkChainId, TokenItemType } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { WalletType } from 'components/WalletManagement/walletConfig';
import { chainInfos, chainInfosWithIcon } from 'config/chainInfos';
import { MetamaskOfflineSigner } from 'libs/eip191';
import Keplr from 'libs/keplr';
import { WalletsByNetwork } from 'reducer/wallet';
import { evmChainInfos } from 'config/evmChainInfos';

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
export const networks = chainInfos.filter(
  (c) => c.chainId !== ChainIdEnum.OraiBridge && c.chainId !== ('oraibtc-mainnet-1' as any) && c.chainId !== '0x1ae6'
);
export const cosmosNetworks = chainInfos.filter(
  (c) =>
    c.networkType === 'cosmos' && c.chainId !== ChainIdEnum.OraiBridge && c.chainId !== ('oraibtc-mainnet-1' as any)
);

export const bitcoinNetworks = chainInfos.filter((c) => c.chainId === bitcoinChainId);
export const cosmosNetworksWithIcon = chainInfosWithIcon.filter(
  (c) =>
    c.networkType === 'cosmos' && c.chainId !== ChainIdEnum.OraiBridge && c.chainId !== ('oraibtc-mainnet-1' as any)
);

export const evmNetworksWithoutTron = chainInfos.filter((c) => c.networkType === 'evm' && c.chainId !== '0x2b6653dc');
export const evmNetworksIconWithoutTron = chainInfosWithIcon.filter(
  (c) => c.networkType === 'evm' && c.chainId !== '0x2b6653dc'
);

// export const bitcoinNetworks = chainInfos.filter((c) => c.chainId === ChainIdEnum.Bitcoin);
export const tronNetworks = chainInfos.filter((c) => c.chainId === '0x2b6653dc');
export const tronNetworksWithIcon = chainInfosWithIcon.filter((c) => c.chainId === '0x2b6653dc');
export const btcNetworksWithIcon = chainInfosWithIcon.filter((c) => c.chainId === bitcoinChainId);

export const filterChainBridge = (token: Tokens, item: CustomChainInfo) => {
  const tokenCanBridgeTo = token.bridgeTo ?? ['Oraichain'];
  return tokenCanBridgeTo.includes(item.chainId);
};

export const getDenomEvm = (): EvmDenom => {
  switch (Number(window.ethereumDapp?.chainId)) {
    case Networks.bsc:
      return 'bep20_orai';
    case Networks.mainnet:
      return 'erc20_orai';
    default:
      return 'kawaii_orai';
  }
};

export const getSpecialCoingecko = (fromCoingecko: string, toCoingecko: string) => {
  const isSpecialCoingecko = (coinGeckoId) =>
    ['kawaii-islands', 'milky-token', 'injective-protocol'].includes(coinGeckoId);
  const isSpecialFromCoingecko = isSpecialCoingecko(fromCoingecko);
  const isSpecialToCoingecko = isSpecialCoingecko(toCoingecko);
  return {
    isSpecialFromCoingecko,
    isSpecialToCoingecko
  };
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
};

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
  const walletType = getWalletByNetworkCosmosFromStorage();
  const keplr = await window.Keplr.getKeplr();
  if (!keplr && walletType !== 'eip191') {
    return displayInstallWallet();
  }
};

export const handleCheckChainEvmWallet = async (fromChainId) => {
  const supportedChainIds = ['0x01', '0x38'];

  if (supportedChainIds.includes(fromChainId)) {
    const fromChainInfo = evmChainInfos.find((evm) => Number(evm.chainId) === Number(fromChainId));
    if (fromChainInfo) {
      try {
        await window.ethereumDapp.request({
          method: 'wallet_addEthereumChain',
          params: [fromChainInfo]
        });
      } catch (error) {
        console.error('Error adding Ethereum chain:', error);
      }
    }
  }
};

export const checkSnapExist = async (): Promise<boolean> => {
  return window.ethereum?.isMetaMask && !!(await getSnap());
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
    throw new Error('Please login Cosmos wallet!');
  }
  return cosmosAddress;
};

const transferMsgError = (message: string, info?: InfoError) => {
  if (message.includes('invalid hash')) return `Transation was not included to block`;
  if (message.includes('Send some tokens there before trying to query sequence'))
    return `Seems like you’re using new wallet. You must have at least 0.01 ORAI for transaction fee`;

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

// TECH DEBT: need to update WalletTypeCosmos add type eip191 to oraidex-common
export const getWalletByNetworkCosmosFromStorage = (key = 'persist:root'): WalletCosmosType | 'eip191' => {
  try {
    if (isMobile()) return 'owallet';

    const result = localStorage.getItem(key);
    const parsedResult = JSON.parse(result);
    const wallet = JSON.parse(parsedResult.wallet);
    return wallet.walletsByNetwork.cosmos;
  } catch (error) {
    console.log('error getWalletByNetworkCosmosFromStorage: ', error);
  }
};

export const getWalletByNetworkFromStorage = (key = 'persist:root'): any => {
  try {
    if (isMobile()) return 'owallet';
    const result = localStorage.getItem(key);
    const parsedResult = JSON.parse(result);
    const wallet = JSON.parse(parsedResult.wallet);
    return wallet.walletsByNetwork;
  } catch (error) {
    console.log('error getWalletByNetworkFromStorage: ', error);
  }
};

export const checkVersionWallet = () => {
  return window.keplr && window.keplr.version.slice(0, 3) === '0.9'; // TODO: hardcode version of owallet
};

//@ts-ignore
const walletIsOwallet = window?.keplr?.isOwallet;
export const keplrCheck = (type: WalletCosmosType) => {
  return type === 'keplr' && window.keplr && window.keplr.mode === 'extension' && !walletIsOwallet;
};

export const owalletCheck = (type: WalletCosmosType) => {
  return type === 'owallet' && walletIsOwallet;
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

export const switchWalletCosmos = async (type: WalletCosmosType | 'eip191') => {
  window.Keplr = new Keplr(type);
  setStorageKey('typeWallet', type);
  const isKeplr = await window.Keplr.getKeplr();
  const isEip191 = type === 'eip191';
  if (!isKeplr && !isEip191) {
    return displayInstallWallet();
  }
};

export interface interfaceRequestTron {
  code: number;
  message: string;
  base58?: string;
}

export const switchWalletTron = async (walletType: WalletType) => {
  let tronAddress: string;
  const res: interfaceRequestTron = await window.tronLinkDapp.request({
    method: 'tron_requestAccounts'
  });
  if (isMobile() || (walletType === 'owallet' && window.tronLinkDapp?.isOwallet)) {
    tronAddress = res?.base58;
  } else {
    const { code, message = 'Tronlink is not ready' } = res;
    if (code !== 200) throw new Error(message);
    tronAddress = window.tronWeb?.defaultAddress?.base58;
  }

  if (!tronAddress) throw new Error(res?.message ?? 'Error get Tron address!');

  return {
    tronAddress
  };
};

export const getAddressTransfer = async (network: CustomChainInfo, walletByNetworks: WalletsByNetwork) => {
  try {
    let address;
    if (network.networkType === 'evm') {
      if (network.chainId === EVM_CHAIN_ID_COMMON.TRON_CHAIN_ID) {
        if (isMobile() && walletByNetworks.tron) {
          const accountTron: interfaceRequestTron = await window.tronLinkDapp.request({
            method: 'tron_requestAccounts'
          });
          address = accountTron.base58;
        } else {
          address = window?.tronWebDapp?.defaultAddress?.base58;
        }
      } else if (walletByNetworks.evm || isMobile()) {
        if (walletByNetworks.evm === 'owallet') window.ethereumDapp = window.eth_owallet;
        const check = window.Metamask.isWindowEthereum();
        if (check) {
          address = await window.Metamask.getEthAddress();
        }
      }
    } else if (walletByNetworks.cosmos || isMobile()) {
      address = await window.Keplr.getKeplrAddr(network.chainId);
    }
    return address;
  } catch (error) {
    console.log({ error });
    return '';
  }
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

export const getListAddressCosmos = async (oraiAddr, walletType?: WalletCosmosType | 'eip191') => {
  if (walletType === 'eip191') {
    return {
      listAddressCosmos: {
        Oraichain: oraiAddr
      }
    };
  }

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
  return chainInfoData.map((info) => {
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
export const timeAgo = (timestamp = 0) => {
  if (!timestamp) return 'in 0 day';
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const diffInDays = Math.floor(diffInSeconds / 86400);
  return rtf.format(-diffInDays, 'day');
};

export const getAddressByEIP191 = async (isSwitchWallet?: boolean) => {
  const metamaskOfflineSinger = await MetamaskOfflineSigner.connect(window.ethereum);
  if (!metamaskOfflineSinger) return;
  const accounts = await metamaskOfflineSinger.getAccounts(isSwitchWallet);
  return accounts[0].address;
};
