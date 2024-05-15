import {
  AXIOS_THROTTLE_THRESHOLD,
  AXIOS_TIMEOUT,
  CW20_DECIMALS,
  TokenItemType,
  COSMOS_CHAIN_ID_COMMON
} from '@oraichain/oraidex-common';
import Axios from 'axios';
import { retryAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import { ICON_WITH_NETWORK, flattenTokensWithIcon } from 'config/chainInfos';
import {
  CosmosState,
  DatabaseEnum,
  EvmChainPrefix,
  EvmState,
  OraiBridgeState,
  OraichainState,
  RoutingQueryItem,
  SubmitTransactionProps
} from 'config/ibc-routing';

const axios = Axios.create({
  timeout: AXIOS_TIMEOUT,
  retryTimes: 3,
  // cache will be enabled by default in 2 seconds
  adapter: retryAdapterEnhancer(
    throttleAdapterEnhancer(Axios.defaults.adapter!, {
      threshold: AXIOS_THROTTLE_THRESHOLD
    })
  ),
  baseURL: process.env.REACT_APP_BASE_IBC_ROUTING_URL
  // baseURL: 'http://localhost:9001'
});

export const submitTransactionIBC = async (data: SubmitTransactionProps) => {
  try {
    const res = await axios.post('/api/routing', data);
    return [res.data, true];
  } catch (error) {
    return [
      {
        message: error?.message || 'Something went wrong',
        data: []
      },
      false
    ];
  }
};

export const getTransactionIBC = async (data: SubmitTransactionProps) => {
  try {
    const res = await axios.get('/api/routing', { params: data });
    return res.data;
  } catch (error) {
    return {
      message: 'Failed',
      data: {}
    };
  }
};

export const getAllTransactionIBC = async (data: { data: SubmitTransactionProps[] }) => {
  try {
    const res = await axios.get('/api/all-routing', { params: data });
    return res.data;
  } catch (error) {
    return {
      message: 'Failed',
      data: {}
    };
  }
};

export const getNextChainId = (data: RoutingQueryItem | null | undefined) => {
  if (!data) {
    return;
  }

  const ChainIdObj = {
    [DatabaseEnum.Evm]: ICON_WITH_NETWORK[(data.data as EvmState).evmChainPrefix]?.chainId,
    [DatabaseEnum.Oraichain]: 'Oraichain',
    [DatabaseEnum.OraiBridge]: 'oraibridge-subnet-2',
    [DatabaseEnum.Cosmos]: (data.data as CosmosState)?.chainId
  };

  return ChainIdObj[data.type];
};

export const getChainName = (data: RoutingQueryItem | null | undefined) => {
  if (!data) {
    return;
  }

  const ChainNameObj = {
    [DatabaseEnum.Evm]: ICON_WITH_NETWORK[(data.data as EvmState).evmChainPrefix]?.chainName,
    [DatabaseEnum.Oraichain]: 'Oraichain',
    [DatabaseEnum.OraiBridge]: 'OBridge',
    [DatabaseEnum.Cosmos]: ICON_WITH_NETWORK[(data.data as CosmosState)?.chainId]?.chainName
  };

  return ChainNameObj[data.type];
};

export const getReceiver = (data: RoutingQueryItem): string => {
  return (
    (data.data as EvmState)?.oraiReceiver ||
    (data.data as OraiBridgeState)?.receiver ||
    (data.data as OraichainState).nextReceiver
  );
};

export const getAmount = (data: RoutingQueryItem): string => {
  switch (data.type) {
    case DatabaseEnum.Evm:
      return (data.data as EvmState)?.amount;
    case DatabaseEnum.Oraichain:
      return (data.data as OraichainState)?.nextAmount || (data.data as OraichainState)?.amount;
    case DatabaseEnum.OraiBridge:
      return (data.data as OraiBridgeState)?.amount;

    default:
      return (data.data as CosmosState)?.amount;
  }
};

export const genTokenOnCurrentStep = (
  token: TokenItemType,
  coinDecimal: number = CW20_DECIMALS,
  chainId: string = 'Oraichain'
) => {
  return flattenTokensWithIcon.find(
    (tk) => tk?.coinGeckoId === token?.coinGeckoId && tk.decimals === coinDecimal && tk.chainId === chainId
  );
};

export const getScanUrl = (data: RoutingQueryItem): string => {
  if (data.type === DatabaseEnum.Evm) {
    const evmChainPrefix = (data.data as EvmState).evmChainPrefix;
    if (evmChainPrefix === EvmChainPrefix.BSC_MAINNET) {
      return `https://bscscan.com/tx/${data.data.txHash}`;
    }
    if (evmChainPrefix === EvmChainPrefix.ETH_MAINNET) {
      return `https://etherscan.io/tx/${data.data.txHash}`;
    }
    if (evmChainPrefix === EvmChainPrefix.TRON_MAINNET) {
      return `https://tronscan.org/#/transaction/${data.data.txHash}`;
    }
  }
  if (data.type === DatabaseEnum.Cosmos) {
    const chainId = (data.data as CosmosState).chainId;
    if (chainId === COSMOS_CHAIN_ID_COMMON.COSMOSHUB_CHAIN_ID) {
      return `https://www.mintscan.io/cosmos/tx/${data.data.txHash}`;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.INJECTVE_CHAIN_ID) {
      return `https://www.mintscan.io/injective/tx/${data.data.txHash}`;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.OSMOSIS_CHAIN_ID) {
      return `https://www.mintscan.io/osmosis/tx/${data.data.txHash}`;
    }
  }
  if (data.type === DatabaseEnum.Oraichain) {
    return `https://scan.orai.io/txs/${data.data.txHash}`;
  }
  return `https://scan.bridge.orai.io/txs/${data.data.txHash}`;
};
