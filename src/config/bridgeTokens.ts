import React, { ReactElement } from 'react';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OSMO } from 'assets/icons/osmosis.svg';
import { ReactComponent as ATOMCOSMOS } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as AIRI } from 'assets/icons/airi.svg';
import { ReactComponent as USDT } from 'assets/icons/tether.svg';
import { ReactComponent as KWT } from 'assets/icons/kwt.svg';
import { ReactComponent as MILKY } from 'assets/icons/milky-token.svg';
import { ReactComponent as ORAIX } from 'assets/icons/OraidexSVG.svg';
import { ReactComponent as scORAI } from 'assets/icons/orchai.svg';
import _ from 'lodash';
import {
  AIRI_BSC_CONTRACT,
  BEP20_ORAI,
  BSC_CHAIN_ID,
  BSC_ORG,
  BSC_RPC,
  COSMOS_DECIMALS,
  ERC20_ORAI,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_ORG,
  ETHEREUM_RPC,
  EVM_DECIMALS,
  KAWAII_CONTRACT,
  KAWAII_LCD,
  KAWAII_RPC,
  KAWAII_SUBNET_RPC,
  KWT_BSC_CONTRACT,
  KWT_DENOM,
  KWT_SUBNETWORK_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  MILKY_DENOM,
  MILKY_ERC_CONTRACT,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_LCD,
  ORAI_BRIDGE_PREFIX,
  ORAI_BRIDGE_RPC,
  ORAI_BRIDGE_UDENOM,
  ORAI_BSC_CONTRACT,
  ORAI_ETH_CONTRACT,
  ORAI_LCD,
  ORAI_RPC,
  STABLE_DENOM,
  USDT_BSC_CONTRACT
} from './constants';

export type Erc20Cw20Map = {
  prefix: string;
  description: string;
  decimals: {
    erc20Decimals: number;
    cw20Decimals: number;
  };
  erc20Denom: string;
};

export type TokenItemType = {
  name: string;
  org?:
    | 'Oraichain'
    | 'Cosmos Hub'
    | 'Osmosis'
    | 'OraiBridge'
    | 'BNB Chain'
    | 'Ethereum'
    | 'Kawaiiverse';
  denom: string;
  prefix?: string;
  contractAddress?: string;
  erc20Cw20Map?: Erc20Cw20Map[];
  bridgeNetworkIdentifier?: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  chainId: string | number;
  coinType?: number;
  rpc: string;
  lcd?: string;
  decimals: number;
  maxGas?: number;
  coingeckoId:
    | 'oraichain-token'
    | 'osmosis'
    | 'cosmos'
    | 'ethereum'
    | 'bnb'
    | 'airight'
    | 'oraix'
    | 'tether'
    | 'kawaii-islands'
    | 'milky-token'
    | 'scorai'
    | 'oraidex';
  cosmosBased: Boolean;
  type?: string;
};

