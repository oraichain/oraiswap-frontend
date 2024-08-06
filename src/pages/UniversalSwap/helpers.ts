import { CwIcs20LatestQueryClient, Uint128 } from '@oraichain/common-contracts-sdk';
import { AssetInfo, Ratio } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';
import {
  CoinGeckoId,
  CoinIcon,
  IBC_WASM_CONTRACT,
  NetworkChainId,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  TokenItemType,
  getTokenOnOraichain,
  getTokenOnSpecificChainId,
  oraichainTokens,
  PairAddress,
  NetworkName,
  ATOM_ORAICHAIN_DENOM,
  OSMOSIS_ORAICHAIN_DENOM,
  USDC_CONTRACT,
  BigDecimal,
  toAmount
} from '@oraichain/oraidex-common';
import {
  UniversalSwapHelper
  // swapFromTokens,
  // swapToTokens
} from '@oraichain/oraidex-universal-swap';
import { isMobile } from '@walletconnect/browser-utils';
import { swapFromTokens, swapToTokens, tokenMap } from 'config/bridgeTokens';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { PAIRS_CHART } from 'config/pools';
import { networks } from 'helper';
import { generateError } from 'libs/utils';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { TIMER } from 'pages/CoHarvest/constants';
import { formatDate, formatTimeWithPeriod } from 'pages/CoHarvest/helpers';
import { endOfMonth, endOfWeek } from 'pages/Pools/helpers';
import { FILTER_TIME_CHART, PairToken } from 'reducer/type';

export enum SwapDirection {
  From,
  To
}

export interface SimulateResponse {
  amount: Uint128;
  displayAmount: number;
}

export interface SwapData {
  metamaskAddress?: string;
  tronAddress?: string;
}

export const TYPE_TAB_HISTORY = {
  ASSETS: 'assets',
  HISTORY: 'history'
};

export interface NetworkFilter {
  label?: string;
  value?: string;
  Icon?: CoinIcon;
  IconLight?: CoinIcon;
}

export const initNetworkFilter = { label: 'All networks', value: '', Icon: undefined, IconLight: undefined };

/**
 * Get transfer token fee when universal swap
 * @param param0
 * @returns
 */
export const getTransferTokenFee = async ({ remoteTokenDenom }): Promise<Ratio | undefined> => {
  try {
    const ibcWasmContractAddress = IBC_WASM_CONTRACT;
    const ibcWasmContract = new CwIcs20LatestQueryClient(window.client, ibcWasmContractAddress);
    const ratio = await ibcWasmContract.getTransferTokenFee({ remoteTokenDenom });
    return ratio;
  } catch (error) {
    console.log({ error });
  }
};

export function filterNonPoolEvmTokens(
  chainId: string,
  coingeckoId: CoinGeckoId,
  denom: string,
  searchTokenName: string,
  direction: SwapDirection // direction = to means we are filtering to tokens
) {
  // basic filter. Dont include itself & only collect tokens with searched letters
  let listTokens = direction === SwapDirection.From ? swapFromTokens : swapToTokens;
  let filteredToTokens = listTokens.filter((token) => token.name.toLowerCase().includes(searchTokenName.toLowerCase()));

  // special case for tokens not having a pool on Oraichain
  if (UniversalSwapHelper.isSupportedNoPoolSwapEvm(coingeckoId)) {
    const swappableTokens = Object.keys(UniversalSwapHelper.swapEvmRoutes[chainId]).map((key) => key.split('-')[1]);
    const filteredTokens = filteredToTokens.filter((token) => swappableTokens.includes(token.contractAddress));

    // tokens that dont have a pool on Oraichain like WETH or WBNB cannot be swapped from a token on Oraichain
    if (direction === SwapDirection.To)
      return [...new Set(filteredTokens.concat(filteredTokens.map((token) => getTokenOnOraichain(token.coinGeckoId))))];
    filteredToTokens = filteredTokens;
  }
  // special case filter. Tokens on networks other than supported evm cannot swap to tokens, so we need to remove them
  if (!UniversalSwapHelper.isEvmNetworkNativeSwapSupported(chainId as NetworkChainId)) {
    return filteredToTokens.filter((t) => {
      // one-directional swap. non-pool tokens of evm network can swap be swapped with tokens on Oraichain, but not vice versa
      const isSupported = UniversalSwapHelper.isSupportedNoPoolSwapEvm(t.coinGeckoId);

      if (direction === SwapDirection.To) return !isSupported;
      if (isSupported) {
        // if we cannot find any matched token then we dont include it in the list since it cannot be swapped
        const sameChainId = getTokenOnSpecificChainId(coingeckoId, t.chainId as NetworkChainId);
        if (!sameChainId) return false;
        return true;
      }
      return true;
    });
  }

  return filteredToTokens.filter((t) => {
    // filter out to tokens that are on a different network & with no pool because we are not ready to support them yet. TODO: support
    if (UniversalSwapHelper.isSupportedNoPoolSwapEvm(t.coinGeckoId)) return t.chainId === chainId;
    return true;
  });
}

