import {
  BEP20_ORAI,
  BSC_SCAN,
  ETHEREUM_SCAN,
  HIGH_GAS_PRICE,
  MULTIPLIER,
  ORAICHAIN_ID, TRON_CHAIN_ID,
  TRON_SCAN
} from 'config/constants';

import { TokenItemType } from 'config/bridgeTokens';
import { BSC_CHAIN_ID, ERC20_ORAI, ETHEREUM_CHAIN_ID, KAWAII_ORAI } from 'config/constants';
import { network } from 'config/networks';

import { FeeCurrency } from '@keplr-wallet/types';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { embedChainInfos } from 'config/chainInfos';
import { ChainInfoCustom } from 'config/networkInfos';
import { networksWithoutOraib } from 'config/bridgeTokens';
import { ethers } from 'ethers';

interface Tokens {
  denom?: string;
  chainId?: string | number;
  bridgeTo?: Array<string>;
}

export const renderLogoNetwork = (chainId: string | number, props: any = {}) => {
  const network = networksWithoutOraib.find((n) => n.chainId == chainId) ?? networksWithoutOraib.find((n) => n.chainName == chainId);
  if (network) {
    return <network.Icon {...props} />;
  }
};

export const filterChainBridge = (token: Tokens, item: ChainInfoCustom) => {
  const tokenCanBridgeTo = token.bridgeTo ?? [ORAICHAIN_ID];
  return tokenCanBridgeTo.includes(item.chainName);
};

export const getTokenChain = (token: TokenItemType) => {
  return token?.bridgeTo?.[0] ?? ORAICHAIN_ID;
};

export const getDenomEvm = () => {
  switch (Number(window.ethereum?.chainId)) {
    case BSC_CHAIN_ID:
      return BEP20_ORAI;
    case ETHEREUM_CHAIN_ID:
      return ERC20_ORAI;
    default:
      return KAWAII_ORAI;
  }
};

export const getTransactionUrl = (chainId: string | number, transactionHash: any) => {
  switch (Number(chainId)) {
    case BSC_CHAIN_ID:
      return `${BSC_SCAN}/tx/${transactionHash}`;
    case ETHEREUM_CHAIN_ID:
      return `${ETHEREUM_SCAN}/tx/${transactionHash}`;
    case TRON_CHAIN_ID:
      return `${TRON_SCAN}/#/transaction/${transactionHash.txid.replace(/^0x/, '')}`;
  }
};

export const getNetworkGasPrice = async () => {
  let chainInfosWithoutEndpoints: Array<{
    chainId: string;
    feeCurrencies: FeeCurrency[];
    gasPriceStep?: any;
  }> = embedChainInfos;
  try {
    chainInfosWithoutEndpoints = await window.Keplr?.getChainInfosWithoutEndpoints();
  } finally {
    const findToken = chainInfosWithoutEndpoints.find((e) => e.chainId == network.chainId);
    return findToken?.feeCurrencies[0]?.gasPriceStep ?? findToken?.gasPriceStep;
  }
};

//hardcode fee
export const feeEstimate = async (tokenInfo: TokenItemType, gasDefault: number) => {
  if (!tokenInfo) return 0;
  return (gasDefault * MULTIPLIER * HIGH_GAS_PRICE) / 10 ** tokenInfo?.coinDecimals;
};

export const handleCheckWallet = async () => {
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) {
    return displayInstallWallet();
  }
};

export const tronToEthAddress = (base58: string) =>
  '0x' + Buffer.from(ethers.utils.base58.decode(base58)).slice(1, -4).toString('hex');

export const ethToTronAddress = (address: string) => {
  const evmAddress = '0x41' + address.substring(2);
  const hash = ethers.utils.sha256(ethers.utils.sha256(evmAddress));
  const checkSum = hash.substring(2, 10);
  return ethers.utils.base58.encode(evmAddress + checkSum);
};

export const displayInstallWallet = (altWallet = 'Keplr') => {
  displayToast(
    TToastType.TX_INFO,
    {
      message: `You need to install OWallet or ${altWallet} to continue.`,
      customLink: 'https://chrome.google.com/webstore/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga',
      textLink: 'View on store'
    },
    {
      toastId: 'install_keplr'
    }
  );
};

export const handleCheckAddress = async (): Promise<string> => {
  const oraiAddress = await window.Keplr.getKeplrAddr();
  if (!oraiAddress) {
    throw new Error('Please login both metamask and keplr!');
  }
  return oraiAddress;
};
