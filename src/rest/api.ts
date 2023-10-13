import { ExecuteInstruction, JsonObject, fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { coin, Coin } from '@cosmjs/stargate';
import { Uint128, MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import {
  OraiswapStakingQueryClient,
  OraiswapRewarderQueryClient,
  OraiswapPairQueryClient,
  OraiswapRouterQueryClient,
  OraiswapFactoryQueryClient,
  OraiswapTokenQueryClient,
  OraiswapPairTypes,
  OraiswapRewarderTypes,
  OraiswapStakingTypes,
  OraiswapTokenTypes,
  OraiswapOracleQueryClient,
  AssetInfo,
  PairInfo
} from '@oraichain/oraidex-contracts-sdk';
import { flattenTokens, oraichainTokens, TokenItemType, tokenMap, tokens } from 'config/bridgeTokens';
import {
  KWT_DENOM,
  MILKY_DENOM,
  ORAI,
  ORAI_INFO,
  STABLE_DENOM,
  proxyContractInfo,
  swapEvmRoutes
} from 'config/constants';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { CoinGeckoId, EvmChainId, NetworkChainId } from 'config/chainInfos';
import { ibcInfos, ibcInfosOld } from 'config/ibcInfos';
import { calculateTimeoutTimestamp, isFactoryV1 } from 'helper';
import { getSubAmountDetails, toAmount, toAssetInfo, toDecimal, toDisplay, toTokenInfo } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import { RemainingOraibTokenItem } from 'pages/Balance/StuckOraib/useGetOraiBridgeBalances';
import { IBCInfo } from 'types/ibc';
import { PairInfoExtend, TokenInfo } from 'types/token';
import { IUniswapV2Router02__factory } from 'types/typechain-types';
import { ethers } from 'ethers';
import { BondLP, MiningLP, UnbondLP } from 'types/pool';
import { TaxRateResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapOracle.types';
import { Long } from 'cosmjs-types/helpers';
import { SimulateResponse } from 'pages/UniversalSwap/helpers';
import { SwapOperation } from '@oraichain/oraidex-contracts-sdk/build/OraiswapRouter.types';

export enum Type {
  'TRANSFER' = 'Transfer',
  'SWAP' = 'Swap',
  'PROVIDE' = 'Provide',
  'WITHDRAW' = 'Withdraw',
  'INCREASE_ALLOWANCE' = 'Increase allowance',
  'BOND_LIQUIDITY' = 'Bond liquidity',
  'WITHDRAW_LIQUIDITY_MINING' = 'Withdraw Liquidity Mining Rewards',
  'UNBOND_LIQUIDITY' = 'Unbond Liquidity Tokens',
  'CONVERT_TOKEN' = 'Convert IBC or CW20 Tokens',
  'CLAIM_ORAIX' = 'Claim ORAIX tokens',
  'CONVERT_TOKEN_REVERSE' = 'Convert reverse IBC or CW20 Tokens'
}

async function fetchTokenInfo(token: TokenItemType): Promise<TokenInfo> {
  let data: OraiswapTokenTypes.TokenInfoResponse;
  if (token.contractAddress) {
    const tokenContract = new OraiswapTokenQueryClient(window.client, token.contractAddress);
    data = await tokenContract.tokenInfo();
  }
  return toTokenInfo(token, data);
}

/// using multicall when query multiple
async function fetchTokenInfos(tokens: TokenItemType[]): Promise<TokenInfo[]> {
  const filterTokenSwaps = tokens.filter((t) => t.contractAddress);
  const queries = filterTokenSwaps.map((t) => ({
    address: t.contractAddress,
    data: toBinary({
      token_info: {}
    } as OraiswapTokenTypes.QueryMsg)
  }));
  const multicall = new MulticallQueryClient(window.client, network.multicall);
  let tokenInfos = tokens.map((t) => toTokenInfo(t));
  try {
    const res = await multicall.tryAggregate({
      queries
    });
    let ind = 0;
    tokenInfos = tokens.map((t) =>
      toTokenInfo(t, t.contractAddress && res.return_data[ind].success ? fromBinary(res.return_data[ind++].data) : t)
    );
  } catch (error) {
    console.log('error fetching token infos: ', error);
  }
  return tokenInfos;
}

async function fetchAllRewardPerSecInfos(
  tokens: TokenItemType[]
): Promise<OraiswapStakingTypes.RewardsPerSecResponse[]> {
  const queries = tokens.map((token) => {
    return {
      address: network.staking,
      data: toBinary({
        rewards_per_sec: {
          asset_info: toAssetInfo(token)
        }
      } as OraiswapStakingTypes.QueryMsg)
    };
  });
  const multicall = new MulticallQueryClient(window.client, network.multicall);
  const res = await multicall.tryAggregate({
    queries
  });
  // aggregate no trybbb
  return res.return_data.map((data) => (data.success ? fromBinary(data.data) : undefined));
}

async function fetchAllTokenAssetPools(tokens: TokenItemType[]): Promise<OraiswapStakingTypes.PoolInfoResponse[]> {
  const queries = tokens.map((token) => {
    return {
      address: network.staking,
      data: toBinary({
        pool_info: {
          asset_info: toAssetInfo(token)
        }
      } as OraiswapStakingTypes.QueryMsg)
    };
  });

  const multicall = new MulticallQueryClient(window.client, network.multicall);
  const res = await multicall.tryAggregate({
    queries
  });

  // aggregate no try
  return res.return_data.map((data) => (data.success ? fromBinary(data.data) : undefined));
}

function parsePoolAmount(poolInfo: OraiswapPairTypes.PoolResponse, trueAsset: AssetInfo): bigint {
  return BigInt(poolInfo.assets.find((asset) => isEqual(asset.info, trueAsset))?.amount || '0');
}

async function getPairAmountInfo(
  fromToken: TokenItemType,
  toToken: TokenItemType,
  cachedPairs?: PairDetails,
  poolInfo?: PoolInfo,
  oraiUsdtPoolInfo?: PoolInfo
): Promise<PairAmountInfo> {
  const poolData = poolInfo ?? (await fetchPoolInfoAmount(fromToken, toToken, cachedPairs));
  // default is usdt
  let tokenPrice = 0;

  if (fromToken.denom === ORAI) {
    const poolOraiUsdData =
      oraiUsdtPoolInfo ?? (await fetchPoolInfoAmount(tokenMap[ORAI], tokenMap[STABLE_DENOM], cachedPairs));
    // orai price
    tokenPrice = toDecimal(poolOraiUsdData.askPoolAmount, poolOraiUsdData.offerPoolAmount);
  } else {
    // must be stable coin for ask pool amount
    const poolUsdData = await fetchPairPriceWithStablecoin(fromToken, toToken);
    tokenPrice = toDisplay(poolUsdData, toToken.decimals);
  }

  return {
    token1Amount: poolData.offerPoolAmount.toString(),
    token2Amount: poolData.askPoolAmount.toString(),
    tokenUsd: 2 * toDisplay(poolData.offerPoolAmount, fromToken.decimals) * tokenPrice
  };
}

// fetch price of a pair using simulate swap with amount = 1 so we know the ratio of the token and USDT
async function fetchPairPriceWithStablecoin(fromTokenInfo: TokenItemType, toTokenInfo: TokenItemType): Promise<string> {
  const result = await Promise.allSettled([
    simulateSwap({
      fromInfo: fromTokenInfo,
      toInfo: tokenMap[STABLE_DENOM],
      amount: toAmount(1, fromTokenInfo!.decimals).toString()
    }),
    simulateSwap({
      fromInfo: toTokenInfo,
      toInfo: tokenMap[STABLE_DENOM],
      amount: toAmount(1, toTokenInfo!.decimals).toString()
    })
  ]).then((results) => {
    for (let res of results) {
      if (res.status === 'fulfilled') return res.value; // only collect the result of the actual existing pool. If both exist then we only need data from one pool
    }
  });
  return result.amount;
}

async function fetchPoolInfoAmount(
  fromTokenInfo: TokenItemType,
  toTokenInfo: TokenItemType,
  cachedPairs?: PairDetails,
  pairInfo?: PairInfo
): Promise<PoolInfo> {
  const { info: fromInfo } = parseTokenInfo(fromTokenInfo);
  const { info: toInfo } = parseTokenInfo(toTokenInfo);

  let offerPoolAmount: bigint, askPoolAmount: bigint;
  let pair: PairInfo;
  try {
    pair = pairInfo ?? (await fetchPairInfo([fromTokenInfo, toTokenInfo]));
  } catch (error) {
    console.log('pair not found when fetching pair info');
  }

  const client = window.client;
  if (pair) {
    const pairContract = new OraiswapPairQueryClient(client, pair.contract_addr);
    const poolInfo = cachedPairs?.[pair.contract_addr] ?? (await pairContract.pool());
    offerPoolAmount = parsePoolAmount(poolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(poolInfo, toInfo);
  } else {
    // handle multi-swap case
    const oraiTokenType = oraichainTokens.find((token) => token.denom === ORAI);
    const [fromPairInfo, toPairInfo] = await Promise.all([
      fetchPairInfo([fromTokenInfo, oraiTokenType]),
      fetchPairInfo([oraiTokenType, toTokenInfo])
    ]);
    const pairContractFrom = new OraiswapPairQueryClient(client, fromPairInfo.contract_addr);
    const pairContractTo = new OraiswapPairQueryClient(client, toPairInfo.contract_addr);
    const fromPoolInfo = cachedPairs?.[fromPairInfo.contract_addr] ?? (await pairContractFrom.pool());
    const toPoolInfo = cachedPairs?.[toPairInfo.contract_addr] ?? (await pairContractTo.pool());
    offerPoolAmount = parsePoolAmount(fromPoolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(toPoolInfo, toInfo);
  }
  return { offerPoolAmount, askPoolAmount };
}

async function fetchCachedPairInfo(
  tokenTypes: [TokenItemType, TokenItemType],
  cachedPairs?: PairInfoExtend[]
): Promise<PairInfo> {
  if (!cachedPairs || cachedPairs.length === 0) return fetchPairInfo(tokenTypes);
  const pair = cachedPairs.find((pair) =>
    pair.asset_infos.find(
      (info) =>
        info.toString() === parseTokenInfo(tokenTypes[0]).info.toString() ||
        info.toString() === parseTokenInfo(tokenTypes[1]).info.toString()
    )
  );
  return pair;
}

async function fetchPairInfo(tokenTypes: [TokenItemType, TokenItemType]): Promise<PairInfo> {
  // scorai is in factory_v2
  const factoryAddr = isFactoryV1([parseTokenInfo(tokenTypes[0]).info, parseTokenInfo(tokenTypes[1]).info])
    ? network.factory
    : network.factory_v2;
  let { info: firstAsset } = parseTokenInfo(tokenTypes[0]);
  let { info: secondAsset } = parseTokenInfo(tokenTypes[1]);
  const factoryContract = new OraiswapFactoryQueryClient(window.client, factoryAddr);
  const data = await factoryContract.pair({
    assetInfos: [firstAsset, secondAsset]
  });
  return data;
}

async function fetchTokenAllowance(tokenAddr: string, walletAddr: string, spender: string): Promise<bigint> {
  // hard code with native token
  if (!tokenAddr) return BigInt('999999999999999999999999999999');
  const tokenContract = new OraiswapTokenQueryClient(window.client, tokenAddr);
  const data = await tokenContract.allowance({
    owner: walletAddr,
    spender
  });
  return BigInt(data.allowance);
}

async function fetchRewardInfo(
  stakerAddr: string,
  assetToken: TokenItemType
): Promise<OraiswapStakingTypes.RewardInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  const data = await stakingContract.rewardInfo({ assetInfo, stakerAddr });
  return data;
}

async function fetchRewardPerSecInfo(assetToken: TokenItemType): Promise<OraiswapStakingTypes.RewardsPerSecResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  const data = await stakingContract.rewardsPerSec({ assetInfo });

  return data;
}

async function fetchStakingPoolInfo(assetToken: TokenItemType): Promise<OraiswapStakingTypes.PoolInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  const data = await stakingContract.poolInfo({ assetInfo });

  return data;
}

async function fetchDistributionInfo(assetToken: TokenInfo): Promise<OraiswapRewarderTypes.DistributionInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const rewarderContract = new OraiswapRewarderQueryClient(window.client, network.rewarder);
  const data = await rewarderContract.distributionInfo({ assetInfo });

  return data;
}

function generateConvertErc20Cw20Message(
  amounts: AmountDetails,
  tokenInfo: TokenItemType,
  sender: string
): ExecuteInstruction[] {
  if (!tokenInfo.evmDenoms) return [];
  const subAmounts = getSubAmountDetails(amounts, tokenInfo);
  // we convert all mapped tokens to cw20 to unify the token
  for (const denom in subAmounts) {
    const balance = BigInt(subAmounts[denom] ?? '0');
    // reset so we convert using native first
    const erc20TokenInfo = tokenMap[denom];
    if (balance > 0) {
      const msgConvert: ExecuteInstruction = generateConvertMsgs({
        type: Type.CONVERT_TOKEN,
        sender,
        inputAmount: balance.toString(),
        inputToken: erc20TokenInfo
      });
      return [msgConvert];
    }
  }
  return [];
}

function generateConvertCw20Erc20Message(
  amounts: AmountDetails,
  tokenInfo: TokenItemType,
  sender: string,
  sendCoin: Coin
): ExecuteInstruction[] {
  if (!tokenInfo.evmDenoms) return [];
  // we convert all mapped tokens to cw20 to unify the token
  for (let denom of tokenInfo.evmDenoms) {
    // optimize. Only convert if not enough balance & match denom
    if (denom !== sendCoin.denom) continue;

    // if this wallet already has enough native ibc bridge balance => no need to convert reverse
    if (+amounts[sendCoin.denom] >= +sendCoin.amount) break;

    const balance = amounts[tokenInfo.denom];

    const evmToken = tokenMap[denom];

    if (balance) {
      const outputToken: TokenItemType = {
        ...tokenInfo,
        denom: evmToken.denom,
        contractAddress: undefined,
        decimals: evmToken.decimals
      };
      const msgConvert = generateConvertMsgs({
        type: Type.CONVERT_TOKEN_REVERSE,
        sender,
        inputAmount: balance,
        inputToken: tokenInfo,
        outputToken
      });
      return [msgConvert];
    }
  }
  return [];
}

function parseTokenInfo(tokenInfo: TokenItemType, amount?: string | number) {
  if (!tokenInfo?.contractAddress) {
    if (amount)
      return {
        fund: { denom: tokenInfo.denom, amount: amount.toString() },
        info: { native_token: { denom: tokenInfo.denom } }
      };
    return { info: { native_token: { denom: tokenInfo.denom } } };
  }
  return { info: { token: { contract_addr: tokenInfo?.contractAddress } } };
}

const parseTokenInfoRawDenom = (tokenInfo: TokenItemType) => {
  if (tokenInfo.contractAddress) return tokenInfo.contractAddress;
  return tokenInfo.denom;
};

const getTokenOnOraichain = (coingeckoId: CoinGeckoId) => {
  if (coingeckoId === 'kawaii-islands' || coingeckoId === 'milky-token') {
    throw new Error('KWT and MILKY not supported in this function');
  }
  return oraichainTokens.find((token) => token.coinGeckoId === coingeckoId);
};

export function getTokenOnSpecificChainId(
  coingeckoId: CoinGeckoId,
  chainId: NetworkChainId
): TokenItemType | undefined {
  return flattenTokens.find((t) => t.coinGeckoId === coingeckoId && t.chainId === chainId);
}

const handleSentFunds = (...funds: (Coin | undefined)[]): Coin[] | null => {
  let sent_funds = [];
  for (let fund of funds) {
    if (fund) sent_funds.push(fund);
  }
  if (sent_funds.length === 0) return null;
  sent_funds.sort((a, b) => a.denom.localeCompare(b.denom));
  return sent_funds;
};

const generateSwapOperationMsgs = (offerInfo: AssetInfo, askInfo: AssetInfo): SwapOperation[] => {
  const pairExist = Pairs.pairs.some((pair) => {
    let assetInfos = pair.asset_infos;
    return (
      (isEqual(assetInfos[0], offerInfo) && isEqual(assetInfos[1], askInfo)) ||
      (isEqual(assetInfos[1], offerInfo) && isEqual(assetInfos[0], askInfo))
    );
  });

  return pairExist
    ? [
        {
          orai_swap: {
            offer_asset_info: offerInfo,
            ask_asset_info: askInfo
          }
        }
      ]
    : [
        {
          orai_swap: {
            offer_asset_info: offerInfo,
            ask_asset_info: ORAI_INFO
          }
        },
        {
          orai_swap: {
            offer_asset_info: ORAI_INFO,
            ask_asset_info: askInfo
          }
        }
      ];
};

async function fetchTaxRate(): Promise<TaxRateResponse> {
  const oracleContract = new OraiswapOracleQueryClient(window.client, network.oracle);
  try {
    const data = await oracleContract.treasury({ tax_rate: {} });
    return data as TaxRateResponse;
  } catch (error) {
    throw new Error(`Error when query TaxRate using oracle: ${error}`);
  }
}

async function simulateSwap(query: { fromInfo: TokenInfo; toInfo: TokenInfo; amount: string }) {
  const { amount, fromInfo, toInfo } = query;

  // check for universal-swap 2 tokens that have same coingeckoId, should return simulate data with average ratio 1-1.
  if (fromInfo.coinGeckoId === toInfo.coinGeckoId) {
    return {
      amount
    };
  }

  // check if they have pairs. If not then we go through ORAI
  const { info: offerInfo } = parseTokenInfo(fromInfo, amount.toString());
  const { info: askInfo } = parseTokenInfo(toInfo);
  const routerContract = new OraiswapRouterQueryClient(window.client, network.router);
  const operations = generateSwapOperationMsgs(offerInfo, askInfo);
  try {
    let finalAmount = amount;
    let isSimulatingRatio = false;
    // hard-code for tron because the WTRX/USDT pool is having a simulation problem (returning zero / error when simulating too small value of WTRX)
    if (fromInfo.coinGeckoId === 'tron' && amount === toAmount(1, fromInfo.decimals).toString()) {
      finalAmount = toAmount(10, fromInfo.decimals).toString();
      isSimulatingRatio = true;
    }
    const data = await routerContract.simulateSwapOperations({
      offerAmount: finalAmount,
      operations
    });
    if (!isSimulatingRatio) return data;
    return { amount: data.amount.substring(0, data.amount.length - 1) };
  } catch (error) {
    throw new Error(`Error when trying to simulate swap using router v2: ${error}`);
  }
}

export function buildSwapRouterKey(fromContractAddr: string, toContractAddr: string) {
  return `${fromContractAddr}-${toContractAddr}`;
}

export function getEvmSwapRoute(
  chainId: string,
  fromContractAddr?: string,
  toContractAddr?: string
): string[] | undefined {
  if (!isEvmNetworkNativeSwapSupported(chainId as EvmChainId)) return undefined;
  if (!fromContractAddr && !toContractAddr) return undefined;
  const chainRoutes = swapEvmRoutes[chainId];
  const fromAddr = fromContractAddr || proxyContractInfo[chainId].wrapNativeAddr;
  const toAddr = toContractAddr || proxyContractInfo[chainId].wrapNativeAddr;

  // in case from / to contract addr is empty aka native eth or bnb without contract addr then we fallback to swap route with wrapped token
  // because uniswap & pancakeswap do not support simulating with native directly
  let route: string[] | undefined = chainRoutes[buildSwapRouterKey(fromAddr, toContractAddr)];
  if (route) return route;
  // because the route can go both ways. Eg: WBNB->AIRI, if we want to swap AIRI->WBNB, then first we find route WBNB->AIRI, then we reverse the route
  route = chainRoutes[buildSwapRouterKey(toAddr, fromContractAddr)];
  if (route) {
    return [].concat(route).reverse();
  }
  return undefined;
}

async function simulateSwapEvm(query: {
  fromInfo: TokenItemType;
  toInfo: TokenItemType;
  amount: string;
}): Promise<SimulateResponse> {
  const { amount, fromInfo, toInfo } = query;

  // check for universal-swap 2 tokens that have same coingeckoId, should return simulate data with average ratio 1-1.
  if (fromInfo.coinGeckoId === toInfo.coinGeckoId) {
    return {
      amount,
      displayAmount: toDisplay(amount, toInfo.decimals)
    };
  }
  try {
    // get proxy contract object so that we can query the corresponding router address
    const provider = new ethers.providers.JsonRpcProvider(fromInfo.rpc);
    const toTokenInfoOnSameChainId = getTokenOnSpecificChainId(toInfo.coinGeckoId, fromInfo.chainId);
    const swapRouterV2 = IUniswapV2Router02__factory.connect(proxyContractInfo[fromInfo.chainId].routerAddr, provider);
    const route = getEvmSwapRoute(fromInfo.chainId, fromInfo.contractAddress, toTokenInfoOnSameChainId.contractAddress);
    const outs = await swapRouterV2.getAmountsOut(amount, route);
    if (outs.length === 0) throw new Error('There is no output amounts after simulating evm swap');
    let simulateAmount = outs.slice(-1)[0].toString();
    return {
      // to display to reset the simulate amount to correct display type (swap simulate from -> same chain id to, so we use same chain id toToken decimals)
      // then toAmount with actual toInfo decimals so that it has the same decimals as other tokens displayed
      amount: simulateAmount,
      displayAmount: toDisplay(simulateAmount, toTokenInfoOnSameChainId.decimals) // get the final out amount, which is the token out amount we want
    };
  } catch (ex) {
    console.log('error simulating evm: ', ex);
  }
}

export function isSupportedNoPoolSwapEvm(coingeckoId: CoinGeckoId) {
  switch (coingeckoId) {
    case 'wbnb':
    case 'weth':
    case 'binancecoin':
    case 'ethereum':
      return true;
    default:
      return false;
  }
}

export function isEvmNetworkNativeSwapSupported(chainId: NetworkChainId) {
  switch (chainId) {
    case '0x01':
    case '0x38':
      return true;
    default:
      return false;
  }
}

export function isEvmSwappable(data: {
  fromChainId: string;
  toChainId: string;
  fromContractAddr?: string;
  toContractAddr?: string;
}): boolean {
  const { fromChainId, fromContractAddr, toChainId, toContractAddr } = data;
  // cant swap if they are not on the same evm chain
  if (fromChainId !== toChainId) return false;
  // cant swap on evm if chain id is not eth or bsc
  if (fromChainId !== '0x01' && fromChainId !== '0x38') return false;
  // if the tokens do not have contract addresses then we skip
  // if (!fromContractAddr || !toContractAddr) return false;
  // only swappable if there's a route to swap from -> to
  if (!getEvmSwapRoute(fromChainId, fromContractAddr, toContractAddr)) return false;
  return true;
}

export type SwapQuery = {
  type: Type.SWAP;
  fromInfo: TokenInfo;
  toInfo: TokenInfo;
  amount: number | string;
  max_spread?: number | string;
  belief_price?: number | string;
  sender: string;
  minimumReceive: Uint128;
};

export type ProvideQuery = {
  type: Type.PROVIDE;
  fromInfo: TokenInfo;
  toInfo: TokenInfo;
  fromAmount: number | string;
  toAmount: number | string;
  slippage?: number | string;
  sender: string;
  pair: string; // oraiswap pair contract addr, handle provide liquidity
};

export type WithdrawQuery = {
  type: Type.WITHDRAW;
  lpAddr: string;
  amount: number | string;
  sender: string;
  pair: string; // oraiswap pair contract addr, handle withdraw liquidity
};

export type TransferQuery = {
  type: Type.TRANSFER;
  amount: number | string;
  sender: string;
  token: string;
  recipientAddress: string;
};

export type IncreaseAllowanceQuery = {
  type: Type.INCREASE_ALLOWANCE;
  amount: number | string;
  sender: string;
  spender: string;
  token: string; //token contract addr
};

function generateContractMessages(
  query: SwapQuery | ProvideQuery | WithdrawQuery | IncreaseAllowanceQuery | TransferQuery
): ExecuteInstruction {
  const { type, sender, ...params } = query;
  let funds: Coin[] | null;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input: any;
  switch (type) {
    case Type.SWAP:
      const swapQuery = params as SwapQuery;
      const { fund: offerSentFund, info: offerInfo } = parseTokenInfo(swapQuery.fromInfo, swapQuery.amount.toString());
      const { fund: askSentFund, info: askInfo } = parseTokenInfo(swapQuery.toInfo);
      funds = handleSentFunds(offerSentFund, askSentFund);
      let inputTemp = {
        execute_swap_operations: {
          operations: generateSwapOperationMsgs(offerInfo, askInfo),
          minimum_receive: swapQuery.minimumReceive
        }
      };
      // if cw20 => has to send through cw20 contract
      if (!swapQuery.fromInfo.contractAddress) {
        input = inputTemp;
      } else {
        input = {
          send: {
            contract: contractAddr,
            amount: swapQuery.amount.toString(),
            msg: toBinary(inputTemp)
          }
        };
        contractAddr = swapQuery.fromInfo.contractAddress;
      }
      break;
    case Type.PROVIDE:
      const provideQuery = params as ProvideQuery;
      const { fund: fromSentFund, info: fromInfoData } = parseTokenInfo(provideQuery.fromInfo, provideQuery.fromAmount);
      const { fund: toSentFund, info: toInfoData } = parseTokenInfo(provideQuery.toInfo, provideQuery.toAmount);
      funds = handleSentFunds(fromSentFund, toSentFund);
      input = {
        provide_liquidity: {
          assets: [
            {
              info: toInfoData,
              amount: provideQuery.toAmount.toString()
            },
            { info: fromInfoData, amount: provideQuery.fromAmount.toString() }
          ],
          slippage_tolerance: provideQuery.slippage
        }
      };
      contractAddr = provideQuery.pair;
      break;
    case Type.WITHDRAW:
      const withdrawQuery = params as WithdrawQuery;

      input = {
        send: {
          // owner: sender,
          contract: withdrawQuery.pair,
          amount: withdrawQuery.amount.toString(),
          msg: 'eyJ3aXRoZHJhd19saXF1aWRpdHkiOnt9fQ==' // withdraw liquidity msg in base64 : {"withdraw_liquidity":{}}
        }
      };
      contractAddr = withdrawQuery.lpAddr;
      break;
    case Type.INCREASE_ALLOWANCE:
      const increaseAllowanceQuery = params as IncreaseAllowanceQuery;
      input = {
        increase_allowance: {
          amount: increaseAllowanceQuery.amount.toString(),
          spender: increaseAllowanceQuery.spender
        }
      };
      contractAddr = increaseAllowanceQuery.token;
      break;
    case Type.TRANSFER:
      const transferQuery = params as TransferQuery;
      input = {
        transfer: {
          recipient: transferQuery.recipientAddress,
          amount: transferQuery.amount
        }
      };
      contractAddr = transferQuery.token;
      break;
    default:
      break;
  }

  const msg: ExecuteInstruction = {
    contractAddress: contractAddr,
    msg: input,
    funds
  };

  return msg;
}

export type BondMining = {
  type: Type.BOND_LIQUIDITY;
  lpToken: string;
  amount: number | string;
  assetToken: TokenInfo;
  sender: string;
};

export type WithdrawMining = {
  type: Type.WITHDRAW_LIQUIDITY_MINING;
  sender: string;
  assetToken: TokenInfo;
};

export type UnbondLiquidity = {
  type: Type.UNBOND_LIQUIDITY;
  sender: string;
  amount: number | string;
  assetToken: TokenInfo;
};

function generateMiningMsgs(data: BondMining | WithdrawMining | UnbondLiquidity): ExecuteInstruction {
  const { type, sender, ...params } = data;
  let funds: Coin[] | null;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input: JsonObject;
  switch (type) {
    case Type.BOND_LIQUIDITY: {
      const bondMsg = params as BondMining;
      // currently only support cw20 token pool
      let { info: asset_info } = parseTokenInfo(bondMsg.assetToken);
      input = {
        send: {
          contract: network.staking,
          amount: bondMsg.amount.toString(),
          msg: toBinary({
            bond: {
              asset_info
            }
          }) // withdraw liquidity msg in base64 : {"withdraw_liquidity":{}}
        }
      };
      contractAddr = bondMsg.lpToken;
      break;
    }
    case Type.WITHDRAW_LIQUIDITY_MINING: {
      const msg = params as WithdrawMining;
      let { info: asset_info } = parseTokenInfo(msg.assetToken);
      input = { withdraw: { asset_info } };
      contractAddr = network.staking;
      break;
    }
    case Type.UNBOND_LIQUIDITY:
      const unbondMsg = params as UnbondLiquidity;
      let { info: unbond_asset } = parseTokenInfo(unbondMsg.assetToken);
      input = {
        unbond: {
          asset_info: unbond_asset,
          amount: unbondMsg.amount.toString()
        }
      };
      contractAddr = network.staking;
      break;
    default:
      break;
  }

  const msg: ExecuteInstruction = {
    contractAddress: contractAddr,
    msg: input,
    funds
  };

  return msg;
}

function generateMiningMsgsV3(data: BondMining | WithdrawMining | UnbondLiquidity): ExecuteInstruction {
  const { type, sender, ...params } = data;
  let funds: Coin[] | null;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input: JsonObject;
  switch (type) {
    case Type.BOND_LIQUIDITY: {
      const bondMsg = params as BondMining;
      // currently only support cw20 token pool
      let { info: asset_info } = parseTokenInfo(bondMsg.assetToken);
      input = {
        send: {
          contract: network.staking,
          amount: bondMsg.amount.toString(),
          msg: toBinary({
            bond: {
              asset_info
            }
          }) // withdraw liquidity msg in base64 : {"withdraw_liquidity":{}}
        }
      };
      contractAddr = bondMsg.lpToken;
      break;
    }
    case Type.WITHDRAW_LIQUIDITY_MINING: {
      const msg = params as WithdrawMining;
      let { info: asset_info } = parseTokenInfo(msg.assetToken);
      input = { withdraw: { asset_info } };
      contractAddr = network.staking;
      break;
    }
    case Type.UNBOND_LIQUIDITY:
      const unbondMsg = params as UnbondLiquidity;
      let { info: unbond_asset } = parseTokenInfo(unbondMsg.assetToken);
      input = {
        unbond: {
          asset_info: unbond_asset,
          amount: unbondMsg.amount.toString()
        }
      };
      contractAddr = network.staking;
      break;
    default:
      break;
  }

  const msg: ExecuteInstruction = {
    contractAddress: contractAddr,
    msg: input,
    funds
  };

  return msg;
}

export type Convert = {
  type: Type.CONVERT_TOKEN;
  sender: string;
  inputToken: TokenItemType;
  inputAmount: string;
};

export type ConvertReverse = {
  type: Type.CONVERT_TOKEN_REVERSE;
  sender: string;
  inputToken: TokenItemType;
  inputAmount: string;
  outputToken: TokenItemType;
};

function generateConvertMsgs(data: Convert | ConvertReverse): ExecuteInstruction {
  const { type, sender, inputToken, inputAmount } = data;
  let funds: Coin[] | null;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.converter;
  let input: any;
  switch (type) {
    case Type.CONVERT_TOKEN: {
      // currently only support cw20 token pool
      let { info: assetInfo, fund } = parseTokenInfo(inputToken, inputAmount);
      // native case
      if (assetInfo.native_token) {
        input = {
          convert: {}
        };
        funds = handleSentFunds(fund);
      } else {
        // cw20 case
        input = {
          send: {
            contract: network.converter,
            amount: inputAmount,
            msg: toBinary({
              convert: {}
            })
          }
        };
        contractAddr = assetInfo.token.contract_addr;
      }
      break;
    }
    case Type.CONVERT_TOKEN_REVERSE: {
      const { outputToken } = data as ConvertReverse;

      // currently only support cw20 token pool
      let { info: assetInfo, fund } = parseTokenInfo(inputToken, inputAmount);
      let { info: outputAssetInfo } = parseTokenInfo(outputToken, '0');
      // native case
      if (assetInfo.native_token) {
        input = {
          convert_reverse: {
            from_asset: outputAssetInfo
          }
        };
        funds = handleSentFunds(fund);
      } else {
        // cw20 case
        input = {
          send: {
            contract: network.converter,
            amount: inputAmount,
            msg: toBinary({
              convert_reverse: {
                from: outputAssetInfo
              }
            })
          }
        };
        contractAddr = assetInfo.token.contract_addr;
      }
      break;
    }
    default:
      break;
  }

  const msg: ExecuteInstruction = {
    contractAddress: contractAddr,
    msg: input,
    funds
  };

  return msg;
}

export type Claim = {
  type: Type.CLAIM_ORAIX;
  sender: string;
  stage: number;
  amount: string;
  proofs: string[];
};

// Generate multiple IBC messages in a single transaction to transfer from Oraibridge to Oraichain.
function generateMoveOraib2OraiMessages(
  remainingOraib: RemainingOraibTokenItem[],
  fromAddress: string,
  toAddress: string
) {
  const [, toTokens] = tokens;
  let transferMsgs: MsgTransfer[] = [];
  for (const fromToken of remainingOraib) {
    const toToken = toTokens.find((t) => t.chainId === 'Oraichain' && t.name === fromToken.name);
    let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
    // hardcode for MILKY & KWT because they use the old IBC channel
    if (fromToken.denom === MILKY_DENOM || fromToken.denom === KWT_DENOM)
      ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];

    const tokenAmount = coin(fromToken.amount, fromToken.denom);
    transferMsgs.push({
      sourcePort: ibcInfo.source,
      sourceChannel: ibcInfo.channel,
      token: tokenAmount,
      sender: fromAddress,
      receiver: toAddress,
      memo: '',
      timeoutTimestamp: Long.fromString(calculateTimeoutTimestamp(ibcInfo.timeout))
    });
  }
  return transferMsgs;
}

export {
  fetchPairInfo,
  fetchCachedPairInfo,
  fetchTokenInfo,
  fetchTokenInfos,
  generateContractMessages,
  simulateSwap,
  fetchPoolInfoAmount,
  fetchTokenAllowance,
  generateMiningMsgs,
  generateConvertMsgs,
  fetchRewardInfo,
  fetchRewardPerSecInfo,
  fetchStakingPoolInfo,
  fetchDistributionInfo,
  fetchTaxRate,
  getPairAmountInfo,
  getSubAmountDetails,
  generateConvertErc20Cw20Message,
  generateConvertCw20Erc20Message,
  parseTokenInfo,
  fetchAllTokenAssetPools,
  fetchAllRewardPerSecInfos,
  generateMoveOraib2OraiMessages,
  parseTokenInfoRawDenom,
  getTokenOnOraichain,
  simulateSwapEvm,
  generateMiningMsgsV3
};
