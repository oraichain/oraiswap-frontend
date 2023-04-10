import { AppCurrency, Bech32Config, ChainInfo, Currency, FeeCurrency } from '@keplr-wallet/types';
import { ReactComponent as AiriIcon } from 'assets/icons/airi.svg';
import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MilkyIcon } from 'assets/icons/milky-token.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraixIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as ScOraiIcon } from 'assets/icons/orchai.svg';
import { ReactComponent as OsmoIcon } from 'assets/icons/osmosis.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';

import {
  AIRI_BSC_CONTRACT,
  BEP20_ORAI,
  ERC20_ORAI,
  KWT_BSC_CONTRACT,
  KWT_DENOM,
  MILKY_BSC_CONTRACT,
  MILKY_DENOM,
  MILKY_ERC_CONTRACT,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  ORAI_BSC_CONTRACT,
  ORAI_ETH_CONTRACT,
  USDC_ETH_CONTRACT,
  USDT_BSC_CONTRACT,
  USDT_TRON_CONTRACT,
  WRAP_TRON_TRX_CONTRACT
} from './constants';

export type NetworkName =
  | 'Oraichain'
  | 'Cosmos Hub'
  | 'Osmosis'
  | 'OraiBridge'
  | 'BNB Chain'
  | 'Ethereum'
  | 'Kawaiiverse'
  | 'Kawaiiverse EVM'
  | 'Tron Network';

export type CosmosChainId =
  | 'Oraichain' // oraichain
  | 'oraibridge-subnet-2' // oraibridge
  | 'osmosis-1' // osmosis
  | 'cosmoshub-4' // cosmos hub
  | 'kawaii_6886-1'; // kawaii subnetwork

export type EvmChainId =
  | '0x38' // bsc
  | '0x01' // ethereum
  | '0x1ae6' // kawaii
  | '0x2b6653dc'; // tron

export type NetworkChainId = CosmosChainId | EvmChainId;

export type CoinGeckoId =
  | 'oraichain-token'
  | 'osmosis'
  | 'cosmos'
  | 'ethereum'
  | 'bnb'
  | 'airight'
  | 'oraidex'
  | 'tether'
  | 'kawaii-islands'
  | 'milky-token'
  | 'scorai'
  | 'oraidex'
  | 'usd-coin'
  | 'tron';

export type NetworkType = 'cosmos' | 'evm';
export type CoinIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
export type BridgeAppCurrency = AppCurrency & {
  readonly bridgeTo?: NetworkChainId[];
  readonly coinGeckoId: CoinGeckoId;
  readonly Icon: CoinIcon;
  readonly bridgeNetworkIdentifier?: EvmChainId;
  readonly coinDecimals: 6 | 18;
  readonly contractAddress?: string;
};

export type CoinType = 118 | 60 | 195;

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 * some chain is already in wallet so we override some attributes as optional
 */
export interface CustomChainInfo
  extends Omit<ChainInfo, 'feeCurrencies' | 'stakeCurrency' | 'currencies' | 'rest' | 'bech32Config'> {
  readonly chainId: NetworkChainId;
  readonly chainName: NetworkName;
  readonly Icon?: CoinIcon;
  readonly networkType: NetworkType;
  readonly bip44: {
    coinType: CoinType;
  };
  readonly bech32Config?: Bech32Config;
  readonly rest?: string; // optional, rest api tron and lcd for cosmos
  readonly txExplorer?: {
    readonly coinDenom: string;
    readonly txUrl: string;
    readonly accountUrl?: string;
  };
  readonly stakeCurrency?: Currency;
  readonly feeCurrencies?: FeeCurrency[];
  readonly currencies: BridgeAppCurrency[];
  readonly gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}

export const defaultBech32Config = (
  mainPrefix: string,
  validatorPrefix = 'val',
  consensusPrefix = 'cons',
  publicPrefix = 'pub',
  operatorPrefix = 'oper'
) => {
  return {
    bech32PrefixAccAddr: mainPrefix,
    bech32PrefixAccPub: mainPrefix + publicPrefix,
    bech32PrefixValAddr: mainPrefix + validatorPrefix + operatorPrefix,
    bech32PrefixValPub: mainPrefix + validatorPrefix + operatorPrefix + publicPrefix,
    bech32PrefixConsAddr: mainPrefix + validatorPrefix + consensusPrefix,
    bech32PrefixConsPub: mainPrefix + validatorPrefix + consensusPrefix + publicPrefix
  };
};

