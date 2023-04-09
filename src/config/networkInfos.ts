import { Bech32Config, BIP44, ChainInfo, Currency, FeeCurrency } from '@keplr-wallet/types';
import { ReactComponent as AIRI } from 'assets/icons/airi.svg';
import { ReactComponent as ATOMCOSMOS } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as BNBIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as ETHIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as KWTIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MILKY } from 'assets/icons/milky-token.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as ORAIX } from 'assets/icons/oraix.svg';
import { ReactComponent as scORAI } from 'assets/icons/orchai.svg';
import { ReactComponent as OSMO } from 'assets/icons/osmosis.svg';
import { ReactComponent as USDT } from 'assets/icons/tether.svg';
import { ReactComponent as TRON, ReactComponent as TRONIcon } from 'assets/icons/tron.svg';
import { ReactComponent as USDC } from 'assets/icons/usd_coin.svg';
import { TokenItemType } from './bridgeTokens';
import {
  AIRIGHT_COINGECKO_ID,
  AIRI_BSC_CONTRACT,
  BEP20_ORAI,
  BSC_CHAIN_ID,
  BSC_ORG,
  BSC_RPC,
  COSMOS_CHAIN_ID,
  COSMOS_COINGECKO_ID,
  COSMOS_DECIMALS,
  COSMOS_NETWORK_RPC,
  COSMOS_ORG,
  ERC20_ORAI,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_ORG,
  ETHEREUM_RPC,
  EVM_DECIMALS,
  KAWAII_CONTRACT,
  KAWAII_ORG,
  KAWAII_RPC,
  KAWAII_SUBNET_RPC,
  KWT,
  KWT_BSC_CONTRACT,
  KWT_COINGECKO_ID,
  KWT_DENOM,
  KWT_SUBNETWORK_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  MILKY_COINGECKO_ID,
  MILKY_DENOM,
  MILKY_ERC_CONTRACT,
  ORAICHAIN_ID,
  ORAICHAIN_ORG,
  ORAIX_COINGECKO_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_DENOM,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  ORAI_BRIDGE_LCD,
  ORAI_BRIDGE_ORG,
  ORAI_BRIDGE_PREFIX,
  ORAI_BRIDGE_RPC,
  ORAI_BRIDGE_UDENOM,
  ORAI_BSC_CONTRACT,
  ORAI_COINGECKO_ID,
  ORAI_ETH_CONTRACT,
  ORAI_LCD,
  ORAI_RPC,
  ORAI_SCAN,
  OSMOSIS_CHAIN_ID,
  OSMOSIS_COINGECKO_ID,
  OSMOSIS_ORG,
  STABLE_DENOM,
  TRON_CHAIN_ID,
  TRON_COINGECKO_ID,
  TRON_DENOM,
  TRON_ORG,
  TRON_RPC,
  UAIRI,
  UATOM_DENOM,
  UOSMOS_DENOM,
  USDC_ETH_CONTRACT,
  USDT_BSC_CONTRACT,
  USDT_COINGECKO_ID,
  USDT_TRON_CONTRACT,
  WRAP_TRON_TRX_CONTRACT
} from './constants';

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 */
export interface ChainInfoCustom
  extends Omit<ChainInfo, 'bech32Config' | 'bip44' | 'stakeCurrency' | 'feeCurrencies' | 'rest'> {
  currencies: TokenItemType[];
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isCosmosBased: boolean;
  chainCurrencies: TokenItemType[];
  bech32Config?: Bech32Config;
  bip44?: BIP44;
  stakeCurrency?: Currency;
  feeCurrencies?: FeeCurrency[];
  rest?: string;
}

