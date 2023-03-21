import React from 'react';
import { ReactComponent as BNBIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as ETHIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as TRONIcon } from 'assets/icons/tron.svg';
import { ReactComponent as ORAIIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as AtomCosmosIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as OsmosisIcon } from 'assets/icons/osmosis.svg';
import {
  BEP20_ORAI,
  ORAICHAIN_ID,
  BSC_ORG,
  KAWAII_ORG,
  OSMOSIS_ORG,
  COSMOS_ORG,
  ETHEREUM_ORG,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_RPC,
  OSMOSIS_NETWORK_RPC,
  COSMOS_NETWORK_RPC,
  KAWAII_RPC,
  HIGH_GAS_PRICE,
  MULTIPLIER,
  BSC_SCAN,
  ETHEREUM_SCAN,
  TRON_CHAIN_ID,
  TRON_SCAN,
  TRON_RPC,
  TRON_ORG
} from 'config/constants';

import {
  BSC_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  KWT_SUBNETWORK_CHAIN_ID,
  COSMOS_CHAIN_ID,
  OSMOSIS_CHAIN_ID,
  ERC20_ORAI,
  KAWAII_ORAI,
  ETHEREUM_RPC,
  BSC_RPC,
  COSMOS_TYPE,
  EVM_TYPE
} from 'config/constants';
import { network } from 'config/networks';
import { TokenItemType } from 'config/bridgeTokens';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { embedChainInfos } from 'config/chainInfos';
import { ChainInfoType } from 'reducer/config';
import { FeeCurrency } from '@keplr-wallet/types';
import { ethers } from 'ethers';

interface Tokens {
  denom?: string;
  chainId?: string | number;
  bridgeTo?: Array<string>;
}

export type NetworkType = {
  title: string;
  chainId: string | number;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  networkType: string;
};

export const networks: NetworkType[] = [
  {
    title: ORAICHAIN_ID,
    chainId: ORAICHAIN_ID,
    Icon: ORAIIcon,
    networkType: COSMOS_TYPE
  },
  {
    title: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    Icon: KwtIcon,
    networkType: COSMOS_TYPE
  },
  {
    title: OSMOSIS_ORG,
    chainId: OSMOSIS_CHAIN_ID,
    Icon: OsmosisIcon,
    networkType: COSMOS_TYPE
  },
  {
    title: COSMOS_ORG,
    chainId: COSMOS_CHAIN_ID,
    Icon: AtomCosmosIcon,
    networkType: COSMOS_TYPE
  },
  {
    title: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    Icon: BNBIcon,
    networkType: EVM_TYPE
  },
  {
    title: ETHEREUM_ORG,
    chainId: ETHEREUM_CHAIN_ID,
    Icon: ETHIcon,
    networkType: EVM_TYPE
  },
  {
    title: TRON_ORG,
    chainId: TRON_CHAIN_ID,
    Icon: TRONIcon,
    networkType: EVM_TYPE
  }
];

export const renderLogoNetwork = (chainId: string | number, props: any = {}) => {
  const network = networks.find((n) => n.chainId == chainId) ?? networks.find((n) => n.title === chainId);
  if (network) {
    return <network.Icon {...props} />;
  }
};

export const filterChainBridge = (token: Tokens, item: NetworkType) => {
  const tokenCanBridgeTo = token.bridgeTo ?? [ORAICHAIN_ID];
  return tokenCanBridgeTo.includes(item.title);
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

export const getRpcEvm = (infoEvm?: ChainInfoType) => {
  switch (Number(window.ethereum?.chainId)) {
    case BSC_CHAIN_ID:
      return BSC_RPC;
    case ETHEREUM_CHAIN_ID:
      return ETHEREUM_RPC;
    case TRON_CHAIN_ID:
      return TRON_RPC;
    default:
      return infoEvm?.rpc;
  }
};

export const getTransactionUrl = (transactionHash: string) => {
  switch (Number(window.ethereum?.chainId)) {
    case BSC_CHAIN_ID:
      return `${BSC_SCAN}/tx/${transactionHash}`;
    case ETHEREUM_CHAIN_ID:
      return `${ETHEREUM_SCAN}/tx/${transactionHash}`;
    case TRON_CHAIN_ID:
      return `${TRON_SCAN}/#/transaction/${transactionHash.replace(/^0x/, '')}`;
  }
};

export const objConvertTokenIbc = {
  usdt: process.env.REACT_APP_USDTBSC_ORAICHAIN_DENOM,
  kwt: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM,
  milky: process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM,
  airi: process.env.REACT_APP_AIRIBSC_ORAICHAIN_DENOM
};

export const arrayLoadToken = [
  { chainId: ORAI_BRIDGE_CHAIN_ID, rpc: ORAI_BRIDGE_RPC },
  { chainId: OSMOSIS_CHAIN_ID, rpc: OSMOSIS_NETWORK_RPC },
  { chainId: COSMOS_CHAIN_ID, rpc: COSMOS_NETWORK_RPC },
  { chainId: KWT_SUBNETWORK_CHAIN_ID, rpc: KAWAII_RPC },
  { chainId: network.chainId, rpc: network.rpc }
];

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