export const checkEvmAddress = (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
  switch (chainId) {
    case '0x01':
    case '0x38':
      if (!metamaskAddress) {
        throw generateError('Please login EVM wallet!');
      }
      break;
    case '0x2b6653dc':
      if (!tronAddress) {
        throw generateError('Please login Tron wallet!');
      }
  }
};

export const relayerFeeInfo = {
  [ORAI_BRIDGE_EVM_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX]: 6,
  [ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX]: 6
};

export const AMOUNT_BALANCE_ENTRIES: [number, string, string][] = [
  [0.25, '25%', 'one-quarter'],
  [0.5, '50%', 'half'],
  [0.75, '75%', 'three-quarters'],
  [1, '100%', 'max']
];

export type SwapType = 'Swap' | 'Bridge' | 'Universal Swap';
export const getSwapType = ({
  fromChainId,
  toChainId,
  fromCoingeckoId,
  toCoingeckoId
}: {
  fromChainId: NetworkChainId;
  toChainId: NetworkChainId;
  fromCoingeckoId: CoinGeckoId;
  toCoingeckoId: CoinGeckoId;
}): SwapType => {
  if (fromChainId === 'Oraichain' && toChainId === 'Oraichain') return 'Swap';

  if (fromCoingeckoId === toCoingeckoId) return 'Bridge';

  return 'Universal Swap';
};

export const getExplorerScan = (chainId: NetworkChainId) => {
  switch (chainId) {
    case '0x01':
      return 'https://etherscan.io/tx';
    case '0x38':
      return 'https://bscscan.com/tx';
    case '0x2b6653dc':
      return 'https://tronscan.org/#/transaction';
    case '0x1ae6':
      return 'https://scan.kawaii.global/tx';
    case 'Oraichain':
      return 'https://scan.orai.io/txs';
    case 'osmosis-1':
      return 'https://www.mintscan.io/osmosis/tx';
    case 'cosmoshub-4':
      return 'https://www.mintscan.io/cosmos/tx';
    case 'injective-1':
      return 'https://explorer.injective.network/transaction';
    case 'kawaii_6886-1':
      return 'https://scan.kawaii.global/tx';
    case 'noble-1':
      return 'https://www.mintscan.io/noble/tx';
    default:
      return 'https://scan.orai.io/txs';
  }
};

// generate TradingView pair base on from & to token in universal-swap
export const generateNewSymbolV2 = (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  currentPair: PairToken
): PairToken | null => {
  let newTVPair: PairToken = { ...currentPair };

  const findedPair = PAIRS_CHART.find((p) => p.symbol.includes(fromToken.name) && p.symbol.includes(toToken.name));

  if (!findedPair) {
    // this case when user click button reverse swap flow  of pair NOT in pool.
    // return null to prevent re-call api of this pair.
    if (currentPair.symbol.split('/').includes(fromToken.name) && currentPair.symbol.split('/').includes(toToken.name))
      return null;
    newTVPair.symbol = `${fromToken.name}/${toToken.name}`;
    newTVPair.info = '';
  } else {
    // this case when user click button reverse swap flow of pair in pool.
    // return null to prevent re-call api of this pair.
    if (findedPair.symbol === currentPair.symbol) return null;
    newTVPair.symbol = findedPair.symbol;
    newTVPair.info = findedPair.info;
  }

  return newTVPair;
};

export const calculateFinalPriceChange = (
  isPairReverseSymbol: boolean,
  currentPrice: number,
  percentPriceChange: number
) => {
  if (!isPairReverseSymbol) return percentPriceChange;

  if (currentPrice === 0) return 0;
  return (currentPrice / (1 + percentPriceChange) - currentPrice) / currentPrice;
};

