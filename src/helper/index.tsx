import React from 'react';
import { ReactComponent as BNBIcon } from 'assets/network/bnb.svg';
import { ReactComponent as ETHIcon } from 'assets/network/ethereum.svg';
import { ReactComponent as ORAIIcon } from 'assets/network/oraichain.svg';
import { ReactComponent as KwtIcon } from 'assets/network/kwt.svg';
import { ReactComponent as AtomCosmosIcon } from 'assets/network/atom_cosmos.svg';
import { ReactComponent as OsmosisIcon } from 'assets/network/osmosis.svg';
import {
  BEP20_ORAI,
  STABLE_DENOM,
  ORAI,
  AIRI_DENOM,
  MILKY,
  scORAI_DENOM,
  BEP20_USDT,
  BEP20_AIRI,
  BEP20_KWT,
  BEP20_MILKY,
  UATOM_DENOM,
  UOSMOS_DENOM,
  ORAIX_DENOM,
  ORAICHAIN_ID,
  BSC_ORG,
  KAWAII_ORG,
  OSMOSIS_ORG,
  COSMOS_ORG,
  ORAI_BRIDGE_ORG,
  ETHEREUM_ORG,
  ORAI_BRIDGE_CHAIN_ID,
  ERC20_KWT,
  ERC20_MILKY,
  ORAI_BRIDGE_RPC,
  OSMOSIS_NETWORK_RPC,
  COSMOS_NETWORK_RPC,
  KAWAII_RPC,
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
  EVM_TYPE,
} from 'config/constants';
import { ChainInfoType } from 'hooks/useGlobalState';

const KWT_DENOM = 'kwt';
interface Items {
  chainId?: string;
  title?: string;
}
interface Tokens {
  denom?: string;
  chainId?: string | number;
}

export const networks = [
  {
    title: ORAICHAIN_ID,
    chainId: ORAICHAIN_ID,
    icon: <ORAIIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: ORAICHAIN_ID + ' BEP20',
    chainId: ORAICHAIN_ID + ' BEP20',
    icon: <ORAIIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: ORAICHAIN_ID + ' ERC20',
    chainId: ORAICHAIN_ID + ' ERC20',
    icon: <ORAIIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: KAWAII_ORG,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    icon: <KwtIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: OSMOSIS_ORG,
    chainId: OSMOSIS_CHAIN_ID,
    icon: <OsmosisIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: COSMOS_ORG,
    chainId: COSMOS_CHAIN_ID,
    icon: <AtomCosmosIcon />,
    networkType: COSMOS_TYPE,
  },
  {
    title: BSC_ORG,
    chainId: BSC_ORG,
    icon: <BNBIcon />,
    networkType: EVM_TYPE,
  },
  {
    title: ETHEREUM_ORG,
    chainId: ETHEREUM_ORG,
    icon: <ETHIcon />,
    networkType: EVM_TYPE,
  },
];

export const networksFilterChain = networks.filter(
  (token) =>
    token.chainId != ORAICHAIN_ID + ' BEP20' &&
    token.chainId != ORAICHAIN_ID + ' ERC20'
);

export const renderLogoNetwork = (network: string) => {
  let logo = <ORAIIcon />;
  switch (network) {
    case ORAICHAIN_ID:
      logo = <ORAIIcon />;
      break;
    case ORAI_BRIDGE_ORG:
      logo = <ORAIIcon />;
      break;
    case KAWAII_ORG:
      logo = <KwtIcon />;
      break;
    case OSMOSIS_ORG:
      logo = <OsmosisIcon />;
      break;
    case COSMOS_ORG:
      logo = <AtomCosmosIcon />;
      break;
    case ETHEREUM_ORG:
      logo = <ETHIcon />;
      break;
    case BSC_ORG:
      logo = <BNBIcon />;
      break;
  }
  return logo;
};