export const OraiToken: BridgeAppCurrency = {
  coinDenom: 'ORAI',
  coinMinimalDenom: 'orai',
  coinDecimals: 6,
  coinGeckoId: 'oraichain-token',
  Icon: OraiIcon,
  bridgeTo: ['0x38', '0x01']
};

export const oraichainNetwork: CustomChainInfo = {
  rpc: 'https://rpc.orai.io',
  rest: 'https://lcd.orai.io',
  chainId: 'Oraichain',
  chainName: 'Oraichain',
  networkType: 'cosmos',
  stakeCurrency: OraiToken,
  bip44: {
    coinType: 118
  },
  bech32Config: defaultBech32Config('orai'),
  feeCurrencies: [OraiToken],
  gasPriceStep: {
    low: 0.003,
    average: 0.005,
    high: 0.007
  },
  Icon: OraiIcon,
  features: ['stargate', 'ibc-transfer', 'cosmwasm', 'wasmd_0.24+'],
  currencies: [
    OraiToken,
    {
      coinDenom: 'ATOM',
      coinGeckoId: 'cosmos',
      coinMinimalDenom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM,
      bridgeTo: ['cosmoshub-4'],
      coinDecimals: 6,
      Icon: AtomIcon
    },
    {
      coinDenom: 'BEP20 AIRI',
      coinGeckoId: 'airight',
      coinMinimalDenom: process.env.REACT_APP_AIRIBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: AiriIcon
    },
    {
      coinDenom: 'AIRI',
      coinGeckoId: 'airight',
      coinMinimalDenom: 'airi',
      contractAddress: process.env.REACT_APP_AIRI_CONTRACT,
      bridgeTo: ['0x38'],
      coinDecimals: 6,
      Icon: AiriIcon
    },
    {
      coinDenom: 'USDT',
      coinGeckoId: 'tether',
      coinMinimalDenom: 'usdt',
      contractAddress: process.env.REACT_APP_USDT_CONTRACT,
      bridgeTo: ['0x38', '0x2b6653dc'],
      coinDecimals: 6,
      Icon: UsdtIcon
    },
    {
      coinDenom: 'USDC',
      coinGeckoId: 'usd-coin',
      coinMinimalDenom: 'usdc',
      contractAddress: process.env.REACT_APP_USDC_CONTRACT,
      bridgeTo: ['0x01'],
      coinDecimals: 6,
      Icon: UsdcIcon
    },
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM,
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      bridgeTo: ['osmosis-1'],
      Icon: OsmoIcon
    },
    {
      coinDenom: 'BEP20 KWT',
      coinGeckoId: 'kawaii-islands',
      coinMinimalDenom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: KwtIcon
    },
    {
      coinDenom: 'KWT',
      coinGeckoId: 'kawaii-islands',
      coinMinimalDenom: 'kwt',
      contractAddress: process.env.REACT_APP_KWT_CONTRACT,
      bridgeTo: ['0x1ae6', '0x38'],
      coinDecimals: 6,
      Icon: KwtIcon
    },
    {
      coinDenom: 'BEP20 MILKY',
      coinGeckoId: 'milky-token',
      coinMinimalDenom: process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: MilkyIcon
    },
    {
      coinDenom: 'MILKY',
      coinGeckoId: 'milky-token',
      coinMinimalDenom: 'milky',
      contractAddress: process.env.REACT_APP_MILKY_CONTRACT,
      bridgeTo: ['0x1ae6', '0x38'],
      coinDecimals: 6,
      Icon: MilkyIcon
    },
    {
      coinDenom: 'ORAIX',
      coinMinimalDenom: 'oraix',
      contractAddress: process.env.REACT_APP_ORAIX_CONTRACT,
      coinGeckoId: 'oraidex',
      coinDecimals: 6,
      Icon: OraixIcon
    },
    {
      coinDenom: 'scORAI',
      coinMinimalDenom: 'scorai',
      contractAddress: process.env.REACT_APP_SCORAI_CONTRACT,
      coinGeckoId: 'scorai',
      coinDecimals: 6,
      Icon: ScOraiIcon
    },
    {
      coinDenom: 'wTRX',
      coinGeckoId: 'tron',
      coinMinimalDenom: 'trx',
      contractAddress: process.env.REACT_APP_TRX_CONTRACT,
      bridgeTo: ['0x2b6653dc'],
      coinDecimals: 6,
      Icon: TronIcon
    }
  ]
};

