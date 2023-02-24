import { network } from 'config/networks';
import { TokenItemType } from 'config/bridgeTokens';
import { AllPoolAprResponse } from 'types/oraiswap_pair/pool_response';
import _ from 'lodash';
import { ORAI, ORAI_LCD, ORAI_NETWORK_LCD } from 'config/constants';
import { getPair, Pair } from 'config/pools';
import axios from './request';
import { TokenInfo } from 'types/token';
import {
  parseAmountFromWithDecimal,
  parseAmountToWithDecimal
} from 'libs/utils';
import Big from 'big.js';
import { Contract } from 'config/contracts';
import { PairInfo, SwapOperation } from 'libs/contracts';
import { PoolResponse } from 'libs/contracts/OraiswapPair.types';
import {
  PoolInfoResponse,
  RewardInfoResponse,
  RewardsPerSecResponse
} from 'libs/contracts/OraiswapStaking.types';
import { DistributionInfoResponse } from 'libs/contracts/OraiswapRewarder.types';

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

const oraiInfo = { native_token: { denom: ORAI } };

const toQueryMsg = (msg: string) => {
  try {
    return Buffer.from(JSON.stringify(JSON.parse(msg))).toString('base64');
  } catch (error) {
    return '';
  }
};

const querySmart = async (
  contract: string,
  msg: string | object,
  lcd?: string
) => {
  const params =
    typeof msg === 'string'
      ? toQueryMsg(msg)
      : Buffer.from(JSON.stringify(msg)).toString('base64');
  const url = `${
    lcd ?? network.lcd
  }/cosmwasm/wasm/v1/contract/${contract}/smart/${params}`;

  const res = (await axios.get(url)).data;
  if (res.code) throw new Error(res.message);
  return res.data;
};

async function fetchTokenInfo(tokenSwap: TokenItemType): Promise<TokenInfo> {
  let tokenInfo: TokenInfo = {
    ...tokenSwap,
    symbol: '',
    name: tokenSwap.name,
    contractAddress: tokenSwap.contractAddress,
    decimals: tokenSwap.decimals,
    icon: '',
    denom: tokenSwap.denom,
    verified: false,
    total_supply: ''
  };
  if (!tokenSwap.contractAddress) {
    tokenInfo.symbol = tokenSwap.name;
    tokenInfo.verified = true;
  } else {
    const data = await querySmart(tokenSwap.contractAddress, {
      token_info: {}
    });

    tokenInfo = {
      ...tokenInfo,
      symbol: data.symbol,
      name: data.name,
      contractAddress: tokenSwap.contractAddress,
      decimals: data.decimals,
      icon: data.icon,
      verified: data.verified,
      total_supply: data.total_supply
    };
  }
  return tokenInfo;
}

async function fetchAllPoolApr(): Promise<AllPoolAprResponse> {
  const { data } = await axios.get(
    `${process.env.REACT_APP_ORAIX_CLAIM_URL}/apr/all`
  );
  return data.data;
}

