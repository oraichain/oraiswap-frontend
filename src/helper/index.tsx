import { BSC_SCAN, ETHEREUM_SCAN, HIGH_GAS_PRICE, KWT_SCAN, MULTIPLIER, TRON_SCAN } from 'config/constants';

import { cosmosTokens, EvmDenom, TokenItemType } from 'config/bridgeTokens';
import { network } from 'config/networks';

import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos, CustomChainInfo, NetworkChainId } from 'config/chainInfos';
import { ethers } from 'ethers';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import Long from 'long';

export interface Tokens {
  denom?: string;
  chainId?: NetworkChainId;
  bridgeTo?: Array<NetworkChainId>;
}

export const networks = chainInfos.filter((c) => c.chainId !== 'oraibridge-subnet-2' && c.chainId !== '0x1ae6');

export const filterChainBridge = (token: Tokens, item: CustomChainInfo) => {
  const tokenCanBridgeTo = token.bridgeTo ?? ['Oraichain'];
  return tokenCanBridgeTo.includes(item.chainId);
};

export const getDenomEvm = (): EvmDenom => {
  switch (Number(window.ethereum?.chainId)) {
    case Networks.bsc:
      return 'bep20_orai';
    case Networks.mainnet:
      return 'erc20_orai';
    default:
      return 'kawaii_orai';
  }
};

export const getTransactionUrl = (chainId: NetworkChainId, transactionHash: string) => {
  switch (Number(chainId)) {
    case Networks.bsc:
      return `${BSC_SCAN}/tx/${transactionHash}`;
    case Networks.mainnet:
      return `${ETHEREUM_SCAN}/tx/${transactionHash}`;
    case Networks.tron:
      return `${TRON_SCAN}/#/transaction/${transactionHash.replace(/^0x/, '')}`;
    default:
      // raw string
      switch (chainId) {
        case 'kawaii_6886-1':
          return `${KWT_SCAN}/tx/${transactionHash}`;
        case 'Oraichain':
          return `${network.explorer}/txs/${transactionHash}`
      }
      return null;
  }
};

export const getNetworkGasPrice = async (): Promise<number> => {
  try {
    const chainInfosWithoutEndpoints = await window.Keplr?.getChainInfosWithoutEndpoints();
    const findToken = chainInfosWithoutEndpoints.find((e) => e.chainId == network.chainId);
    if (findToken) {
      return findToken.feeCurrencies[0].gasPriceStep.average;
    }
  } catch (error) {
    console.log({ error })
  }
  return 0;
};

//hardcode fee
export const feeEstimate = (tokenInfo: TokenItemType, gasDefault: number) => {
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

export const handleCheckAddress = async (): Promise<string> => {
  const oraiAddress = await window.Keplr.getKeplrAddr();
  if (!oraiAddress) {
    throw new Error('Please login both metamask and keplr!');
  }
  return oraiAddress;
};

export const handleErrorTransaction = (error: any) => {
  let finalError = '';
  if (typeof error === 'string' || error instanceof String) {
    finalError = error as string;
  } else {
    if (error?.ex?.message)
      finalError = String(error.ex.message);
    else
      finalError = String(error);
  }
  displayToast(TToastType.TX_FAILED, {
    message: finalError
  });
}

/**
 * Constructs the URL to retrieve prices from CoinGecko.
 * @param tokens
 * @returns
 */
export const buildCoinGeckoPricesURL = (tokens: readonly string[]): string =>
  `https://price.market.orai.io/simple/price?ids=${tokens.join('%2C')}&vs_currencies=usd`;

export const fetchPriceMarket = async (cachePrices: CoinGeckoPrices<string>, signal: AbortSignal) => {
  const tokens = [...new Set(cosmosTokens.map((t) => t.coinGeckoId))];
  tokens.sort();
  const coingeckoPricesURL = buildCoinGeckoPricesURL(tokens);
  const prices = { ...cachePrices };

  // by default not return data then use cached version
  try {
    const resp = await fetch(coingeckoPricesURL, { signal });
    const rawData = await resp.text();
    // Check for valid JSON response
    const data = JSON.parse(rawData);
    if (data.error) {
      throw new Error(data.error)
    }
    // update cached
    for (const key in data) {
      prices[key] = data[key].usd;
    }
    return prices;
  } catch (error) {
    console.log({ error });
    const fallbackPrices = Object.keys(cachePrices).length !== 0 ? cachePrices : Object.fromEntries(tokens.map((token) => [token, 0])) as CoinGeckoPrices<string>
    return fallbackPrices;
  }
};
export const calculateTimeoutTimestamp = (timeout: number): string => {
  return Long.fromNumber(Math.floor(Date.now() / 1000) + timeout)
    .multiply(1000000000)
    .toString();
}