// filter chain support
export const filterChainBridge = (
  token: Tokens,
  item: Items,
  filterNetwork: string
) => {
  const denom = token.denom.toLowerCase() ?? ORAI;

  if (token?.chainId == ORAI_BRIDGE_CHAIN_ID) {
    return item.title === BSC_ORG
  }

  switch (denom) {
    // Oraichain
    case ORAI:
      return (
        item.title !== filterNetwork &&
        (item.title === BSC_ORG ||
          item.title === ETHEREUM_ORG)
      );
    case process.env.REACT_APP_ATOM_ORAICHAIN_DENOM.toLowerCase():
      return item.title === COSMOS_ORG;
    case process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM.toLowerCase():
      return item.title === OSMOSIS_ORG;
    case AIRI_DENOM:
      return item.title === BSC_ORG;
    case STABLE_DENOM:
      return item.title === BSC_ORG;
    case process.env.REACT_APP_ORAIBSC_ORAICHAIN_DENOM.toLowerCase():
      return (
        item.title !== filterNetwork &&
        (item.title === BSC_ORG || item.title === ORAICHAIN_ID)
      );
    case process.env.REACT_APP_ORAIETH_ORAICHAIN_DENOM.toLowerCase(): 
        return (
          item.title !== filterNetwork &&
          (item.title === ETHEREUM_ORG || item.title === ORAICHAIN_ID)
        )
    case KWT_DENOM:
      return (
        item.title !== filterNetwork &&
        (item.title === KAWAII_ORG || item.title === BSC_ORG)
      );
    case MILKY:
      return (
        item.title !== filterNetwork &&
        (item.title === KAWAII_ORG || item.title === BSC_ORG)
      );
    case ORAIX_DENOM.toLowerCase():
      return item.title === ORAICHAIN_ID;
    case scORAI_DENOM:
      return item.title === ORAICHAIN_ID;

    // Kawaiiverse
    case process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM.toLowerCase():
      return (
        item.title !== filterNetwork &&
        (item.title === ORAICHAIN_ID || item.title === KAWAII_ORG)
      );
    case process.env.REACT_APP_KWT_SUB_NETWORK_DENOM.toLowerCase():
      return (
        item.title !== filterNetwork &&
        (item.title === ORAICHAIN_ID || item.title === KAWAII_ORG)
      );
    case ERC20_MILKY:
      return (
        item.title !== filterNetwork &&
        (item.title === ORAICHAIN_ID || item.title === KAWAII_ORG)
      );
    case ERC20_KWT:
      return (
        item.title !== filterNetwork &&
        (item.title === ORAICHAIN_ID || item.title === KAWAII_ORG)
      );
       
    // Osmosis`
    case UOSMOS_DENOM:
      return item.title === ORAICHAIN_ID;

    // Cosmos Hub
    case UATOM_DENOM:
      return item.title === ORAICHAIN_ID;

    // BNB Chain
    case BEP20_USDT:
      return item.title === ORAICHAIN_ID;
    case BEP20_AIRI:
      return item.title === ORAICHAIN_ID;
    case BEP20_KWT:
      return item.title === ORAICHAIN_ID;
    case BEP20_ORAI:
      return item.title === ORAICHAIN_ID;
    case BEP20_MILKY:
      return item.title === ORAICHAIN_ID;

    // ethereum 
    case ERC20_ORAI:
      return item.title === ORAICHAIN_ID;
    
    // oraibridge

    default:
      return item;
  }
};

export const getTokenChain = (token?: {
  chainId: string | number; org?: string; denom?: string 
}) => {
  let chainId = token?.org;
  
  if (token?.chainId == ORAI_BRIDGE_CHAIN_ID) {
    return BSC_ORG
  }

  switch (token?.denom) {
    // Oraichain
    case ORAI:
      chainId = BSC_ORG
      break;
    case process.env.REACT_APP_ATOM_ORAICHAIN_DENOM:
      chainId = COSMOS_ORG;
      break;
    case AIRI_DENOM:
      chainId = BSC_ORG;
      break;
    case STABLE_DENOM:
      chainId = BSC_ORG;
      break;
    case process.env.REACT_APP_ORAIBSC_ORAICHAIN_DENOM:
      chainId = BSC_ORG;
      break;
    case process.env.REACT_APP_ORAIETH_ORAICHAIN_DENOM:
      chainId = ETHEREUM_ORG;
      break; 
    case KWT_DENOM:
      chainId = KAWAII_ORG;
      break;
    case MILKY:
      chainId = KAWAII_ORG;
      break;
    case ORAIX_DENOM.toLowerCase():
      chainId = ORAICHAIN_ID;
      break;
    case scORAI_DENOM:
      chainId = ORAICHAIN_ID;
      break;
    case process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM:
      chainId = OSMOSIS_ORG;
      break;

    // Kawaiiverse
    case process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM:
      chainId = ORAICHAIN_ID;
      break;

    // Osmosis`
    case UOSMOS_DENOM:
      chainId = ORAICHAIN_ID;
      break;

    // Cosmos Hub
    case UATOM_DENOM:
      chainId = ORAICHAIN_ID;
      break;

    // BNB Chain
    case BEP20_USDT:
      chainId = ORAICHAIN_ID;
      break;
    case BEP20_AIRI:
      chainId = ORAICHAIN_ID;
      break;
    case BEP20_KWT:
      chainId = ORAICHAIN_ID;
      break;
    case BEP20_ORAI:
      chainId = ORAICHAIN_ID;
      break;
    case BEP20_MILKY:
      chainId = ORAICHAIN_ID;
      break;
    // ethereum
    case ERC20_ORAI:
      chainId = ORAICHAIN_ID;
      break;
  }
  return chainId;
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
        Number(window.ethereum.chainId) === Number(KWT_SUBNETWORK_EVM_CHAIN_ID)
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
}

export const arrayLoadToken = [
  { chainId: ORAI_BRIDGE_CHAIN_ID, rpc: ORAI_BRIDGE_RPC },
  { chainId: OSMOSIS_CHAIN_ID, rpc: OSMOSIS_NETWORK_RPC },
  { chainId: COSMOS_CHAIN_ID, rpc: COSMOS_NETWORK_RPC },
  { chainId: KWT_SUBNETWORK_CHAIN_ID, rpc: KAWAII_RPC }
];