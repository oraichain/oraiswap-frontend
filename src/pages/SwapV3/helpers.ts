import { toDisplay } from '../../libs/utils';
import { TokenItemType } from 'config/bridgeTokens';
import { Uint128 } from 'libs/contracts';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { generateContractMessages, generateConvertErc20Cw20Message, SwapQuery, Type } from 'rest/api';

export function calculateMinReceive(simulateAmount: string, userSlippage: number, decimals: number): Uint128 {
  const amount = toDisplay(simulateAmount, decimals);
  const result = amount * (1 - userSlippage / 100);
  return toAmount(result, decimals).toString();
}

export function generateMsgsSwap(
  fromTokenInfoData: TokenItemType,
  fromAmountToken: number,
  toTokenInfoData: TokenItemType,
  amounts: AmountDetails,
  simulateData: any,
  userSlippage: number,
  oraiAddress: string
) {
  try {
    const _fromAmount = toAmount(fromAmountToken, fromTokenInfoData.decimals).toString();

    // hard copy of from & to token info data to prevent data from changing when calling the function
    const msgConvertsFrom = generateConvertErc20Cw20Message(amounts, fromTokenInfoData, oraiAddress);
    const msgConvertTo = generateConvertErc20Cw20Message(amounts, toTokenInfoData, oraiAddress);

    const minimumReceive = calculateMinReceive(simulateData.amount, userSlippage, fromTokenInfoData.decimals);
    const msgs = generateContractMessages({
      type: Type.SWAP,
      sender: oraiAddress,
      amount: _fromAmount,
      fromInfo: fromTokenInfoData!,
      toInfo: toTokenInfoData!,
      minimumReceive
    } as SwapQuery);

    const msg = msgs[0];

    const messages = buildMultipleMessages(msg, msgConvertsFrom, msgConvertTo);
    return messages;
  } catch (error) {
    console.log('error generateMsgsSwap: ', error);
  }
}
