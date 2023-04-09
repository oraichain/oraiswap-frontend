import { MsgTransfer } from './../libs/proto/ibc/applications/transfer/v1/tx';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { coin, Coin } from '@cosmjs/stargate';
import { TokenItemType, tokenMap, tokens } from 'config/bridgeTokens';
import { ORAI, ORAICHAIN_ID, ORAI_INFO, STABLE_DENOM, MILKY_DENOM, KWT_DENOM } from 'config/constants';
import { Contract } from 'config/contracts';
import { network } from 'config/networks';
import { getPair, Pair } from 'config/pools';
import { AssetInfo, PairInfo, SwapOperation, Uint128 } from 'libs/contracts';
import { PoolResponse } from 'libs/contracts/OraiswapPair.types';
import { DistributionInfoResponse } from 'libs/contracts/OraiswapRewarder.types';
import { PoolInfoResponse, RewardInfoResponse, RewardsPerSecResponse } from 'libs/contracts/OraiswapStaking.types';
import { QueryMsg as TokenQueryMsg } from 'libs/contracts/OraiswapToken.types';
import { QueryMsg as StakingQueryMsg } from 'libs/contracts/OraiswapStaking.types';

import { getSubAmountDetails, toAssetInfo, toDecimal, toDisplay, toTokenInfo } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import { TokenInfo } from 'types/token';
import { ibcInfos, ibcInfosOld } from 'config/ibcInfos';
import { RemainingOraibTokenItem } from 'pages/BalanceNew/StuckOraib/useGetOraiBridgeBalances';
import Long from 'long';

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
  const data = token.contractAddress ? await Contract.token(token.contractAddress).tokenInfo() : undefined;
  return toTokenInfo(token, data);
}

/// using multicall when query multiple
async function fetchTokenInfos(tokens: TokenItemType[]): Promise<TokenInfo[]> {
  const filterTokenSwaps = tokens.filter((t) => t.contractAddress);
  const queries = filterTokenSwaps.map((t) => ({
    address: t.contractAddress,
    data: toBinary({
      token_info: {}
    } as TokenQueryMsg)
  }));

  const res = await Contract.multicall.aggregate({
    queries
  });

  let ind = 0;
  return tokens.map((t) => toTokenInfo(t, t.contractAddress ? fromBinary(res.return_data[ind++].data) : undefined));
}

async function fetchAllRewardPerSecInfos(tokens: TokenItemType[]): Promise<RewardsPerSecResponse[]> {
  const queries = tokens.map((token) => {
    return {
      address: process.env.REACT_APP_STAKING_CONTRACT,
      data: toBinary({
        rewards_per_sec: {
          asset_info: toAssetInfo(token)
        }
      } as StakingQueryMsg)
    };
  });
  const res = await Contract.multicall.aggregate({
    queries
  });

  // aggregate no try
  return res.return_data.map((data) => fromBinary(data.data));
}

async function fetchAllTokenAssetPools(tokens: TokenItemType[]): Promise<PoolInfoResponse[]> {
  const queries = tokens.map((token) => {
    return {
      address: process.env.REACT_APP_STAKING_CONTRACT,
      data: toBinary({
        pool_info: {
          asset_info: toAssetInfo(token)
        }
      } as StakingQueryMsg)
    };
  });

  const res = await Contract.multicall.aggregate({
    queries
  });
  // aggregate no try
  return res.return_data.map((data) => fromBinary(data.data));
}

function parsePoolAmount(poolInfo: PoolResponse, trueAsset: AssetInfo): bigint {
  return BigInt(poolInfo.assets.find((asset) => isEqual(asset.info, trueAsset))?.amount || '0');
}

async function getPairAmountInfo(
  fromToken: TokenItemType,
  toToken: TokenItemType,
  cachedPairs?: PairDetails
): Promise<PairAmountInfo> {
  const poolData = await fetchPoolInfoAmount(fromToken, toToken, cachedPairs);

  // default is usdt
  let tokenPrice = 0;

  if (fromToken.coinDenom === ORAI) {
    const poolOraiUsdData = await fetchPoolInfoAmount(tokenMap[ORAI], tokenMap[STABLE_DENOM], cachedPairs);
    // orai price
    tokenPrice = toDecimal(poolOraiUsdData.askPoolAmount, poolOraiUsdData.offerPoolAmount);
  } else {
    // must be stable coin
    tokenPrice = toDecimal(poolData.askPoolAmount, poolData.offerPoolAmount);
  }

  return {
    token1Amount: poolData.offerPoolAmount.toString(),
    token2Amount: poolData.askPoolAmount.toString(),
    tokenUsd: 2 * toDisplay(poolData.offerPoolAmount, fromToken.coinDecimals) * tokenPrice
  };
}

