import { AppCurrency, Bech32Config, ChainInfo, Currency, FeeCurrency } from '@keplr-wallet/types';
import { ReactComponent as AIRI } from 'assets/icons/airi.svg';
import { ReactComponent as ATOMCOSMOS } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as KWT } from 'assets/icons/kwt.svg';
import { ReactComponent as MILKY } from 'assets/icons/milky-token.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as ORAIX } from 'assets/icons/oraix.svg';
import { ReactComponent as scORAI } from 'assets/icons/orchai.svg';
import { ReactComponent as OSMO } from 'assets/icons/osmosis.svg';
import { ReactComponent as USDT } from 'assets/icons/tether.svg';
import { ReactComponent as TRON } from 'assets/icons/tron.svg';
import { ReactComponent as USDC } from 'assets/icons/usd_coin.svg';
import {
  AIRI_BSC_CONTRACT,
  BEP20_ORAI,
  ERC20_ORAI,
  KAWAII_CONTRACT,
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

export type NetworkChainId =
  | 'Oraichain' // oraichain
  | 'oraibridge-subnet-2' // oraibridge
  | '0x38' // bsc
  | '0x01' // ethereum
  | '0x1ae6' // kawaii
  | '0x2b6653dc' // tron
  | 'osmosis-1' // osmosis
  | 'cosmoshub-4' // cosmos hub
  | 'kawaii_6886-1'; // kawaii subnetwork

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
  readonly bridgeNetworkIdentifier?: NetworkChainId;
  readonly coinDecimals: 6 | 18;
};

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 * some chain is already in wallet so we override some attributes as optional
 */