// other chains, oraichain
const otherChainTokens: TokenItemType[] = [
  {
    name: 'ATOM',
    org: 'Cosmos Hub',
    coinType: 118,
    prefix: 'cosmos',
    coingeckoId: 'cosmos',
    denom: 'uatom',
    decimals: COSMOS_DECIMALS,
    chainId: 'cosmoshub-4',
    rpc: 'https://rpc-cosmos.oraidex.io',
    lcd: 'https://lcd-cosmos.oraidex.io/',
    // lcd: 'https://lcd-cosmoshub.blockapsis.com',
    cosmosBased: true,
    maxGas: 20000 * 0.16,
    Icon: ATOMCOSMOS
  },

  {
    name: 'OSMO',
    org: 'Osmosis',
    prefix: 'osmo',
    denom: 'uosmo',
    coinType: 118,
    chainId: 'osmosis-1',
    rpc: 'https://rpc.osmosis.interbloc.org',
    // lcd: 'https://lcd-osmosis.keplr.app',
    // lcd: 'https://lcd.osmosis.zone',
    lcd: 'https://lcd-osmosis.blockapsis.com',
    decimals: COSMOS_DECIMALS,
    coingeckoId: 'osmosis',
    cosmosBased: true,
    maxGas: 20000 * 0.025,
    Icon: OSMO
  },

  {
    name: 'ORAI',
    prefix: ORAI_BRIDGE_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + ORAI_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'oraichain-token',
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'ORAI',
    prefix: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + ORAI_ETH_CONTRACT,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'oraichain-token',
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'AIRI',
    prefix: ORAI_BRIDGE_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'airight',
    cosmosBased: true,
    Icon: AIRI
  },
  {
    name: 'USDT',
    prefix: ORAI_BRIDGE_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    coinType: 118,
    denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
    bridgeNetworkIdentifier: BSC_ORG,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'tether',
    cosmosBased: true,
    Icon: USDT
  },
  {
    name: 'KWT',
    prefix: ORAI_BRIDGE_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    bridgeNetworkIdentifier: BSC_ORG,
    coinType: 118,
    denom: KWT_DENOM,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'kawaii-islands',
    cosmosBased: true,
    Icon: KWT
  },
  {
    name: 'MILKY',
    prefix: ORAI_BRIDGE_PREFIX,
    org: 'OraiBridge',
    chainId: ORAI_BRIDGE_CHAIN_ID,
    bridgeNetworkIdentifier: BSC_ORG,
    coinType: 118,
    denom: MILKY_DENOM,
    rpc: ORAI_BRIDGE_RPC,
    lcd: ORAI_BRIDGE_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'milky-token',
    cosmosBased: true,
    Icon: MILKY
  },

  {
    name: 'ORAI',
    org: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    denom: BEP20_ORAI,
    contractAddress: ORAI_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'oraichain-token',
    cosmosBased: false,
    Icon: OraiIcon
  },
  {
    name: 'ORAI',
    org: ETHEREUM_ORG,
    chainId: ETHEREUM_CHAIN_ID,
    denom: ERC20_ORAI,
    contractAddress: ORAI_ETH_CONTRACT,
    rpc: ETHEREUM_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'oraichain-token',
    cosmosBased: false,
    Icon: OraiIcon
  },
  {
    name: 'AIRI',
    org: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    denom: 'bep20_airi',
    contractAddress: AIRI_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'airight',
    cosmosBased: false,
    Icon: AIRI
  },
  {
    name: 'USDT',
    org: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    denom: 'bep20_usdt',
    contractAddress: USDT_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'tether',
    cosmosBased: false,
    Icon: USDT
  },
  {
    name: 'KWT',
    org: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    denom: 'bep20_kwt',
    contractAddress: KWT_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'kawaii-islands',
    cosmosBased: false,
    Icon: KWT
  },
  {
    name: 'MILKY',
    org: BSC_ORG,
    chainId: BSC_CHAIN_ID,
    denom: 'bep20_milky',
    contractAddress: MILKY_BSC_CONTRACT,
    rpc: BSC_RPC,
    decimals: EVM_DECIMALS,
    coingeckoId: 'milky-token',
    cosmosBased: false,
    Icon: MILKY
  },
  {
    name: 'MILKY',
    org: 'Kawaiiverse',
    coingeckoId: 'milky-token',
    denom: process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM,
    decimals: EVM_DECIMALS,
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    rpc: KAWAII_RPC,
    lcd: KAWAII_LCD,
    cosmosBased: true,
    type: 'milky',
    maxGas: 200000 * 2,
    Icon: MILKY
  },
  {
    name: 'ERC20 MILKY',
    org: 'Kawaiiverse',
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    denom: 'erc20_milky',
    contractAddress: MILKY_ERC_CONTRACT,
    rpc: KAWAII_SUBNET_RPC,
    lcd: KAWAII_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'milky-token',
    cosmosBased: false,
    maxGas: 200000 * 2,
    type: 'milky',
    Icon: MILKY
  },
  {
    name: 'KWT',
    org: 'Kawaiiverse',
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    denom: process.env.REACT_APP_KWT_SUB_NETWORK_DENOM,
    decimals: EVM_DECIMALS,
    coingeckoId: 'kawaii-islands',
    rpc: KAWAII_RPC,
    lcd: KAWAII_LCD,
    cosmosBased: true,
    maxGas: 200000 * 2,
    type: 'kawaii',
    Icon: KWT
  },
  {
    name: 'ERC20 KWT',
    org: 'Kawaiiverse',
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    denom: 'erc20_kwt',
    contractAddress: KAWAII_CONTRACT,
    rpc: KAWAII_SUBNET_RPC,
    lcd: KAWAII_LCD,
    decimals: EVM_DECIMALS,
    coingeckoId: 'kawaii-islands',
    cosmosBased: false,
    type: 'kawaii',
    Icon: KWT
  }
];