async function fetchPoolInfoAmount(
  fromTokenInfo: TokenItemType,
  toTokenInfo: TokenItemType,
  cachedPairs?: PairDetails
): Promise<PoolInfo> {
  const { info: fromInfo } = parseTokenInfo(fromTokenInfo);
  const { info: toInfo } = parseTokenInfo(toTokenInfo);

  let offerPoolAmount: bigint, askPoolAmount: bigint;

  const pair = getPair(fromTokenInfo.coinDenom, toTokenInfo.coinDenom);

  if (pair) {
    const poolInfo = cachedPairs?.[pair.contract_addr] || (await Contract.pair(pair.contract_addr).pool());
    offerPoolAmount = parsePoolAmount(poolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(poolInfo, toInfo);
  } else {
    // handle multi-swap case
    const fromPairInfo = getPair(fromTokenInfo.coinDenom, ORAI) as Pair;
    const toPairInfo = getPair(ORAI, toTokenInfo.coinDenom) as Pair;
    const fromPoolInfo =
      cachedPairs?.[fromPairInfo.contract_addr] || (await Contract.pair(fromPairInfo.contract_addr).pool());
    const toPoolInfo =
      cachedPairs?.[toPairInfo.contract_addr] || (await Contract.pair(toPairInfo.contract_addr).pool());
    offerPoolAmount = parsePoolAmount(fromPoolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(toPoolInfo, toInfo);
  }

  return { offerPoolAmount, askPoolAmount };
}

async function fetchPairInfo(assetInfos: [TokenItemType, TokenItemType]): Promise<PairInfo> {
  // scorai is in factory_v2
  const factory = assetInfos.some((a) => a.factoryV2) ? Contract.factory_v2 : Contract.factory;
  let { info: firstAsset } = parseTokenInfo(assetInfos[0]);
  let { info: secondAsset } = parseTokenInfo(assetInfos[1]);

  const data = await factory.pair({
    assetInfos: [firstAsset, secondAsset]
  });
  return data;
}

async function fetchTokenAllowance(tokenAddr: string, walletAddr: string, spender: string): Promise<bigint> {
  // hard code with native token
  if (!tokenAddr) return BigInt('999999999999999999999999999999');

  const data = await Contract.token(tokenAddr).allowance({
    owner: walletAddr,
    spender
  });
  return BigInt(data.allowance);
}

async function fetchRewardInfo(stakerAddr: string, assetToken: TokenItemType): Promise<RewardInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.rewardInfo({ assetInfo, stakerAddr });
  return data;
}

async function fetchRewardPerSecInfo(assetToken: TokenItemType): Promise<RewardsPerSecResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.rewardsPerSec({ assetInfo });

  return data;
}

async function fetchStakingPoolInfo(assetToken: TokenItemType): Promise<PoolInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.poolInfo({ assetInfo });

  return data;
}

async function fetchDistributionInfo(assetToken: TokenInfo): Promise<DistributionInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.rewarder.distributionInfo({ assetInfo });

  return data;
}

function generateConvertErc20Cw20Message(amounts: AmountDetails, tokenInfo: TokenItemType, sender: string) {
  let msgConverts: any[] = [];
  if (!tokenInfo.evmDenoms) return [];
  const subAmounts = getSubAmountDetails(amounts, tokenInfo);
  // we convert all mapped tokens to cw20 to unify the token
  for (const denom in subAmounts) {
    const balance = BigInt(subAmounts[denom] ?? '0');
    // reset so we convert using native first
    const erc20TokenInfo = tokenMap[denom];
    if (balance > 0) {
      const msgConvert = generateConvertMsgs({
        type: Type.CONVERT_TOKEN,
        sender,
        inputAmount: balance.toString(),
        inputToken: erc20TokenInfo
      })[0];
      msgConverts.push(msgConvert);
    }
  }
  return msgConverts;
}

