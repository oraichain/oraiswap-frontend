import React from 'react';
import { ReactComponent as BNBIcon } from 'assets/network/bnb.svg';
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
  KAWAII_CHAINID,
  OSMOSIS_CHAINID,
  COSMOS_CHAINID,
  ORAI_BRIDGE_CHAINID,
} from 'config/constants';

const KWT_DENOM = 'kwt';
interface Items {
  chainId?: string;
  title?: string;
}
interface Tokens {
  denom: string;
}

export const networks = [
  { title: ORAICHAIN_ID, chainId: ORAICHAIN_ID, icon: <ORAIIcon /> },
  {
    title: ORAI_BRIDGE_CHAINID,
    chainId: ORAI_BRIDGE_CHAINID,
    icon: <ORAIIcon />,
  },
  { title: KAWAII_CHAINID, chainId: KAWAII_CHAINID, icon: <KwtIcon /> },
  { title: OSMOSIS_CHAINID, chainId: OSMOSIS_CHAINID, icon: <OsmosisIcon /> },
  { title: COSMOS_CHAINID, chainId: COSMOS_CHAINID, icon: <AtomCosmosIcon /> },
  { title: BSC_ORG, chainId: BSC_ORG, icon: <BNBIcon /> },
];

export const renderLogoNetwork = (network: string) => {
  let logo = <ORAIIcon />;
  switch (network) {
    case ORAICHAIN_ID:
      logo = <ORAIIcon />;
      break;
    case ORAI_BRIDGE_CHAINID:
      logo = <ORAIIcon />;
      break;
    case KAWAII_CHAINID:
      logo = <KwtIcon />;
      break;
    case OSMOSIS_CHAINID:
      logo = <OsmosisIcon />;
      break;
    case COSMOS_CHAINID:
      logo = <AtomCosmosIcon />;
      break;
    case BSC_ORG:
      logo = <BNBIcon />;
      break;
  }
  return logo;
};

export const filterChainBridge = (
  token: Tokens,
  item: Items,
  filterNetwork: string
) => {
  const denom = token.denom.toLowerCase() ?? ORAI;
  switch (denom) {
    // Oraichain
    case ORAI:
      return item.chainId === ORAICHAIN_ID;
    case process.env.REACT_APP_ATOM_ORAICHAIN_DENOM:
      return item.chainId === COSMOS_CHAINID;
    case AIRI_DENOM:
      return item.chainId === BSC_ORG;
    case STABLE_DENOM:
      return item.chainId === BSC_ORG;
    case process.env.REACT_APP_ORAIBSC_ORAICHAIN_DENOM:
      return (
        item.chainId !== filterNetwork &&
        (item.chainId === BSC_ORG || item.chainId === ORAICHAIN_ID)
      );
    case KWT_DENOM:
      return (
        item.chainId !== filterNetwork &&
        (item.chainId === KAWAII_CHAINID || item.chainId === BSC_ORG)
      );
    case MILKY:
      return (
        item.chainId !== filterNetwork &&
        (item.chainId === KAWAII_CHAINID || item.chainId === BSC_ORG)
      );
    case ORAIX_DENOM.toLowerCase():
      return item.chainId === ORAICHAIN_ID;
    case scORAI_DENOM:
      return item.chainId === ORAICHAIN_ID;

    // Kawaiiverse
    case process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM:
      return (
        item.chainId !== filterNetwork &&
        (item.chainId === ORAICHAIN_ID || item.chainId === BSC_ORG)
      );

    // Osmosis`
    case UOSMOS_DENOM:
      return item.chainId === ORAICHAIN_ID;

    // Cosmos Hub
    case UATOM_DENOM:
      return item.chainId === ORAICHAIN_ID;

    // BNB Chain
    case BEP20_USDT:
      return item.chainId === ORAICHAIN_ID;
    case BEP20_AIRI:
      return item.chainId === ORAICHAIN_ID;
    case BEP20_KWT:
      return item.chainId === ORAICHAIN_ID;
    case BEP20_ORAI:
      return (
        item.chainId !== filterNetwork &&
        (item.chainId === ORAICHAIN_ID || item.chainId === BSC_ORG)
      );
    case BEP20_MILKY:
      return item.chainId === ORAICHAIN_ID;
  }
};

export const updateTokenDenom = (
  setFilterNetwork: any,
  token?: {
    org?: string;
    denom?: string;
  }
) => {
  let chainId = token?.org;
  switch (token?.denom) {
    // Oraichain
    case ORAI:
      chainId = ORAICHAIN_ID;
      break;
    case process.env.REACT_APP_ATOM_ORAICHAIN_DENOM:
      chainId = COSMOS_CHAINID;
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
    case KWT_DENOM:
      chainId = KAWAII_CHAINID;
      break;
    case MILKY:
      chainId = KAWAII_CHAINID;
      break;
    case ORAIX_DENOM.toLowerCase():
      chainId = ORAICHAIN_ID;
      break;
    case scORAI_DENOM:
      chainId = ORAICHAIN_ID;
      break;
    case process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM:
      chainId = OSMOSIS_CHAINID;
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
  }
  setFilterNetwork(chainId);
};