// generate chain base on to token in universal-swap
export const genCurrentChain = ({
  toToken,
  currentToChain
}: {
  toToken: TokenItemType;
  currentToChain: NetworkName | '';
}): NetworkName | '' => {
  let newCurrentToChain: NetworkName | '' = currentToChain;

  newCurrentToChain = networks?.find((chain) => chain.chainId === toToken.chainId)?.chainName || '';

  return newCurrentToChain;
};

export const formatTimeDataChart = (
  time: number | string,
  type: FILTER_TIME_CHART,
  lastDate: number,
  currentText: string = 'Now'
) => {
  if (!time) {
    return currentText;
  }

  const fmtTime = typeof time === 'string' ? new Date(time).getTime() : time * TIMER.MILLISECOND;
  return time === lastDate ? currentText : `${formatDate(fmtTime)} ${formatTimeWithPeriod(fmtTime)}`;
};

export const getTokenIcon = (token: TokenItemType, theme: string) => {
  let tokenIcon;
  const tokenInfo = oraichainTokensWithIcon.find((e) => e.coinGeckoId === token?.coinGeckoId);

  if (tokenInfo && Object.keys(tokenInfo.IconLight || tokenInfo.Icon || {}).length > 0) {
    tokenIcon = theme === 'light' ? tokenInfo?.IconLight || tokenInfo?.Icon : tokenInfo?.Icon;
  }
  return tokenIcon;
};

export const refreshBalances = async (
  loadingRefresh,
  setLoadingRefresh,
  { metamaskAddress, tronAddress, oraiAddress },
  callback
) => {
  try {
    if (loadingRefresh) return;
    setLoadingRefresh(true);
    await callback({ metamaskAddress, tronAddress, oraiAddress });
  } catch (err) {
    console.log({ err });
  } finally {
    setTimeout(() => {
      setLoadingRefresh(false);
    }, 2000);
  }
};

export const getFromToToken = (originalFromToken, originalToToken, fromTokenDenomSwap, toTokenDenomSwap) => {
  const isEvmSwap = UniversalSwapHelper.isEvmSwappable({
    fromChainId: originalFromToken?.chainId,
    toChainId: originalToToken?.chainId,
    fromContractAddr: originalFromToken?.contractAddress,
    toContractAddr: originalToToken?.contractAddress
  });
  const fromToken = isEvmSwap
    ? tokenMap[fromTokenDenomSwap]
    : getTokenOnOraichain(tokenMap[fromTokenDenomSwap].coinGeckoId) ?? tokenMap[fromTokenDenomSwap];
  const toToken = isEvmSwap
    ? tokenMap[toTokenDenomSwap]
    : getTokenOnOraichain(tokenMap[toTokenDenomSwap].coinGeckoId) ?? tokenMap[toTokenDenomSwap];

  return { fromToken, toToken };
};

export const getRemoteDenom = (originalToken) => {
  return originalToken.contractAddress ? originalToken.prefix + originalToken.contractAddress : originalToken.denom;
};

export const getTokenBalance = (originalToken, amounts, subAmount) => {
  return originalToken ? BigInt(amounts[originalToken.denom] ?? '0') + subAmount : BigInt(0);
};

export const getDisableSwap = ({
  originalToToken,
  walletByNetworks,
  swapLoading,
  fromAmountToken,
  toAmountToken,
  fromAmountTokenBalance,
  fromTokenBalance,
  addressTransfer,
  validAddress,
  simulateData,
  isLoadingSimulate
}) => {
  const mobileMode = isMobile();
  const canSwapToCosmos = !mobileMode && originalToToken.cosmosBased && !walletByNetworks.cosmos;
  const canSwapToEvm = !mobileMode && !originalToToken.cosmosBased && !walletByNetworks.evm;
  const canSwapToTron = !mobileMode && originalToToken.chainId === '0x2b6653dc' && !walletByNetworks.tron;
  const canSwapTo = canSwapToCosmos || canSwapToEvm || canSwapToTron;
  const disabledSwapBtn =
    swapLoading ||
    !fromAmountToken ||
    !toAmountToken ||
    fromAmountTokenBalance > fromTokenBalance || // insufficent fund
    !addressTransfer ||
    !validAddress.isValid ||
    isLoadingSimulate ||
    canSwapTo;

  let disableMsg: string;
  if (!validAddress.isValid) disableMsg = `Recipient address not found`;
  if (!addressTransfer) disableMsg = `Recipient address not found`;
  if (canSwapToCosmos) disableMsg = `Please connect cosmos wallet`;
  if (canSwapToEvm) disableMsg = `Please connect evm wallet`;
  if (canSwapToTron) disableMsg = `Please connect tron wallet`;
  if (!simulateData || simulateData.displayAmount <= 0) disableMsg = 'Enter an amount';
  if (fromAmountTokenBalance > fromTokenBalance) disableMsg = `Insufficient funds`;
  if (isLoadingSimulate) disableMsg = `Swap`;
  return { disabledSwapBtn, disableMsg };
};