function generateConvertCw20Erc20Message(
  amounts: AmountDetails,
  tokenInfo: TokenItemType,
  sender: string,
  sendCoin: Coin
) {
  let msgConverts: any[] = [];
  if (!tokenInfo.evmDenoms) return [];
  // we convert all mapped tokens to cw20 to unify the token
  for (let denom of tokenInfo.evmDenoms) {
    // optimize. Only convert if not enough balance & match denom
    if (denom !== sendCoin.denom) continue;

    // if this wallet already has enough native ibc bridge balance => no need to convert reverse
    if (+amounts[sendCoin.denom] >= +sendCoin.amount) break;

    const balance = amounts[tokenInfo.coinDenom];

    const evmToken = tokenMap[denom];

    if (balance) {
      const outputToken: TokenItemType = {
        ...tokenInfo,
        coinDenom: evmToken.coinDenom,
        contractAddress: undefined,
        coinDecimals: evmToken.coinDecimals
      };
      const msgConvert = generateConvertMsgs({
        type: Type.CONVERT_TOKEN_REVERSE,
        sender,
        inputAmount: balance,
        inputToken: tokenInfo,
        outputToken
      })[0];
      msgConverts.push(msgConvert);
    }
  }
  return msgConverts;
}

const parseTokenInfo = (tokenInfo: TokenItemType, amount?: string | number) => {
  if (!tokenInfo?.contractAddress) {
    if (amount)
      return {
        fund: { denom: tokenInfo.coinDenom, amount: amount.toString() },
        info: { native_token: { denom: tokenInfo.coinDenom } }
      };
    return { info: { native_token: { denom: tokenInfo.coinDenom } } };
  }
  return { info: { token: { contract_addr: tokenInfo?.contractAddress } } };
};

const handleSentFunds = (...funds: (Coin | undefined)[]): Coin[] | null => {
  let sent_funds = [];
  for (let fund of funds) {
    if (fund) sent_funds.push(fund);
  }
  if (sent_funds.length === 0) return null;
  sent_funds.sort((a, b) => a.denom.localeCompare(b.denom));
  return sent_funds;
};