const embedNetworkInfos: ChainInfoCustom[] = [
  {
    rpc: ORAI_RPC,
    rest: ORAI_LCD,
    chainId: ORAICHAIN_ID,
    chainName: ORAICHAIN_ID,
    Icon: OraiIcon,
    isCosmosBased: true,
    stakeCurrency: {
      coinDenom: 'ORAI',
      coinMinimalDenom: 'orai',
      coinDecimals: COSMOS_DECIMALS,
      coinGeckoId: ORAI_COINGECKO_ID,
      coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png'
    },
    walletUrl: 'https://api.wallet.orai.io',
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'orai',
      bech32PrefixAccPub: 'oraipub',
      bech32PrefixValAddr: 'oraivaloper',
      bech32PrefixValPub: 'oraivaloperpub',
      bech32PrefixConsAddr: 'oraivalcons',
      bech32PrefixConsPub: 'oraivalconspub'
    },
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    },
    // UPDATE: move gasPriceStep into feeCurrencies,
    // follow format in: https://docs.keplr.app/api/suggest-chain.html#suggest-chain
    get feeCurrencies() {
      return [
        {
          ...this.stakeCurrency,
          gasPriceStep: {
            low: 0.003,
            average: 0.005,
            high: 0.007
          }
        }
      ];
    },
    walletUrlForStaking: `${ORAI_SCAN}/validators`,
    features: ['stargate', 'ibc-transfer', 'cosmwasm', 'wasmd_0.24+']
  },
  {
    rpc: ORAI_BRIDGE_RPC,
    rest: ORAI_BRIDGE_LCD,
    chainId: ORAI_BRIDGE_CHAIN_ID,
    chainName: ORAI_BRIDGE_ORG,
    isCosmosBased: true,
    stakeCurrency: {
      coinDenom: ORAI_BRIDGE_DENOM,
      coinMinimalDenom: ORAI_BRIDGE_UDENOM,
      coinDecimals: COSMOS_DECIMALS,
      coinGeckoId: ORAI_COINGECKO_ID,
      coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png'
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'oraib',
      bech32PrefixAccPub: 'oraibpub',
      bech32PrefixValAddr: 'oraibvaloper',
      bech32PrefixValPub: 'oraibvaloperpub',
      bech32PrefixConsAddr: 'oraibvalcons',
      bech32PrefixConsPub: 'oraibvalconspub'
    },
    chainCurrencies: [],
    get currencies() {
      return [this.stakeCurrency];
    },
    get feeCurrencies() {
      return [
        {
          ...this.stakeCurrency,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0
          }
        }
      ];
    },
    features: ['stargate', 'ibc-transfer', 'cosmwasm']
  },
  {
    rpc: 'https://tendermint1.kawaii.global',
    rest: 'https://cosmos1.kawaii.global',
    chainId: KWT_SUBNETWORK_CHAIN_ID,
    chainName: KAWAII_ORG,
    Icon: KWTIcon,
    isCosmosBased: false,
    stakeCurrency: {
      coinDenom: 'ORAIE',
      coinMinimalDenom: KWT,
      coinDecimals: EVM_DECIMALS,
      coinGeckoId: 'oraie',
      coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/12313.png'
    },
    bip44: {
      coinType: 60
    },
    bech32Config: {
      bech32PrefixAccAddr: 'oraie',
      bech32PrefixAccPub: 'oraiepub',
      bech32PrefixValAddr: 'oraievaloper',
      bech32PrefixValPub: 'oraievaloperpub',
      bech32PrefixConsAddr: 'oraievalcons',
      bech32PrefixConsPub: 'oraievalconspub'
    },
    chainCurrencies: [],
    get currencies() {
      return [this.stakeCurrency];
    },
    get feeCurrencies() {
      return [
        {
          ...this.stakeCurrency,
          gasPriceStep: {
            low: 0,
            average: 0.000025,
            high: 0.00004
          }
        }
      ];
    },

    features: ['ibc-transfer', 'ibc-go', 'stargate', 'eth-address-gen', 'eth-key-sign']
  },
  {
    rpc: ETHEREUM_RPC,
    chainId: String(ETHEREUM_CHAIN_ID),
    chainName: ETHEREUM_ORG,
    Icon: ETHIcon,
    isCosmosBased: false,
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    }
  },
  {
    rpc: BSC_RPC,
    chainId: String(BSC_CHAIN_ID),
    chainName: BSC_ORG,
    Icon: BNBIcon,
    isCosmosBased: false,
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    }
  },
  {
    // rpc: OSMOSIS_NETWORK_RPC,
    rpc: 'https://rpc.osmosis.interbloc.org',
    chainId: OSMOSIS_CHAIN_ID,
    chainName: OSMOSIS_ORG,
    Icon: OSMO,
    isCosmosBased: true,
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    }
  },
  {
    rpc: COSMOS_NETWORK_RPC,
    chainId: COSMOS_CHAIN_ID,
    chainName: COSMOS_ORG,
    Icon: ATOMCOSMOS,
    isCosmosBased: true,
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    }
  },
  {
    rpc: TRON_RPC,
    chainId: String(TRON_CHAIN_ID),
    chainName: TRON_ORG,
    Icon: TRONIcon,
    isCosmosBased: false,
    chainCurrencies: [],
    get currencies() {
      return this.chainCurrencies;
    }
  }
];