const oraichainTokens: TokenItemType[] = [
  {
    name: 'ORAI',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coinType: 118,
    denom: 'orai',
    coingeckoId: 'oraichain-token',

    decimals: COSMOS_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'ATOM',
    org: ORAICHAIN_ID,
    prefix: ORAI,
    coingeckoId: 'cosmos',
    coinType: 118,
    denom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM,
    decimals: COSMOS_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: ATOMCOSMOS
  },

  {
    name: 'AIRI',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'airight',
    denom: 'airi',
    contractAddress: process.env.REACT_APP_AIRI_CONTRACT,
    erc20Cw20Map: [
      {
        prefix: 'BEP20',
        description: 'Ibc token from BNB chain',
        decimals: {
          erc20Decimals: EVM_DECIMALS,
          cw20Decimals: COSMOS_DECIMALS
        },
        erc20Denom: process.env.REACT_APP_AIRIBSC_ORAICHAIN_DENOM
      }
    ],
    decimals: COSMOS_DECIMALS,
    coinType: 118,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: AIRI
  },
  {
    name: 'USDT',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'tether',
    denom: STABLE_DENOM,
    contractAddress: process.env.REACT_APP_USDT_CONTRACT,
    erc20Cw20Map: [
      {
        prefix: 'BEP20',
        description: 'Ibc token from BNB chain',
        decimals: {
          erc20Decimals: EVM_DECIMALS,
          cw20Decimals: COSMOS_DECIMALS
        },
        erc20Denom: process.env.REACT_APP_USDTBSC_ORAICHAIN_DENOM
      }
    ],
    decimals: COSMOS_DECIMALS,
    coinType: 118,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: USDT
  },
  {
    name: 'OSMO',
    org: ORAICHAIN_ID,
    denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM,
    prefix: 'orai',
    coinType: 118,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    decimals: COSMOS_DECIMALS,
    coingeckoId: 'osmosis',
    cosmosBased: true,
    Icon: OSMO
  },

  {
    name: 'BEP20 ORAI',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'oraichain-token',
    denom: process.env.REACT_APP_ORAIBSC_ORAICHAIN_DENOM,
    bridgeNetworkIdentifier: BSC_ORG,
    decimals: EVM_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: OraiIcon
  },
  {
    name: 'ERC20 ORAI',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'oraichain-token',
    denom: process.env.REACT_APP_ORAIETH_ORAICHAIN_DENOM,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    decimals: EVM_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: OraiIcon
  },

  {
    name: 'KWT',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'kawaii-islands',
    denom: 'kwt',
    contractAddress: process.env.REACT_APP_KWT_CONTRACT,
    erc20Cw20Map: [
      {
        prefix: 'BEP20',
        description: 'Ibc token from BNB chain',
        decimals: {
          erc20Decimals: EVM_DECIMALS,
          cw20Decimals: COSMOS_DECIMALS
        },
        erc20Denom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM
      }
    ],
    decimals: COSMOS_DECIMALS,
    coinType: 118,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: KWT
  },
  {
    name: 'MILKY',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coingeckoId: 'milky-token',
    denom: 'milky',
    contractAddress: process.env.REACT_APP_MILKY_CONTRACT,
    erc20Cw20Map: [
      {
        prefix: 'BEP20',
        description: 'Ibc token from BNB chain',
        decimals: {
          erc20Decimals: EVM_DECIMALS,
          cw20Decimals: COSMOS_DECIMALS
        },
        erc20Denom: process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM
      }
    ],
    decimals: COSMOS_DECIMALS,
    coinType: 118,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: MILKY
  },
  {
    name: 'ORAIX',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coinType: 118,
    denom: 'oraix',
    contractAddress: process.env.REACT_APP_ORAIX_CONTRACT,
    coingeckoId: 'oraidex',
    decimals: COSMOS_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: ORAIX
  },
  {
    name: 'scORAI',
    org: ORAICHAIN_ID,
    prefix: 'orai',
    coinType: 118,
    denom: 'scorai',
    contractAddress: process.env.REACT_APP_SCORAI_CONTRACT,
    coingeckoId: 'scorai',
    decimals: COSMOS_DECIMALS,
    chainId: ORAICHAIN_ID,
    rpc: ORAI_RPC,
    lcd: ORAI_LCD,
    cosmosBased: true,
    Icon: scORAI
  }
];

export const tokens = [otherChainTokens, oraichainTokens];

export const filteredTokens = _.uniqBy(
  _.flatten(tokens).filter(
    (token) =>
      // !token.contractAddress &&
      token.denom && token.cosmosBased && token.coingeckoId
  ),
  (c) => c.denom
);

export const cw20Tokens = _.uniqBy(
  _.flatten(filteredTokens).filter(
    // filter cosmos based tokens to collect tokens that have contract addresses
    (token) =>
      // !token.contractAddress &&
      token.contractAddress
  ),
  (c) => c.denom
);

export const evmTokens = _.uniqBy(
  _.flatten(tokens).filter(
    (token) =>
      // !token.contractAddress &&
      token.denom &&
      !token.cosmosBased &&
      token.coingeckoId &&
      token.chainId !== KWT_SUBNETWORK_CHAIN_ID
  ),
  (c) => c.denom
);

export const kawaiiTokens = _.uniqBy(
  _.flatten(tokens).filter(
    (token) => token.chainId === KWT_SUBNETWORK_CHAIN_ID
  ),
  (c) => c.denom
);

export const gravityContracts: { [key: string]: string } = {
  [BSC_CHAIN_ID]: process.env.REACT_APP_GRAVITY_BSC_CONTRACT,
  [ETHEREUM_CHAIN_ID]: process.env.REACT_APP_GRAVITY_ETH_CONTRACT
};

export const usdtToken = _.uniqBy(
  _.flatten(tokens).filter((token) => token.denom === STABLE_DENOM),
  (c) => c.denom
);
