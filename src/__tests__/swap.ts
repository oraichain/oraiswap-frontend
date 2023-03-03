import { GAS_ESTIMATION_SWAP_DEFAULT } from "config/constants";
import { feeEstimate } from "helper";
import { buildMultipleMessages, toAmount, toDisplay } from "libs/utils";
import { generateContractMessages, SwapQuery, Type } from "rest/api";

describe('swap', () => {
  test('max amount', () => { 
    const amount = 123456789n;
    const decimals = 6;

    const displayAmount = toDisplay(amount, decimals);
    expect(displayAmount).toBe(123.456789);
  });

  test('max amount with denom orai', async () => { 
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals: 6 }

    const displayAmount = toDisplay(amount, decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = await feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);

    let finalAmount = useFeeEstimate > displayAmount ? 0 : displayAmount - useFeeEstimate;
    expect(finalAmount).toBe(0.993503);
  });

  test('half amount', () => { 
    const amount = 123456789n;
    const decimals = 6;

    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    expect(displayAmount).toBe(61.728394);
  });

  test('half amount with denom orai', async () => { 
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals: 6 }

    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = await feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);
    const fromTokenBalanceDisplay = toDisplay(amount, oraiDecimals.decimals);

    let finalAmount = useFeeEstimate > fromTokenBalanceDisplay - displayAmount ? 0 : displayAmount;
    expect(finalAmount).toBe(0.499999);
  });

  test('generate msgs contract for swap action', () => {
    const address = 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz';
    const fromAmountToken = 10;
    const fromTokenDecimals = 6;
    const fromTokenInfoData = {
      name: "aiRight Token",
      org: "Oraichain",
      prefix: "orai",
      coingeckoId: "airight",
      denom: "airi",
      contractAddress: "orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg",
      bridgeTo: [
          "BNB Chain"
      ],
      decimals: 6,
      coinType: 118,
      chainId: "Oraichain",
      rpc: "https://rpc.orai.io",
      cosmosBased: true,
      Icon: {},
      symbol: "AIRI",
      verified: false,
      total_supply: "999999980000000"
    }
    const toTokenInfoData = {
      name: "ORAIX token",
      org: "Oraichain",
      prefix: "orai",
      coinType: 118,
      denom: "oraix",
      contractAddress: "orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge",
      coingeckoId: "oraidex",
      decimals: 6,
      chainId: "Oraichain",
      rpc: "https://rpc.orai.io",
      cosmosBased: true,
      Icon: {},
      symbol: "ORAIX",
      verified: false,
      total_supply: "749999978999989"
    }
    
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
    const result = [{
      contractAddress: 'orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg',
      handleMsg: '{"send":{"contract":"orai1gflugm9jsggy30dvz8wat404l3n5gk97p7jva299d0yja8j8437slzu74v","amount":"10000000","msg":"eyJleGVjdXRlX3N3YXBfb3BlcmF0aW9ucyI6eyJvcGVyYXRpb25zIjpbeyJvcmFpX3N3YXAiOnsib2ZmZXJfYXNzZXRfaW5mbyI6eyJ0b2tlbiI6eyJjb250cmFjdF9hZGRyIjoib3JhaTEwbGRnenVlZDZ6anAwbWtxd3N2Mm11eDNtbDUwbDk3Yzc0eDhzZyJ9fSwiYXNrX2Fzc2V0X2luZm8iOnsibmF0aXZlX3Rva2VuIjp7ImRlbm9tIjoib3JhaSJ9fX19LHsib3JhaV9zd2FwIjp7Im9mZmVyX2Fzc2V0X2luZm8iOnsibmF0aXZlX3Rva2VuIjp7ImRlbm9tIjoib3JhaSJ9fSwiYXNrX2Fzc2V0X2luZm8iOnsidG9rZW4iOnsiY29udHJhY3RfYWRkciI6Im9yYWkxbHVzMGYwcmh4OHMwM2dkbGx4Mm42dmhrbWYwNTM2ZHY1N3dmZ2UifX19fV19fQ=="}}',
      handleOptions: { funds: null }
    }];

    expect(messages.toString()).toBe(result.toString());
  });
});
