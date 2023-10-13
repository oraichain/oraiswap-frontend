import { Uint128 } from '@oraichain/oraidex-contracts-sdk';
import { TokenItemType } from 'config/bridgeTokens';
import { buildMultipleExecuteMessages } from 'libs/cosmjs';
import { toAmount, toDisplay } from 'libs/utils';
import { generateContractMessages, generateConvertErc20Cw20Message, SwapQuery, Type } from 'rest/api';

export const calculateMinReceive = (
  simulateAverage: string,
  fromAmount: string,
  userSlippage: number,
  decimals: number
): Uint128 => {
  const amount = BigInt(simulateAverage) * BigInt(fromAmount);
  return ((BigInt(Math.trunc(toDisplay(amount, decimals))) * (100n - BigInt(userSlippage))) / 100n).toString();
};

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

    const minimumReceive = calculateMinReceive(simulateAverage, _fromAmount, userSlippage, fromTokenInfoData.decimals);
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