const oraichainTokens: Partial<TokenItemType>[] = [
  {
    name: 'ORAI',
    coinDenom: 'orai',
    coinMinimalDenom: 'orai',
    coinGeckoId: ORAI_COINGECKO_ID,
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png',
    bridgeTo: [BSC_ORG, ETHEREUM_ORG],
    Icon: OraiIcon
  },
  {
    name: 'ATOM',
    coinDenom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM,
    coinMinimalDenom: UATOM_DENOM,
    coinGeckoId: COSMOS_COINGECKO_ID,
    bridgeTo: [COSMOS_ORG],
    Icon: ATOMCOSMOS
  },
  {
    name: 'BEP20 AIRI',
    coinDenom: process.env.REACT_APP_AIRIBSC_ORAICHAIN_DENOM,
    coinMinimalDenom: UAIRI,
    coinGeckoId: AIRIGHT_COINGECKO_ID,
    coinDecimals: EVM_DECIMALS,
    Icon: AIRI
  },
  {
    name: 'AIRI',
    coinGeckoId: AIRIGHT_COINGECKO_ID,
    coinDenom: 'airi',
    coinMinimalDenom: UAIRI,
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11563.png',
    contractAddress: process.env.REACT_APP_AIRI_CONTRACT,
    bridgeTo: [BSC_ORG],
    Icon: AIRI
  },
  {
    name: 'USDT',
    org: ORAICHAIN_ID,
    coinGeckoId: USDT_COINGECKO_ID,
    coinDenom: STABLE_DENOM,
    coinMinimalDenom: 'orai',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    contractAddress: process.env.REACT_APP_USDT_CONTRACT,
    bridgeTo: [BSC_ORG, TRON_ORG],
    Icon: USDT
  },
  {
    name: 'USDC',
    org: ORAICHAIN_ID,
    coinGeckoId: 'usd-coin',
    coinDenom: 'usdc',
    coinMinimalDenom: 'orai',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    contractAddress: process.env.REACT_APP_USDC_CONTRACT,
    bridgeTo: [ETHEREUM_ORG],
    factoryV2: true,
    Icon: USDC
  },
  {
    name: 'OSMO',
    coinDenom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM,
    coinMinimalDenom: UOSMOS_DENOM,
    bridgeTo: [OSMOSIS_ORG],
    coinGeckoId: OSMOSIS_COINGECKO_ID,
    Icon: OSMO
  },
  {
    name: 'BEP20 KWT',
    coinGeckoId: KWT_COINGECKO_ID,
    coinDenom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM,
    coinMinimalDenom: 'oraie',
    coinDecimals: EVM_DECIMALS,
    Icon: KWTIcon
  },
  {
    name: 'KWT',
    coinGeckoId: KWT_COINGECKO_ID,
    coinDenom: 'kwt',
    coinMinimalDenom: 'oraie',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/12313.png',
    contractAddress: process.env.REACT_APP_KWT_CONTRACT,
    bridgeTo: [KAWAII_ORG, BSC_ORG],
    evmDenoms: [process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM],
    Icon: KWTIcon
  },
  {
    name: 'BEP20 MILKY',
    coinGeckoId: MILKY_COINGECKO_ID,
    coinDenom: process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM,
    coinMinimalDenom: 'milky',
    coinDecimals: EVM_DECIMALS,
    Icon: MILKY
  },
  {
    name: 'MILKY',
    coinGeckoId: MILKY_COINGECKO_ID,
    coinDenom: 'milky',
    coinMinimalDenom: 'milky',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14418.png',
    contractAddress: process.env.REACT_APP_MILKY_CONTRACT,
    bridgeTo: [KAWAII_ORG, BSC_ORG],
    evmDenoms: [process.env.REACT_APP_MILKYBSC_ORAICHAIN_DENOM],
    Icon: MILKY
  },
  {
    name: 'ORAIX',
    coinDenom: 'oraix',
    coinMinimalDenom: 'orai',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20487.png',
    contractAddress: process.env.REACT_APP_ORAIX_CONTRACT,
    coinGeckoId: ORAIX_COINGECKO_ID,
    Icon: ORAIX
  },
  {
    name: 'scORAI',
    coinGeckoId: 'scorai',
    coinDenom: 'scorai',
    coinMinimalDenom: 'orai',
    coinImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7533.png',
    contractAddress: process.env.REACT_APP_SCORAI_CONTRACT,
    factoryV2: true,
    Icon: scORAI
  },
  {
    name: 'wTRX',
    coinGeckoId: TRON_COINGECKO_ID,
    coinDenom: TRON_DENOM,
    coinMinimalDenom: 'SUN',
    contractAddress: process.env.REACT_APP_TRX_CONTRACT,
    bridgeTo: [TRON_ORG],
    minAmountSwap: 10,
    factoryV2: true,
    Icon: TRON
  }
];