const generateSwapOperationMsgs = (denoms: [string, string], offerInfo: any, askInfo: any): SwapOperation[] => {
  const pair = getPair(denoms);

  return pair
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

async function simulateSwap(query: { fromInfo: TokenInfo; toInfo: TokenInfo; amount: number | string }) {
  const { amount, fromInfo, toInfo } = query;
  // check if they have pairs. If not then we go through ORAI

  const { info: offerInfo } = parseTokenInfo(fromInfo, amount.toString());
  const { info: askInfo } = parseTokenInfo(toInfo);

  const operations = generateSwapOperationMsgs([fromInfo.coinDenom, toInfo.coinDenom], offerInfo, askInfo);
  console.log('operations: ', operations);

  try {
    const data = await Contract.router.simulateSwapOperations({
      offerAmount: amount.toString(),
      operations
    });
    console.log('simulate swap data: ', data);
    return data;
  } catch (error) {
    throw new Error(`Error when trying to simulate swap using router v2: ${error}`);
  }
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
) {
  const { type, sender, ...params } = query;
  let sent_funds;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input;
  switch (type) {
    case Type.SWAP:
      const swapQuery = params as SwapQuery;
      const { fund: offerSentFund, info: offerInfo } = parseTokenInfo(swapQuery.fromInfo, swapQuery.amount.toString());
      const { fund: askSentFund, info: askInfo } = parseTokenInfo(swapQuery.toInfo);
      sent_funds = handleSentFunds(offerSentFund, askSentFund);
      let inputTemp = {
        execute_swap_operations: {
          operations: generateSwapOperationMsgs(
            [swapQuery.fromInfo.coinDenom, swapQuery.toInfo.coinDenom],
            offerInfo,
            askInfo
          ),
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
      sent_funds = handleSentFunds(fromSentFund, toSentFund);
      input = {
        provide_liquidity: {
          assets: [
            {
              info: toInfoData,
              amount: provideQuery.toAmount.toString()
            },
            { info: fromInfoData, amount: provideQuery.fromAmount.toString() }
          ]
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

  const msgs = [
    {
      contract: contractAddr,
      msg: Buffer.from(JSON.stringify(input)),
      sender,
      sent_funds
    }
  ];

  return msgs;
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

async function generateMiningMsgs(msg: BondMining | WithdrawMining | UnbondLiquidity) {
  const { type, sender, ...params } = msg;
  let sent_funds;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input;
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

  const msgs = [
    {
      contract: contractAddr,
      msg: Buffer.from(JSON.stringify(input)),
      sender,
      sent_funds
    }
  ];

  return msgs;
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

function generateConvertMsgs(msg: Convert | ConvertReverse) {
  const { type, sender, inputToken, inputAmount } = msg;
  let sent_funds;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.converter;
  let input;
  switch (type) {
    case Type.CONVERT_TOKEN: {
      // currently only support cw20 token pool
      let { info: assetInfo, fund } = parseTokenInfo(inputToken, inputAmount);
      // native case
      if (assetInfo.native_token) {
        input = {
          convert: {}
        };
        sent_funds = handleSentFunds(fund);
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
      const { outputToken } = msg as ConvertReverse;

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
        sent_funds = handleSentFunds(fund);
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

  const msgs = [
    {
      contract: contractAddr,
      msg: Buffer.from(JSON.stringify(input)),
      sender,
      sent_funds
    }
  ];

  return msgs;
}

export type Claim = {
  type: Type.CLAIM_ORAIX;
  sender: string;
  stage: number;
  amount: string;
  proofs: string[];
};

function generateClaimMsg(msg: Claim) {
  const { type, sender, stage, amount, proofs } = msg;
  let sent_funds;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = process.env.REACT_APP_ORAIX_CLAIM_CONTRACT;
  let input;
  switch (type) {
    case Type.CLAIM_ORAIX:
      input = {
        claim: {
          stage,
          amount: amount.toString(),
          proof: proofs
        }
      };
      break;
    default:
      break;
  }

  return {
    contract: contractAddr,
    msg: Buffer.from(JSON.stringify(input)),
    sender,
    sent_funds
  };
}

// Generate multiple IBC messages in a single transaction to transfer from Oraibridge to Oraichain.
function generateMoveOraib2OraiMessages(
  remainingOraib: RemainingOraibTokenItem[],
  fromAddress: string,
  toAddress: string
) {
  const [, toTokens] = tokens;
  let transferMsgs: MsgTransfer[] = [];
  for (const fromToken of remainingOraib) {
    const toToken = toTokens.find((t) => t.chainId === ORAICHAIN_ID && t.name === fromToken.name);
    let ibcInfo = ibcInfos[fromToken.chainId][toToken.chainId];
    // hardcode for MILKY & KWT because they use the old IBC channel
    if (fromToken.coinDenom === MILKY_DENOM || fromToken.coinDenom === KWT_DENOM)
      ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];

    const tokenAmount = coin(fromToken.amount, fromToken.coinDenom);
    transferMsgs.push({
      sourcePort: ibcInfo.source,
      sourceChannel: ibcInfo.channel,
      token: tokenAmount,
      sender: fromAddress,
      receiver: toAddress,
      memo: '',
      timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + ibcInfo.timeout)
        .multiply(1000000000)
        .toString(),
      timeoutHeight: { revisionNumber: '0', revisionHeight: '0' } // we dont need timeout height. We only use timeout timestamp
    });
  }
  return transferMsgs;
}

export {
  fetchPairInfo,
  fetchTokenInfo,
  fetchTokenInfos,
  generateContractMessages,
  generateClaimMsg,
  simulateSwap,
  fetchPoolInfoAmount,
  fetchTokenAllowance,
  generateMiningMsgs,
  generateConvertMsgs,
  fetchRewardInfo,
  fetchRewardPerSecInfo,
  fetchStakingPoolInfo,
  fetchDistributionInfo,
  getPairAmountInfo,
  getSubAmountDetails,
  generateConvertErc20Cw20Message,
  generateConvertCw20Erc20Message,
  parseTokenInfo,
  fetchAllTokenAssetPools,
  fetchAllRewardPerSecInfos,
  generateMoveOraib2OraiMessages
};