// smart router osmosis
export const isAllowAlphaSmartRouter = (fromToken, toToken) => {
  const notAllowChainId = ['Neutaro-1'];
  if (notAllowChainId.includes(fromToken.chainId) || notAllowChainId.includes(toToken.chainId)) return false;
  if (isAllowIBCWasm(fromToken, toToken)) return true;
  // Case FromToken is Cosmos -> ToToken is Cosmos
  if (fromToken.cosmosBased && toToken.cosmosBased) return true;
  return false;
};

export const isAllowIBCWasm = (fromToken, toToken) => {
  // Case FromToken is Evm -> ToToken is Cosmos
  if (!fromToken.cosmosBased && toToken.cosmosBased) return true;
  return false;
};

export const getAverageRatio = (simulateData, averageSimulateData, fromAmountToken, originalFromToken) => {
  let averageRatio = undefined;
  if (simulateData && fromAmountToken) {
    const displayAmount = new BigDecimal(simulateData.displayAmount).div(fromAmountToken).toNumber();
    averageRatio = {
      amount: toAmount(displayAmount ? displayAmount : averageSimulateData?.displayAmount, originalFromToken.decimals),
      displayAmount: displayAmount ? displayAmount : averageSimulateData?.displayAmount ?? 0
    };
  }
  return { averageRatio };
};

export const findKeyByValue = (obj, value: string) => Object.keys(obj).find((key) => obj[key] === value);

const findTokenInfo = (token: string, flattenTokens: TokenItemType[]): TokenItemType =>
  flattenTokens.find(
    (t) => t.contractAddress?.toUpperCase() === token?.toUpperCase() || t.denom.toUpperCase() === token?.toUpperCase()
  );

const findBaseToken = (coinGeckoId: string, flattenTokensWithIcon: TokenItemType[], isLightMode: boolean): string => {
  const baseToken = flattenTokensWithIcon.find((token) => token.coinGeckoId === coinGeckoId);
  return baseToken ? (isLightMode ? baseToken.IconLight : baseToken.Icon) : DefaultIcon;
};

export const transformSwapInfo = (data) => {
  const transformedData = JSON.parse(JSON.stringify(data));
  transformedData.swapInfo = transformedData.swapInfo.map((swap, index) => {
    if (index === 0) {
      swap.tokenIn = data.tokenIn;
    } else {
      swap.tokenIn = transformedData.swapInfo[index - 1].tokenOut;
    }
    return swap;
  });

  return transformedData;
};

export const processPairInfo = (actionSwap, flattenTokens, flattenTokensWithIcon, isLightMode) => {
  let [TokenInIcon, TokenOutIcon]: any = [DefaultIcon, DefaultIcon];
  const infoPair = PAIRS_CHART.find(
    (pair) => pair.assets.includes(actionSwap.tokenIn) && pair.assets.includes(actionSwap.tokenOut)
  );
  const findIndexIn = infoPair.assets.findIndex((fdex) => fdex === actionSwap.tokenOut);
  const TokenInIconPair = findBaseToken(
    findTokenInfo(actionSwap.tokenIn, flattenTokens)?.coinGeckoId,
    flattenTokensWithIcon,
    isLightMode
  );
  const TokenOutIconPair = findBaseToken(
    findTokenInfo(actionSwap.tokenOut, flattenTokens)?.coinGeckoId,
    flattenTokensWithIcon,
    isLightMode
  );

  if (TokenInIconPair) TokenInIcon = TokenInIconPair;

  if (TokenOutIconPair) TokenOutIcon = TokenOutIconPair;

  const info = {
    ...infoPair,
    tokenIn: infoPair.symbols[findIndexIn],
    tokenOut: infoPair.symbols[findIndexIn ? 0 : 1]
  };
  return { info, TokenInIcon, TokenOutIcon };
};

