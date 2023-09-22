import { Uint128 } from '@oraichain/oraidex-contracts-sdk';
import { TokenItemType } from 'config/bridgeTokens';
import { buildMultipleExecuteMessages } from 'libs/cosmjs';
import { toAmount } from 'libs/utils';
import { generateContractMessages, generateConvertErc20Cw20Message, SwapQuery, Type } from 'rest/api';

export function calculateMinReceive(simulateAverage: string, fromAmount: string, userSlippage: number): Uint128 {
  const amount = +simulateAverage * +fromAmount;
  const result = amount * (1 - userSlippage / 100);
  return Math.round(result).toString();
}

export function generateMsgsSwap(
  fromTokenInfoData: TokenItemType,
  fromAmountToken: number,
  toTokenInfoData: TokenItemType,
  amounts: AmountDetails,
  userSlippage: number,
  oraiAddress: string,
  simulateAverage: string
) {
  try {
    const _fromAmount = toAmount(fromAmountToken, fromTokenInfoData.decimals).toString();

    // hard copy of from & to token info data to prevent data from changing when calling the function
    const msgConvertsFrom = generateConvertErc20Cw20Message(amounts, fromTokenInfoData, oraiAddress);
    const msgConvertTo = generateConvertErc20Cw20Message(amounts, toTokenInfoData, oraiAddress);

    const minimumReceive = calculateMinReceive(simulateAverage, _fromAmount, userSlippage);
    const msg = generateContractMessages({
      type: Type.SWAP,
      sender: oraiAddress,
      amount: _fromAmount,
      fromInfo: fromTokenInfoData!,
      toInfo: toTokenInfoData!,
      minimumReceive
    } as SwapQuery);

    const messages = buildMultipleExecuteMessages(msg, ...msgConvertsFrom, ...msgConvertTo);
    return messages;
  } catch (error) {
    console.log('error generateMsgsSwap: ', error);
  }
}
