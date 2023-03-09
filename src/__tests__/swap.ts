import { filteredTokens } from 'config/bridgeTokens';
import { GAS_ESTIMATION_SWAP_DEFAULT, ORAICHAIN_ID } from 'config/constants';
import { feeEstimate } from 'helper';
import { buildMultipleMessages, toAmount, toDisplay } from 'libs/utils';
import { generateContractMessages, SwapQuery, Type } from 'rest/api';

describe('swap', () => {
  it('max amount', () => {
    const amount = 123456789n;
    const decimals = 6;

    const displayAmount = toDisplay(amount, decimals);
    expect(displayAmount).toBe(123.456789);
  });

  it('max amount with denom orai', async () => {
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals: 6 };

    const displayAmount = toDisplay(amount, decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = await feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);

    let finalAmount = useFeeEstimate > displayAmount ? 0 : displayAmount - useFeeEstimate;
    expect(finalAmount).toBe(0.993503);
  });

  it('half amount', () => {
    const amount = 123456789n;
    const decimals = 6;
    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    expect(displayAmount).toBe(61.728394);
  });

  it('half amount with denom orai', async () => {
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals: 6 };

    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = await feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);
    const fromTokenBalanceDisplay = toDisplay(amount, oraiDecimals.decimals);

    let finalAmount = useFeeEstimate > fromTokenBalanceDisplay - displayAmount ? 0 : displayAmount;
    expect(finalAmount).toBe(0.499999);
  });

  it('generate msgs contract for swap action', () => {
    const address = 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz';
    const fromAmountToken = 10;
    const fromTokenDecimals = 6;
    const fromTokenInfoData = filteredTokens.find((item) => item.name == 'AIRI' && item.chainId == ORAICHAIN_ID);
    const toTokenInfoData = filteredTokens.find((item) => item.name == 'ORAIX' && item.chainId == ORAICHAIN_ID);
    const _fromAmount = toAmount(fromAmountToken, fromTokenDecimals).toString();
    const msgs = generateContractMessages({
      type: Type.SWAP,
      sender: address,
      amount: _fromAmount,
      fromInfo: fromTokenInfoData,
      toInfo: toTokenInfoData
    } as any);
    const msg = msgs[0];
    const messages = buildMultipleMessages(msg, [], []);
    expect(Array.isArray(messages)).toBe(true);
  });
});