export const embedChainInfos: CustomChainInfo[] = [
  // networks to add on keplr
  oraichainNetwork,
  {
    rpc: 'https://bridge-v2.rpc.orai.io',
    rest: 'https://bridge-v2.lcd.orai.io',
    chainId: 'oraibridge-subnet-2',
    chainName: 'OraiBridge',
    networkType: 'cosmos',
    bip44: {
      coinType: 118
    },
    bech32Config: defaultBech32Config('oraib'),
    gasPriceStep: {
      low: 0,
      average: 0,
      high: 0
    },
    features: ['stargate', 'ibc-transfer'],
    stakeCurrency: {
      coinDenom: 'ORAIB',
      coinMinimalDenom: 'uoraib',
      coinDecimals: 6
    },
    get feeCurrencies() {
      return [this.stakeCurrency];
    },
    // not use oraib as currency
    currencies: [
      {
        coinDenom: 'ORAI',
        coinMinimalDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + ORAI_BSC_CONTRACT,
        bridgeNetworkIdentifier: '0x38',
        coinDecimals: 18,
        coinGeckoId: 'oraichain-token',
        Icon: OraiIcon
      },
      {
        coinDenom: 'ORAI',
        coinMinimalDenom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + ORAI_ETH_CONTRACT,
        bridgeNetworkIdentifier: '0x01',
        coinDecimals: 18,
        coinGeckoId: 'oraichain-token',
        Icon: OraiIcon
      },
      {
        coinDenom: 'USDC',
        coinMinimalDenom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + USDC_ETH_CONTRACT,
        bridgeNetworkIdentifier: '0x01',
        coinDecimals: 6,
        coinGeckoId: 'usd-coin',
        Icon: UsdcIcon
      },
      {
        coinDenom: 'AIRI',
        coinMinimalDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
        bridgeNetworkIdentifier: '0x38',
        coinDecimals: 18,
        coinGeckoId: 'airight',
        Icon: AiriIcon
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
        bridgeNetworkIdentifier: '0x38',
        coinDecimals: 18,
        coinGeckoId: 'tether',
        Icon: UsdtIcon
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + USDT_TRON_CONTRACT,
        bridgeNetworkIdentifier: '0x2b6653dc',
        coinDecimals: 6,
        coinGeckoId: 'tether',
        Icon: UsdtIcon
      },
      {
        coinDenom: 'wTRX',
        coinMinimalDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + WRAP_TRON_TRX_CONTRACT,
        bridgeNetworkIdentifier: '0x2b6653dc',
        coinDecimals: 6,
        coinGeckoId: 'tron',
        Icon: TronIcon
      },
      {
        coinDenom: 'KWT',
        bridgeNetworkIdentifier: '0x38',
        coinMinimalDenom: KWT_DENOM,
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KwtIcon
      },
      {
        coinDenom: 'MILKY',
        bridgeNetworkIdentifier: '0x38',
        coinMinimalDenom: MILKY_DENOM,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        Icon: MilkyIcon
      }
    ]
  },
  {
    rpc: 'https://tendermint1.kawaii.global',
    rest: 'https://cosmos1.kawaii.global',
    chainId: 'kawaii_6886-1',
    chainName: 'Kawaiiverse',
    networkType: 'cosmos',
    stakeCurrency: {
      coinDenom: 'ORAIE',
      coinMinimalDenom: 'oraie',
      coinDecimals: 18,
      coinGeckoId: 'oraie'
    },
    bip44: {
      coinType: 60
    },
    bech32Config: defaultBech32Config('oraie'),
    get feeCurrencies() {
      return [this.stakeCurrency];
    },
    gasPriceStep: {
      low: 0,
      average: 0.000025,
      high: 0.00004
    },
    Icon: KwtIcon,
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    currencies: [
      {
        coinDenom: 'MILKY',
        coinGeckoId: 'milky-token',
        coinMinimalDenom: process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM,
        coinDecimals: 18,
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        Icon: MilkyIcon
      },
      {
        coinDenom: 'ERC20 MILKY',
        coinMinimalDenom: 'erc20_milky',
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        contractAddress: MILKY_ERC_CONTRACT,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        Icon: MilkyIcon
      },
      {
        coinDenom: 'KWT',
        coinMinimalDenom: process.env.REACT_APP_KWT_SUB_NETWORK_DENOM,
        coinDecimals: 18,
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        coinGeckoId: 'kawaii-islands',
        Icon: KwtIcon
      },
      {
        coinDenom: 'ERC20 KWT',
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        coinMinimalDenom: 'erc20_kwt',
        contractAddress: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KwtIcon
      }
    ]
  },

  /// popular networks already included
  {
    rpc: 'https://rpc-osmosis.blockapsis.com',
    rest: 'https://lcd-osmosis.blockapsis.com',
    chainId: 'osmosis-1',
    chainName: 'Osmosis',
    networkType: 'cosmos',
    bip44: {
      coinType: 118
    },
    Icon: OsmoIcon,
    bech32Config: defaultBech32Config('osmo'),
    currencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        bridgeTo: ['Oraichain'],
        Icon: OsmoIcon
      }
    ]
  },
  {
    rpc: 'https://rpc-cosmos.oraidex.io',
    rest: 'https://lcd-cosmos.oraidex.io',
    chainId: 'cosmoshub-4',
    chainName: 'Cosmos Hub',
    networkType: 'cosmos',
    bip44: {
      coinType: 118
    },
    Icon: AtomIcon,
    bech32Config: defaultBech32Config('cosmos'),
    currencies: [
      {
        coinDenom: 'ATOM',
        coinGeckoId: 'cosmos',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
        bridgeTo: ['Oraichain'],
        Icon: AtomIcon
      }
    ]
  },

  /// evm chain info
  {
    rpc: 'https://1rpc.io/eth',
    chainId: '0x01',
    chainName: 'Ethereum',
    bip44: {
      coinType: 60
    },
    Icon: EthIcon,
    networkType: 'evm',
    currencies: [
      {
        coinDenom: 'ORAI',
        coinMinimalDenom: ERC20_ORAI,
        contractAddress: ORAI_ETH_CONTRACT,
        coinDecimals: 18,
        bridgeTo: ['Oraichain'],
        coinGeckoId: 'oraichain-token',
        Icon: OraiIcon
      },
      {
        coinDenom: 'USDC',
        coinMinimalDenom: 'erc20_usdc',
        contractAddress: USDC_ETH_CONTRACT,
        coinDecimals: 6,
        bridgeTo: ['Oraichain'],
        coinGeckoId: 'usd-coin',
        Icon: UsdcIcon
      }
    ]
  },
  {
    rpc: 'https://api.trongrid.io/jsonrpc',
    rest: 'https://api.trongrid.io',
    chainId: '0x2b6653dc',
    networkType: 'evm',
    chainName: 'Tron Network',
    Icon: TronIcon,
    currencies: [
      {
        coinDenom: 'USDT',
        coinMinimalDenom: 'trx20_usdt',
        contractAddress: USDT_TRON_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 6,
        coinGeckoId: 'tether',
        Icon: UsdtIcon
      },
      {
        coinDenom: 'wTRX',
        coinMinimalDenom: 'trx20_trx',
        contractAddress: WRAP_TRON_TRX_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 6,
        coinGeckoId: 'tron',
        Icon: TronIcon
      }
    ],
    bip44: {
      coinType: 195
    }
  },
  {
    rpc: 'https://1rpc.io/bnb',
    networkType: 'evm',
    Icon: BnbIcon,
    chainId: '0x38',
    chainName: 'BNB Chain',
    bip44: {
      coinType: 60
    },
    currencies: [
      {
        coinDenom: 'ORAI',
        coinMinimalDenom: BEP20_ORAI,
        contractAddress: ORAI_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'oraichain-token',
        Icon: OraiIcon
      },
      {
        coinDenom: 'AIRI',
        coinMinimalDenom: 'bep20_airi',
        contractAddress: AIRI_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'airight',
        Icon: AiriIcon
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: 'bep20_usdt',
        contractAddress: USDT_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'tether',
        Icon: UsdtIcon
      },
      {
        coinDenom: 'KWT',
        coinMinimalDenom: 'bep20_kwt',
        contractAddress: KWT_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KwtIcon
      },
      {
        coinDenom: 'MILKY',
        coinMinimalDenom: 'bep20_milky',
        contractAddress: MILKY_BSC_CONTRACT,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        bridgeTo: ['Oraichain'],
        Icon: MilkyIcon
      }
    ]
  },
  {
    rpc: 'https://endpoint1.kawaii.global',
    chainId: '0x1ae6',
    networkType: 'evm',
    chainName: 'Kawaiiverse EVM',
    Icon: KwtIcon,
    bip44: {
      coinType: 60
    },
    currencies: []
  }
];

// exclude kawaiverse subnet and other special evm that has different cointype
export const evmChains = embedChainInfos.filter(
  (c) => c.networkType === 'evm' && c.bip44.coinType === 60 && c.chainId !== '0x1ae6'
);
