import {
  BEP20_ORAI,
  BSC_SCAN,
  ETHEREUM_SCAN,
  HIGH_GAS_PRICE,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID,
  MULTIPLIER,
  ORAICHAIN_ID,
  TRON_CHAIN_ID,
  TRON_SCAN
} from 'config/constants';

import { TokenItemType } from 'config/bridgeTokens';
import { BSC_CHAIN_ID, ERC20_ORAI, ETHEREUM_CHAIN_ID, KAWAII_ORAI } from 'config/constants';
import { network } from 'config/networks';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { CustomChainInfo, embedChainInfos, NetworkChainId } from 'config/chainInfos';
import { ethers } from 'ethers';

interface Tokens {
  denom?: string;
  chainId?: NetworkChainId;
  bridgeTo?: Array<string>;
}

export const networks = embedChainInfos.filter((c) => c.chainId !== 'oraibridge-subnet-2');

export const renderLogoNetwork = (chainId: string | number, props: any = {}) => {
  const network = networks.find((n) => n.chainId == chainId);
  if (network) {
    return <network.Icon {...props} />;
  }
};

export const filterChainBridge = (token: Tokens, item: CustomChainInfo) => {
  const tokenCanBridgeTo = token.bridgeTo ?? [ORAICHAIN_ID];
  return tokenCanBridgeTo.includes(item.chainName);
};

export const getTokenChain = (token: TokenItemType): NetworkChainId => {
  return token?.bridgeTo?.[0] ?? 'Oraichain';
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

export const getTransactionUrl = (chainId: NetworkChainId, transactionHash: string) => {
  switch (Number(chainId)) {
    case BSC_CHAIN_ID:
      return `${BSC_SCAN}/tx/${transactionHash}`;
    case ETHEREUM_CHAIN_ID:
      return `${ETHEREUM_SCAN}/tx/${transactionHash}`;
    case TRON_CHAIN_ID:
      return `${TRON_SCAN}/#/transaction/${transactionHash.replace(/^0x/, '')}`;
    default:
      // raw string
      switch (chainId) {
        case KWT_SUBNETWORK_CHAIN_ID:
          return `${KWT_SCAN}/tx/${transactionHash}`;
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