export interface ChainInfoCustom
  extends Omit<ChainInfo, 'feeCurrencies' | 'stakeCurrency' | 'currencies' | 'rest' | 'bech32Config'> {
  readonly chainId: NetworkChainId;
  readonly chainName: NetworkName;
  readonly networkType: NetworkType;
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

export const oraichainNetwork: ChainInfoCustom = {
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
  features: ['stargate', 'ibc-transfer', 'cosmwasm', 'wasmd_0.24+'],
  currencies: [
    OraiToken,
    {
      coinDenom: 'ATOM',
      coinGeckoId: 'cosmos',
      coinMinimalDenom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM,
      bridgeTo: ['cosmoshub-4'],
      coinDecimals: 6,
      Icon: ATOMCOSMOS
    },
    {
      coinDenom: 'BEP20 AIRI',
      coinGeckoId: 'airight',
      coinMinimalDenom: process.env.REACT_APP_AIRIBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: AIRI
    },
    {
      coinDenom: 'AIRI',
      coinGeckoId: 'airight',
      coinMinimalDenom: 'airi',
      contractAddress: process.env.REACT_APP_AIRI_CONTRACT,
      bridgeTo: ['0x38'],
      coinDecimals: 6,
      Icon: AIRI
    },
    {
      coinDenom: 'USDT',
      coinGeckoId: 'tether',
      coinMinimalDenom: 'usdt',
      contractAddress: process.env.REACT_APP_USDT_CONTRACT,
      bridgeTo: ['0x38', '0x2b6653dc'],
      coinDecimals: 6,
      Icon: USDT
    },
    {
      coinDenom: 'USDC',
      coinGeckoId: 'usd-coin',
      coinMinimalDenom: 'usdc',
      contractAddress: process.env.REACT_APP_USDC_CONTRACT,
      bridgeTo: ['0x01'],
      coinDecimals: 6,
      Icon: USDC
    },
    {
      coinDenom: 'OSMO',
      coinMinimalDenom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM,
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      bridgeTo: ['osmosis-1'],
      Icon: OSMO
    },
    {
      coinDenom: 'BEP20 KWT',
      coinGeckoId: 'kawaii-islands',
      coinMinimalDenom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: KWT
    },
    {
      coinDenom: 'KWT',
      coinGeckoId: 'kawaii-islands',
      coinMinimalDenom: 'kwt',
      contractAddress: process.env.REACT_APP_KWT_CONTRACT,
      bridgeTo: ['0x1ae6', '0x38'],
      coinDecimals: 6,
      Icon: KWT
    },
    {
      coinDenom: 'BEP20 MILKY',
      coinGeckoId: 'milky-token',
      coinMinimalDenom: process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM,
      coinDecimals: 18,
      Icon: MILKY
    },
    {
      coinDenom: 'MILKY',
      coinGeckoId: 'milky-token',
      coinMinimalDenom: 'milky',
      contractAddress: process.env.REACT_APP_MILKY_CONTRACT,
      bridgeTo: ['0x1ae6', '0x38'],
      coinDecimals: 6,
      Icon: MILKY
    },
    {
      coinDenom: 'ORAIX',
      coinMinimalDenom: 'oraix',
      contractAddress: process.env.REACT_APP_ORAIX_CONTRACT,
      coinGeckoId: 'oraidex',
      coinDecimals: 6,
      Icon: ORAIX
    },
    {
      coinDenom: 'scORAI',
      coinMinimalDenom: 'scorai',
      contractAddress: process.env.REACT_APP_SCORAI_CONTRACT,
      coinGeckoId: 'scorai',
      coinDecimals: 6,
      Icon: scORAI
    },
    {
      coinDenom: 'wTRX',
      coinGeckoId: 'tron',
      coinMinimalDenom: 'trx',
      contractAddress: process.env.REACT_APP_TRX_CONTRACT,
      bridgeTo: ['0x2b6653dc'],
      coinDecimals: 6,
      Icon: TRON
    }
  ]
};

export const embedChainInfos: ChainInfoCustom[] = [
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
        Icon: USDC
      },
      {
        coinDenom: 'AIRI',
        coinMinimalDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
        bridgeNetworkIdentifier: '0x38',
        coinDecimals: 18,
        coinGeckoId: 'airight',
        Icon: AIRI
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
        bridgeNetworkIdentifier: '0x38',
        coinDecimals: 18,
        coinGeckoId: 'tether',
        Icon: USDT
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + USDT_TRON_CONTRACT,
        bridgeNetworkIdentifier: '0x2b6653dc',
        coinDecimals: 6,
        coinGeckoId: 'tether',
        Icon: USDT
      },
      {
        coinDenom: 'wTRX',
        coinMinimalDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + WRAP_TRON_TRX_CONTRACT,
        bridgeNetworkIdentifier: '0x2b6653dc',
        coinDecimals: 6,
        coinGeckoId: 'tron',
        Icon: TRON
      },
      {
        coinDenom: 'KWT',
        bridgeNetworkIdentifier: '0x38',
        coinMinimalDenom: KWT_DENOM,
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KWT
      },
      {
        coinDenom: 'MILKY',
        bridgeNetworkIdentifier: '0x38',
        coinMinimalDenom: MILKY_DENOM,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        Icon: MILKY
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
    features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
    currencies: [
      {
        coinDenom: 'MILKY',
        coinGeckoId: 'milky-token',
        coinMinimalDenom: process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM,
        coinDecimals: 18,
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        Icon: MILKY
      },
      {
        coinDenom: 'ERC20 MILKY',
        coinMinimalDenom: 'erc20_milky',
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        contractAddress: MILKY_ERC_CONTRACT,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        Icon: MILKY
      },
      {
        coinDenom: 'KWT',
        coinMinimalDenom: process.env.REACT_APP_KWT_SUB_NETWORK_DENOM,
        coinDecimals: 18,
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        coinGeckoId: 'kawaii-islands',
        Icon: KWT
      },
      {
        coinDenom: 'ERC20 KWT',
        bridgeTo: ['Oraichain', 'kawaii_6886-1'],
        coinMinimalDenom: 'erc20_kwt',
        contractAddress: KAWAII_CONTRACT,
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KWT
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
    bech32Config: defaultBech32Config('osmo'),
    currencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        bridgeTo: ['Oraichain'],
        Icon: OSMO
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
    bech32Config: defaultBech32Config('cosmos'),
    currencies: [
      {
        coinDenom: 'ATOM',
        coinGeckoId: 'cosmos',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
        bridgeTo: ['Oraichain'],
        Icon: ATOMCOSMOS
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
        Icon: USDC
      }
    ]
  },
  {
    rpc: 'https://api.trongrid.io/jsonrpc',
    rest: 'https://api.trongrid.io',
    chainId: '0x2b6653dc',
    networkType: 'evm',
    chainName: 'Tron Network',
    currencies: [
      {
        coinDenom: 'USDT',
        coinMinimalDenom: 'trx20_usdt',
        contractAddress: USDT_TRON_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 6,
        coinGeckoId: 'tether',
        Icon: USDT
      },
      {
        coinDenom: 'wTRX',
        coinMinimalDenom: 'trx20_trx',
        contractAddress: WRAP_TRON_TRX_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 6,
        coinGeckoId: 'tron',
        Icon: TRON
      }
    ],
    bip44: {
      coinType: 195
    }
  },
  {
    rpc: 'https://1rpc.io/bnb',
    networkType: 'evm',
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
        Icon: AIRI
      },
      {
        coinDenom: 'USDT',
        coinMinimalDenom: 'bep20_usdt',
        contractAddress: USDT_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'tether',
        Icon: USDT
      },
      {
        coinDenom: 'KWT',
        coinMinimalDenom: 'bep20_kwt',
        contractAddress: KWT_BSC_CONTRACT,
        bridgeTo: ['Oraichain'],
        coinDecimals: 18,
        coinGeckoId: 'kawaii-islands',
        Icon: KWT
      },
      {
        coinDenom: 'MILKY',
        coinMinimalDenom: 'bep20_milky',
        contractAddress: MILKY_BSC_CONTRACT,
        coinDecimals: 18,
        coinGeckoId: 'milky-token',
        bridgeTo: ['Oraichain'],
        Icon: MILKY
      }
    ]
  },
  {
    rpc: 'https://endpoint1.kawaii.global',
    chainId: '0x1ae6',
    networkType: 'evm',
    chainName: 'Kawaiiverse EVM',
    bip44: {
      coinType: 60
    },
    currencies: []
  }
];