const oraiBridgeToken: Partial<TokenItemType>[] = [
  {
    name: 'ORAI',
    bridgeNetworkIdentifier: BSC_ORG,
    coinDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + ORAI_BSC_CONTRACT,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: ORAI_COINGECKO_ID,
    Icon: OraiIcon
  },
  {
    name: 'ORAI',
    bridgePrefix: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    coinDenom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + ORAI_ETH_CONTRACT,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: ORAI_COINGECKO_ID,
    Icon: OraiIcon
  },
  {
    name: 'USDC',
    bridgePrefix: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
    bridgeNetworkIdentifier: ETHEREUM_ORG,
    coinDenom: ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX + USDC_ETH_CONTRACT,
    coinDecimals: COSMOS_DECIMALS,
    coinGeckoId: 'usd-coin',
    Icon: USDC
  },
  {
    name: 'AIRI',
    bridgePrefix: ORAI_BRIDGE_PREFIX,
    bridgeNetworkIdentifier: BSC_ORG,
    coinDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: AIRIGHT_COINGECKO_ID,
    Icon: AIRI
  },
  {
    name: 'USDT',
    bridgePrefix: ORAI_BRIDGE_PREFIX,
    bridgeNetworkIdentifier: BSC_ORG,
    coinDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: USDT_COINGECKO_ID,
    Icon: USDT
  },
  {
    name: 'USDT',
    bridgePrefix: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
    bridgeNetworkIdentifier: TRON_ORG,
    coinDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + USDT_TRON_CONTRACT,
    coinDecimals: COSMOS_DECIMALS,
    coinGeckoId: USDT_COINGECKO_ID,
    Icon: USDT
  },
  {
    name: 'wTRX',
    bridgePrefix: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
    bridgeNetworkIdentifier: TRON_ORG,
    coinDenom: ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX + WRAP_TRON_TRX_CONTRACT,
    coinDecimals: COSMOS_DECIMALS,
    coinGeckoId: TRON_COINGECKO_ID,
    Icon: TRON
  },
  {
    name: 'KWT',
    bridgePrefix: ORAI_BRIDGE_PREFIX,
    bridgeNetworkIdentifier: BSC_ORG,
    coinDenom: KWT_DENOM,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: KWT_COINGECKO_ID,
    Icon: KWTIcon
  },
  {
    name: 'MILKY',
    bridgePrefix: ORAI_BRIDGE_PREFIX,
    bridgeNetworkIdentifier: BSC_ORG,
    coinDenom: MILKY_DENOM,
    coinDecimals: EVM_DECIMALS,
    coinGeckoId: MILKY_COINGECKO_ID,
    Icon: MILKY
  }
];