async function fetchPoolApr(contract_addr: string): Promise<number> {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_ORAIX_CLAIM_URL}/apr?contract_addr=${contract_addr}`
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

function parsePoolAmount(poolInfo: PoolResponse, trueAsset: any) {
  return parseInt(
    poolInfo.assets.find((asset) => _.isEqual(asset.info, trueAsset))?.amount ||
      '0'
  );
}

async function fetchPoolInfoAmount(
  fromTokenInfo: TokenItemType,
  toTokenInfo: TokenItemType
): Promise<PoolInfo> {
  const { info: fromInfo } = parseTokenInfo(fromTokenInfo);
  const { info: toInfo } = parseTokenInfo(toTokenInfo);

  let offerPoolAmount = 0,
    askPoolAmount = 0;

  const pair = getPair(fromTokenInfo.denom, toTokenInfo.denom);

  if (pair) {
    const poolInfo = await Contract.pair(pair.contract_addr).pool();
    offerPoolAmount = parsePoolAmount(poolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(poolInfo, toInfo);
  } else {
    // handle multi-swap case
    const fromPairInfo = getPair(fromTokenInfo.denom, ORAI) as Pair;
    const toPairInfo = getPair(ORAI, toTokenInfo.denom) as Pair;
    const fromPoolInfo = await Contract.pair(fromPairInfo.contract_addr).pool();
    const toPoolInfo = await Contract.pair(toPairInfo.contract_addr).pool();
    offerPoolAmount = parsePoolAmount(fromPoolInfo, fromInfo);
    askPoolAmount = parsePoolAmount(toPoolInfo, toInfo);
  }

  return { offerPoolAmount, askPoolAmount };
}

async function fetchPairInfo(
  assetInfos: [TokenItemType, TokenItemType]
): Promise<PairInfo> {
  let { info: firstAsset } = parseTokenInfo(assetInfos[0]);
  let { info: secondAsset } = parseTokenInfo(assetInfos[1]);

  try {
    const data = await Contract.factory.pair({
      assetInfos: [firstAsset, secondAsset]
    });
    return data;
  } catch (error) {
    return fetchPairInfoV2(assetInfos);
  }
}

async function fetchPairInfoV2(
  assetInfos: [TokenItemType, TokenItemType]
): Promise<PairInfo> {
  let { info: firstAsset } = parseTokenInfo(assetInfos[0]);
  let { info: secondAsset } = parseTokenInfo(assetInfos[1]);

  const data = await Contract.factory_v2.pair({
    assetInfos: [firstAsset, secondAsset]
  });
  return data;
}

async function fetchTokenBalance(
  tokenAddr: string,
  walletAddr: string,
  shouldKeepOriginal?: boolean
): Promise<number | string> {
  const data = await Contract.token(tokenAddr).balance({ address: walletAddr });
  if (shouldKeepOriginal) return data.balance;
  return parseInt(data.balance || '0');
}

async function fetchTokenAllowance(
  tokenAddr: string,
  walletAddr: string,
  spender: string
) {
  // hard code with token orai
  // if (!tokenAddr) return '999999999999999999999999999999';
  const data = await Contract.token(tokenAddr).allowance({
    owner: walletAddr,
    spender
  });
  return data.allowance;
}

async function fetchRewardInfo(
  stakerAddr: string,
  assetToken: TokenItemType
): Promise<RewardInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.rewardInfo({ assetInfo, stakerAddr });
  return data;
}

async function fetchRewardPerSecInfo(
  assetToken: TokenItemType
): Promise<RewardsPerSecResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.rewardsPerSec({ assetInfo });

  return data;
}

async function fetchStakingPoolInfo(
  assetToken: TokenItemType
): Promise<PoolInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.staking.poolInfo({ assetInfo });

  return data;
}

async function fetchDistributionInfo(
  assetToken: TokenInfo
): Promise<DistributionInfoResponse> {
  const { info: assetInfo } = parseTokenInfo(assetToken);
  const data = await Contract.rewarder.distributionInfo({ assetInfo });

  return data;
}

async function fetchNativeTokenBalance(
  walletAddr: string,
  denom: string = ORAI,
  lcd?: string,
  shouldKeepOriginal?: boolean
): Promise<number | string> {
  const url = `${
    lcd ?? network.lcd
  }/cosmos/bank/v1beta1/balances/${walletAddr}/by_denom?denom=${denom}`;
  const res: any = (await axios.get(url)).data;
  const amount = res.balance.amount;
  if (shouldKeepOriginal) return amount;
  return parseInt(amount || '0');
}

async function fetchBalance(
  walletAddr: string,
  denom: string,
  tokenAddr?: string,
  lcd?: string
): Promise<number> {
  if (!tokenAddr)
    return (await fetchNativeTokenBalance(walletAddr, denom, lcd)) as number;
  else return (await fetchTokenBalance(tokenAddr, walletAddr)) as number;
}

async function fetchBalanceWithMapping(
  walletAddr: string,
  tokenInfo: TokenItemType
): Promise<{ amount: number; subAmounts: { [key: string]: number } }> {
  let finalBalance = 0;
  // get all native balances that are from oraibridge (ibc/...)
  let subAmounts = {},
    mainBalance = 0;
  for (let mapping of tokenInfo.erc20Cw20Map) {
    const balance = await fetchBalance(walletAddr, mapping.erc20Denom);
    // need to parse amount from old decimal to new because incrementing balance with different decimal will lead to wrong result
    const parsedBalance = parseAmountToWithDecimal(
      parseAmountFromWithDecimal(
        balance,
        mapping.decimals.erc20Decimals
      ).toNumber(),
      mapping.decimals.cw20Decimals
    ).toNumber();
    subAmounts[`${mapping.prefix} ${tokenInfo.name}`] = parsedBalance;
    finalBalance += parsedBalance;
  }
  // fetch original balance (can be cw20 or native like ORAI). No need to parse since these will have decimal = 6 automatically
  if (!tokenInfo.contractAddress)
    mainBalance = await fetchBalance(walletAddr, tokenInfo.denom);
  else
    mainBalance = await fetchBalance(
      walletAddr,
      tokenInfo.denom,
      tokenInfo.contractAddress
    );
  finalBalance += mainBalance;
  subAmounts[`${tokenInfo.name}`] = mainBalance;

  return { amount: finalBalance, subAmounts };
}

async function generateConvertErc20Cw20Message(
  tokenInfo: TokenItemType,
  sender: string
) {
  let msgConverts: any[] = [];
  if (!tokenInfo.erc20Cw20Map) return [];
  // we convert all mapped tokens to cw20 to unify the token
  for (let mapping of tokenInfo.erc20Cw20Map) {
    const balance = new Big(
      await fetchNativeTokenBalance(sender, mapping.erc20Denom, null, true)
    ).toFixed(0);
    // reset so we convert using native first
    tokenInfo.contractAddress = undefined;
    tokenInfo.denom = mapping.erc20Denom;
    if (balance > '0') {
      const msgConvert = (
        await generateConvertMsgs({
          type: Type.CONVERT_TOKEN,
          sender,
          inputAmount: balance,
          inputToken: tokenInfo
        })
      )[0];
      msgConverts.push(msgConvert);
    }
  }
  return msgConverts;
}

async function generateConvertCw20Erc20Message(
  tokenInfo: TokenItemType,
  sender: string,
  sendCoin: Coin
) {
  let msgConverts: any[] = [];
  if (!tokenInfo.erc20Cw20Map) return [];
  // we convert all mapped tokens to cw20 to unify the token
  for (let mapping of tokenInfo.erc20Cw20Map) {
    let balance: string;
    // optimize. Only convert if not enough balance & match denom
    if (mapping.erc20Denom !== sendCoin.denom) continue;
    balance = new Big(
      await fetchNativeTokenBalance(sender, sendCoin.denom, null, true)
    ).toFixed(0);
    // if this wallet already has enough native ibc bridge balance => no need to convert reverse
    if (+balance >= +sendCoin.amount) break;

    if (!tokenInfo.contractAddress)
      balance = new Big(
        await fetchNativeTokenBalance(sender, tokenInfo.denom, null, true)
      ).toFixed(0);
    else
      balance = new Big(
        await fetchTokenBalance(tokenInfo.contractAddress, sender, true)
      ).toFixed(0);
    if (+balance > 0) {
      const outputToken: TokenItemType = {
        ...tokenInfo,
        denom: mapping.erc20Denom,
        contractAddress: undefined,
        decimals: mapping.decimals.erc20Decimals
      };
      const msgConvert = (
        await generateConvertMsgs({
          type: Type.CONVERT_TOKEN_REVERSE,
          sender,
          inputAmount: balance,
          inputToken: tokenInfo,
          outputToken
        })
      )[0];
      msgConverts.push(msgConvert);
    }
  }
  return msgConverts;
}

const parseTokenInfo = (tokenInfo: TokenItemType, amount?: string | number) => {
  if (!tokenInfo?.contractAddress) {
    if (amount)
      return {
        fund: { denom: tokenInfo.denom, amount: amount.toString() },
        info: { native_token: { denom: tokenInfo.denom } }
      };
    return { info: { native_token: { denom: tokenInfo.denom } } };
  }
  return { info: { token: { contract_addr: tokenInfo?.contractAddress } } };
};

const handleSentFunds = (...funds: (Fund | undefined)[]): Funds | null => {
  let sent_funds = [];
  for (let fund of funds) {
    if (fund) sent_funds.push(fund);
  }
  if (sent_funds.length === 0) return null;
  sent_funds.sort((a, b) => a.denom.localeCompare(b.denom));
  return sent_funds;
};

const generateSwapOperationMsgs = (
  denoms: [string, string],
  offerInfo: any,
  askInfo: any
): SwapOperation[] => {
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
            ask_asset_info: oraiInfo
          }
        },
        {
          orai_swap: {
            offer_asset_info: oraiInfo,
            ask_asset_info: askInfo
          }
        }
      ];
};

async function simulateSwap(query: {
  fromInfo: TokenInfo;
  toInfo: TokenInfo;
  amount: number | string;
}) {
  const { amount, fromInfo, toInfo } = query;
  // check if they have pairs. If not then we go through ORAI

  const { info: offerInfo } = parseTokenInfo(fromInfo, amount.toString());
  const { info: askInfo } = parseTokenInfo(toInfo);

  const operations = generateSwapOperationMsgs(
    [fromInfo.denom, toInfo.denom],
    offerInfo,
    askInfo
  );

  try {
    const data = await Contract.router.simulateSwapOperations({
      offerAmount: amount.toString(),
      operations
    });
    return data;
  } catch (error) {
    throw new Error(
      `Error when trying to simulate swap using router v2: ${error}`
    );
  }
}

export type SwapQuery = {
  type: Type.SWAP;
  fromInfo: TokenInfo;
  toInfo: TokenInfo;
  amount: number | string;
  max_spread: number | string;
  belief_price: number | string;
  sender: string;
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

async function generateContractMessages(
  query:
    | SwapQuery
    | ProvideQuery
    | WithdrawQuery
    | IncreaseAllowanceQuery
    | TransferQuery
) {
  const { type, sender, ...params } = query;
  let sent_funds;
  // for withdraw & provide liquidity methods, we need to interact with the oraiswap pair contract
  let contractAddr = network.router;
  let input;
  switch (type) {
    case Type.SWAP:
      const swapQuery = params as SwapQuery;
      const { fund: offerSentFund, info: offerInfo } = parseTokenInfo(
        swapQuery.fromInfo,
        swapQuery.amount.toString()
      );
      const { fund: askSentFund, info: askInfo } = parseTokenInfo(
        swapQuery.toInfo
      );
      sent_funds = handleSentFunds(offerSentFund as Fund, askSentFund as Fund);
      let inputTemp = {
        execute_swap_operations: {
          operations: generateSwapOperationMsgs(
            [swapQuery.fromInfo.denom, swapQuery.toInfo.denom],
            offerInfo,
            askInfo
          )
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
            msg: btoa(JSON.stringify(inputTemp))
          }
        };
        contractAddr = swapQuery.fromInfo.contractAddress;
      }
      break;
    case Type.PROVIDE:
      const provideQuery = params as ProvideQuery;
      const { fund: fromSentFund, info: fromInfoData } = parseTokenInfo(
        provideQuery.fromInfo,
        provideQuery.fromAmount
      );
      const { fund: toSentFund, info: toInfoData } = parseTokenInfo(
        provideQuery.toInfo,
        provideQuery.toAmount
      );
      sent_funds = handleSentFunds(fromSentFund as Fund, toSentFund as Fund);
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

async function generateMiningMsgs(
  msg: BondMining | WithdrawMining | UnbondLiquidity
) {
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
          msg: btoa(
            JSON.stringify({
              bond: {
                asset_info
              }
            })
          ) // withdraw liquidity msg in base64 : {"withdraw_liquidity":{}}
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

async function generateConvertMsgs(msg: Convert | ConvertReverse) {
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
        sent_funds = handleSentFunds(fund as Fund);
      } else {
        // cw20 case
        input = {
          send: {
            contract: network.converter,
            amount: inputAmount,
            msg: btoa(
              JSON.stringify({
                convert: {}
              })
            )
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
        sent_funds = handleSentFunds(fund as Fund);
      } else {
        // cw20 case
        input = {
          send: {
            contract: network.converter,
            amount: inputAmount,
            msg: btoa(
              JSON.stringify({
                convert_reverse: {
                  from: outputAssetInfo
                }
              })
            )
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

export {
  querySmart,
  fetchNativeTokenBalance,
  fetchPairInfo,
  fetchTokenBalance,
  fetchBalance,
  fetchTokenInfo,
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
  fetchAllPoolApr,
  fetchPoolApr,
  fetchBalanceWithMapping,
  generateConvertErc20Cw20Message,
  generateConvertCw20Erc20Message
};
