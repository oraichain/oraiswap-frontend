import React from 'react';
import { ReactComponent as BNBIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as ETHIcon } from 'assets/icons/ethereum.svg';
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
  ORAI_BRIDGE_ORG,
  ETHEREUM_ORG,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_RPC,
  OSMOSIS_NETWORK_RPC,
  COSMOS_NETWORK_RPC,
  KAWAII_RPC,
  NOTI_INSTALL_OWALLET
} from 'config/constants';

import {
  BSC_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  KWT_SUBNETWORK_EVM_CHAIN_ID,
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

interface Items {
  chainId?: string;
  title?: string;
}
interface Tokens {
  denom?: string;
  chainId?: string | number;
  bridgeTo?: Array<string>;
}

export const networks = [
  {
    title: ORAICHAIN_ID,
    chainId: ORAICHAIN_ID,
    icon: <ORAIIcon />,
    networkType: COSMOS_TYPE
  },
  {
    title: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    icon: <KwtIcon />,
    networkType: COSMOS_TYPE
  },
  {
    title: OSMOSIS_ORG,
    chainId: OSMOSIS_CHAIN_ID,
    icon: <OsmosisIcon />,
    networkType: COSMOS_TYPE
  },
  {
    title: COSMOS_ORG,
    chainId: COSMOS_CHAIN_ID,
    icon: <AtomCosmosIcon />,
    networkType: COSMOS_TYPE
  },
  {
    title: BSC_ORG,
    chainId: BSC_ORG,
    icon: <BNBIcon />,
    networkType: EVM_TYPE
  },
  {
    title: ETHEREUM_ORG,
    chainId: ETHEREUM_ORG,
    icon: <ETHIcon />,
    networkType: EVM_TYPE
  }
];

export const renderLogoNetwork = (network: string) => {
  switch (network) {
    case ORAICHAIN_ID:
      return <ORAIIcon />;
    case ORAI_BRIDGE_ORG:
      return <ORAIIcon />;
    case KAWAII_ORG:
      return <KwtIcon />;
    case OSMOSIS_ORG:
      return <OsmosisIcon />;
    case COSMOS_ORG:
      return <AtomCosmosIcon />;
    case ETHEREUM_ORG:
      return <ETHIcon />;
    case BSC_ORG:
      return <BNBIcon />;
    default:
      return <ORAIIcon />;
  }
};

export const filterChainBridge = (token: Tokens, item: Items) => {
  const tokenCanBridgeTo = token.bridgeTo ?? [ORAICHAIN_ID];
  return tokenCanBridgeTo.includes(item.title);
};

export const getTokenChain = (token: TokenItemType) => {
  return token?.bridgeTo?.[0] ?? ORAICHAIN_ID;
};

export const handleCheckChain = (
  chainId: string | number,
  infoCosmos?: ChainInfoType
) => {
  switch (chainId) {
    case BSC_CHAIN_ID:
      return window.Metamask.isBsc();
    case ETHEREUM_CHAIN_ID:
      return window.Metamask.isEth();
    case KWT_SUBNETWORK_EVM_CHAIN_ID:
      return (
        Number(window?.ethereum?.chainId) ===
        Number(KWT_SUBNETWORK_EVM_CHAIN_ID)
      );
    case KWT_SUBNETWORK_CHAIN_ID:
      return infoCosmos.chainId === KWT_SUBNETWORK_CHAIN_ID;
    case COSMOS_CHAIN_ID:
      return infoCosmos.chainId === COSMOS_CHAIN_ID;
    case OSMOSIS_CHAIN_ID:
      return infoCosmos.chainId === OSMOSIS_CHAIN_ID;
    case ORAICHAIN_ID:
      return (
        infoCosmos.chainId !== OSMOSIS_CHAIN_ID &&
        infoCosmos.chainId !== COSMOS_CHAIN_ID &&
        infoCosmos.chainId !== KWT_SUBNETWORK_CHAIN_ID
      );
    default:
      return false;
  }
};

export const getDenomEvm = () => {
  if (window.Metamask.isEth()) return ERC20_ORAI;
  if (window.Metamask.isBsc()) return BEP20_ORAI;
  return KAWAII_ORAI;
};

export const getRpcEvm = (infoEvm?: ChainInfoType) => {
  if (window.Metamask.isEth()) return ETHEREUM_RPC;
  if (window.Metamask.isBsc()) return BSC_RPC;
  return infoEvm?.rpc;
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
    chainInfosWithoutEndpoints =
      await window.Keplr?.getChainInfosWithoutEndpoints();
  } finally {
    const findToken = chainInfosWithoutEndpoints.find(
      (e) => e.chainId == network.chainId
    );
    return findToken?.feeCurrencies[0]?.gasPriceStep ?? findToken?.gasPriceStep;
  }
};

export const handleCheckWallet = async () => {
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) {
    return displayToast(TToastType.TX_INFO, NOTI_INSTALL_OWALLET, {
      toastId: 'install_keplr'
    });
  }
};