const kwtToken: Partial<TokenItemType>[] = [
  {
    name: 'MILKY',
    coinDenom: process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM,
    coinGeckoId: MILKY_COINGECKO_ID,
    rpc: KAWAII_RPC,
    cosmosBased: true,
    maxGas: 200000 * 2,
    Icon: MILKY
  },
  {
    name: 'ERC20 MILKY',
    coinDenom: 'erc20_milky',
    coinGeckoId: MILKY_COINGECKO_ID,
    contractAddress: MILKY_ERC_CONTRACT,
    rpc: KAWAII_SUBNET_RPC,
    cosmosBased: false,
    maxGas: 200000 * 2,
    Icon: MILKY
  },
  {
    name: 'KWT',
    coinDenom: process.env.REACT_APP_KWT_SUB_NETWORK_DENOM,
    coinGeckoId: KWT_COINGECKO_ID,
    rpc: KAWAII_RPC,
    cosmosBased: true,
    maxGas: 200000 * 2,
    Icon: KWTIcon
  },
  {
    name: 'ERC20 KWT',
    coinDenom: 'erc20_kwt',
    coinGeckoId: KWT_COINGECKO_ID,
    contractAddress: KAWAII_CONTRACT,
    rpc: KAWAII_SUBNET_RPC,
    cosmosBased: false,
    Icon: KWTIcon
  }
];

const tronToken: Partial<TokenItemType>[] = [
  {
    name: 'USDT',
    coinDenom: 'trx20_usdt',
    coinGeckoId: USDT_COINGECKO_ID,
    contractAddress: USDT_TRON_CONTRACT,
    Icon: USDT
  },
  {
    name: 'wTRX',
    coinDenom: 'trx20_trx',
    coinGeckoId: TRON_COINGECKO_ID,
    contractAddress: WRAP_TRON_TRX_CONTRACT,
    Icon: TRON
  }
];

const ethToken: Partial<TokenItemType>[] = [
  {
    name: 'ORAI',
    coinDenom: ERC20_ORAI,
    contractAddress: ORAI_ETH_CONTRACT,
    coinGeckoId: ORAI_COINGECKO_ID,
    Icon: OraiIcon
  },
  {
    name: 'USDC',
    coinDenom: 'erc20_usdc',
    contractAddress: USDC_ETH_CONTRACT,
    coinGeckoId: 'usd-coin',
    Icon: USDC
  }
];

const bscToken: Partial<TokenItemType>[] = [
  {
    name: 'ORAI',
    coinDenom: BEP20_ORAI,
    contractAddress: ORAI_BSC_CONTRACT,
    coinGeckoId: ORAI_COINGECKO_ID,
    Icon: OraiIcon
  },
  {
    name: 'AIRI',
    coinDenom: 'bep20_airi',
    contractAddress: AIRI_BSC_CONTRACT,
    coinGeckoId: AIRIGHT_COINGECKO_ID,
    Icon: AIRI
  },
  {
    name: 'USDT',
    coinDenom: 'bep20_usdt',
    contractAddress: USDT_BSC_CONTRACT,
    coinGeckoId: USDT_COINGECKO_ID,
    Icon: USDT
  },
  {
    name: 'KWT',
    coinDenom: 'bep20_kwt',
    contractAddress: KWT_BSC_CONTRACT,
    coinGeckoId: KWT_COINGECKO_ID,
    Icon: KWTIcon
  },
  {
    name: 'MILKY',
    coinDenom: 'bep20_milky',
    contractAddress: MILKY_BSC_CONTRACT,
    coinGeckoId: MILKY_COINGECKO_ID,
    Icon: MILKY
  }
];

