import React from 'react';
import { ReactComponent as BNBIcon } from 'assets/network/bnb.svg';
import { ReactComponent as ORAIIcon } from 'assets/network/oraichain.svg';
import { ReactComponent as KwtIcon } from 'assets/network/kwt.svg';
import { ReactComponent as AtomCosmosIcon } from 'assets/network/atom_cosmos.svg';
import { ReactComponent as OsmosisIcon } from 'assets/network/osmosis.svg';
import useGlobalState from 'hooks/useGlobalState';

export const listNetwork = [
  { title: 'Oraichain', chainId: 'Oraichain', icon: <ORAIIcon /> },
  { title: 'OraiBridge', chainId: 'OraiBridge', icon: <ORAIIcon /> },
  { title: 'Kawaiiverse', chainId: 'Kawaiiverse', icon: <KwtIcon /> },
  { title: 'Osmosis', chainId: 'Osmosis', icon: <OsmosisIcon /> },
  { title: 'Cosmos Hub', chainId: 'Cosmos Hub', icon: <AtomCosmosIcon /> },
  { title: 'BNB Chain', chainId: 'BNB Chain', icon: <BNBIcon /> },
];

export const renderLogoNetwork = (network: string) => {
  let logo = <ORAIIcon />;
  switch (network) {
    case 'Oraichain':
      logo = <ORAIIcon />;
      break;
    case 'OraiBridge':
      logo = <ORAIIcon />;
      break;
    case 'Kawaiiverse':
      logo = <KwtIcon />;
      break;
    case 'Osmosis':
      logo = <OsmosisIcon />;
      break;
    case 'Cosmos Hub':
      logo = <AtomCosmosIcon />;
      break;
    case 'BNB Chain':
      logo = <BNBIcon />;
      break;
  }
  return logo;
};