export const getTokenInfo = (action, path, flattenTokens, assetList) => {
  let info;
  let [TokenInIcon, TokenOutIcon] = [DefaultIcon, DefaultIcon];

  const tokenInAction = action.tokenIn;
  const tokenOutAction = action.tokenOut;

  const tokenInChainId = path.chainId;
  const tokenOutChainId = path.tokenOutChainId;

  const findToken = (token, tokens) =>
    tokens.find(
      (flat) =>
        flat.denom?.toLowerCase() === token.toLowerCase() || flat.contractAddress?.toLowerCase() === token.toLowerCase()
    );
  const findTokenInfo = (tokenBase, assets) => assets?.assets.find((asset) => asset.base === tokenBase) ?? {};

  if (action.type === 'Swap') {
    let tokenInInfo, tokenOutInfo;

    if (tokenInChainId === 'Oraichain') {
      tokenInInfo = findToken(tokenInAction, flattenTokens);
      tokenOutInfo = findToken(tokenOutAction, flattenTokens);

      if (tokenInInfo?.Icon) {
        TokenInIcon = tokenInInfo.Icon;
      }
      if (tokenOutInfo?.Icon) {
        TokenOutIcon = tokenOutInfo.Icon;
      }
      info = {
        tokenIn: tokenInInfo?.name,
        tokenOut: tokenOutInfo?.name
      };
    } else {
      tokenInInfo = findTokenInfo(tokenInAction, assetList);
      tokenOutInfo = findTokenInfo(tokenOutAction, assetList);

      info = {
        tokenInInfo,
        tokenOutInfo,
        tokenIn: tokenInInfo.symbol,
        tokenOut: tokenOutInfo.symbol
      };
    }
  }

  if (action.type === 'Bridge') {
    const getTokenInfoBridge = (token, tokens, chainId) => {
      if (chainId === 'Oraichain') return findToken(token, tokens);
      return findTokenInfo(token, assetList);
    };

    const tokenInInfo = getTokenInfoBridge(tokenInAction, flattenTokens, tokenInChainId);
    const tokenOutInfo = getTokenInfoBridge(tokenOutAction, flattenTokens, tokenOutChainId);
    console.log({ tokenInAction, tokenInChainId, tokenInInfo, tokenOutInfo });

    info = {
      tokenIn: tokenInChainId === 'Oraichain' ? tokenInInfo?.name : tokenInInfo.symbol,
      tokenOut: tokenOutChainId === 'Oraichain' ? tokenOutInfo?.name : tokenOutInfo.symbol,
      tokenInInfo,
      tokenOutInfo
    };

    if (tokenInChainId === 'Oraichain') {
      TokenInIcon = tokenInInfo.Icon;
    }

    if (tokenOutChainId === 'Oraichain') {
      TokenOutIcon = tokenOutInfo.Icon;
    }
  }

  return { info, TokenInIcon, TokenOutIcon };
};

export const getPathInfo = (path, chainIcons, assets) => {
  let [NetworkFromIcon, NetworkToIcon] = [DefaultIcon, DefaultIcon];

  const pathChainId = path.chainId.split('-')[0].toLowerCase();
  const pathTokenOut = path.tokenOutChainId.split('-')[0].toLowerCase();

  if (path.chainId) {
    const chainFrom = chainIcons.find((cosmos) => cosmos.chainId === path.chainId);
    NetworkFromIcon = chainFrom ? chainFrom.Icon : DefaultIcon;
  }

  if (path.tokenOutChainId) {
    const chainTo = chainIcons.find((cosmos) => cosmos.chainId === path.tokenOutChainId);
    NetworkToIcon = chainTo ? chainTo.Icon : DefaultIcon;
  }

  const getAssetsByChainName = (chainName) => assets.find(({ chain_name }) => chain_name === chainName)?.assets || [];

  const assetList = {
    assets: [...getAssetsByChainName(pathChainId), ...getAssetsByChainName(pathTokenOut)]
  };

  return { NetworkFromIcon, NetworkToIcon, assetList, pathChainId };
};