const osmosisToken: Partial<TokenItemType>[] = [
  {
    name: 'OSMO',
    chainId: OSMOSIS_CHAIN_ID,
    org: OSMOSIS_ORG,
    coinDenom: UOSMOS_DENOM,
    coinDecimals: COSMOS_DECIMALS,
    coinGeckoId: OSMOSIS_COINGECKO_ID,
    bridgeTo: [ORAICHAIN_ID],
    cosmosBased: true,
    maxGas: 20000 * 0.025,
    Icon: OSMO
  }
];

const cosmosHubToken: Partial<TokenItemType>[] = [
  {
    name: 'ATOM',
    chainId: COSMOS_CHAIN_ID,
    org: COSMOS_ORG,
    coinGeckoId: COSMOS_COINGECKO_ID,
    coinDenom: UATOM_DENOM,
    coinDecimals: COSMOS_DECIMALS,
    bridgeTo: [ORAICHAIN_ID],
    rpc: 'https://rpc-cosmos.oraidex.io',
    cosmosBased: true,
    maxGas: 20000 * 0.16,
    Icon: ATOMCOSMOS
  }
];

// add token to network
for (const chainInfo of embedNetworkInfos) {
  switch (chainInfo.chainId) {
    case ORAICHAIN_ID:
      const oraiCurrencies = oraichainTokens.map((token, index) => {
        return {
          org: ORAICHAIN_ORG,
          coinDecimals: COSMOS_DECIMALS,
          cosmosBased: true,
          chainId: ORAICHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...oraiCurrencies);
      break;

    case ORAI_BRIDGE_CHAIN_ID:
      const oraiBridgeCurrencies = oraiBridgeToken.map((token) => {
        return {
          org: ORAI_BRIDGE_ORG,
          cosmosBased: true,
          chainId: ORAI_BRIDGE_CHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...oraiBridgeCurrencies);
      break;

    case KWT_SUBNETWORK_CHAIN_ID:
      const kwtCurrencies = kwtToken.map((token) => {
        return {
          org: KAWAII_ORG,
          bridgeTo: [ORAICHAIN_ID, KAWAII_ORG],
          coinDecimals: EVM_DECIMALS,
          chainId: KWT_SUBNETWORK_CHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...kwtCurrencies);
      break;

    case String(BSC_CHAIN_ID):
      const bscCurrencies = bscToken.map((token) => {
        return {
          org: BSC_ORG,
          bridgeTo: [ORAICHAIN_ID],
          coinDecimals: EVM_DECIMALS,
          cosmosBased: false,
          rpc: BSC_RPC,
          chainId: BSC_CHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...bscCurrencies);
      break;

    case String(ETHEREUM_CHAIN_ID):
      const ethCurrencies = ethToken.map((token) => {
        return {
          org: ETHEREUM_ORG,
          bridgeTo: [ORAICHAIN_ID],
          coinDecimals: EVM_DECIMALS,
          cosmosBased: false,
          rpc: ETHEREUM_RPC,
          chainId: ETHEREUM_CHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...ethCurrencies);
      break;

    case String(TRON_CHAIN_ID):
      const tronCurrencies = tronToken.map((token) => {
        return {
          org: TRON_ORG,
          bridgeTo: [ORAICHAIN_ID],
          coinDecimals: COSMOS_DECIMALS,
          cosmosBased: false,
          rpc: TRON_RPC,
          chainId: TRON_CHAIN_ID,
          ...token
        } as TokenItemType;
      });
      chainInfo.chainCurrencies.push(...tronCurrencies);
      break;

    case OSMOSIS_CHAIN_ID:
      chainInfo.chainCurrencies.push(...(osmosisToken as TokenItemType[]));
      break;

    case COSMOS_CHAIN_ID:
      chainInfo.chainCurrencies.push(...(cosmosHubToken as TokenItemType[]));
      break;

    default:
      break;
  }
}

// add type: cw20 to currency to embed Keplr wallet.
embedNetworkInfos.map((network) =>
  network.chainCurrencies.forEach((currency) => {
    if (currency.contractAddress) {
      currency.type = 'cw20';
    }
  })
);

export { embedNetworkInfos };
