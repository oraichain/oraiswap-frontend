import { ORAI, buildMultipleExecuteMessages } from '@oraichain/oraidex-common';
import { flattenTokens } from 'config/bridgeTokens';
import { getPoolTokens } from 'config/pools';
import {
  estimateShare,
  formatDisplayClaimable,
  formatDisplayUsdt,
  getInfoLiquidityPool,
  numberWithCommas,
  toFixedIfNecessary
} from 'pages/Pools/helpers';
import { ProvideQuery, Type, generateContractMessages } from 'rest/api';
import { constants } from './listing-simulate';

/**
 * We use 2 pairs: ORAI/AIRI & ORAI/USDT for all test below.
 */
describe('pool', () => {
  const { devAddress } = constants;

  describe('add & withdraw liquidity', () => {
    it('should generate contract messages correcty when add & withdraw liquidity pool ', async () => {
      const [amount1, amount2] = [100, 100];
      const [token1InfoData, token2InfoData] = [
        flattenTokens.find((t) => t.name === 'ORAI' && t.chainId === 'Oraichain'),
        flattenTokens.find((t) => t.name === 'USDT' && t.chainId === 'Oraichain')
      ];
      const testPairContractAddr = 'test-contract-addr';
      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: devAddress,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: testPairContractAddr
      } as ProvideQuery);

      // check if the contract address, sent_funds and sender are correct
      expect(msg.contractAddress).toEqual(testPairContractAddr);
      expect(msg.funds).toEqual([{ amount: '100', denom: ORAI }]);
      expect(msg).toHaveProperty('msg');

      const messages = buildMultipleExecuteMessages(msg);
      // check if the contract address, sent_funds and sender are correct
      expect(messages[0].contractAddress).toEqual(testPairContractAddr);
      expect(messages[0]).toHaveProperty('funds');

      expect(messages[0].msg).toEqual({
        provide_liquidity: {
          assets: [
            { info: { token: { contract_addr: token2InfoData.contractAddress } }, amount: '100' },
            { info: { native_token: { denom: ORAI } }, amount: '100' }
          ]
        }
      });
    });
  });

  it('test Pairs getPoolTokens', () => {
    const poolTokens = getPoolTokens();
    expect(Array.isArray(poolTokens)).toBe(true);
    expect(poolTokens.length).toBe(13);
  });

  it.each([
    ['0.001234', '$0.0012'],
    ['2', '$2'],
    ['2.1', '$2.1'],
    ['2.129', '$2.13'],
    ['1234567', '$1,234,567'],
    ['1234567.111', '$1,234,567.11']
  ])('test formatDisplayUsdt should formats %s to %s', (input, expected) => {
    expect(formatDisplayUsdt(input)).toBe(expected);
  });

  it.each([
    ['0', '0'],
    ['0.001234', '+$0.0012'],
    ['2', '+$2'],
    ['2.1', '+$2.1'],
    ['2.129', '+$2.13'],
    ['1234567', '+$1,234,567'],
    ['1234567.111', '+$1,234,567.11']
  ])('test formatDisplayClaimable should formats %s to %s', (input, expected) => {
    expect(formatDisplayClaimable(input)).toBe(expected);
  });

  it.each([
    ['orai', undefined, { native_token: { denom: 'orai' } }],
    [
      'oraix',
      'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
      {
        token: {
          contract_addr: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge'
        }
      }
    ], // ORAIX
    [
      'usdt',
      'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
      {
        token: {
          contract_addr: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh'
        }
      }
    ] // USDT
  ])('test-getInfoLiquidityPool', (denom, contract_addr, expected) => {
    const lpInfo = getInfoLiquidityPool({ denom, contract_addr });
    // assert
    expect(lpInfo).toEqual(expected);
  });

  it.each([
    [2.12345, '2.123'],
    [2.1, '2.1'],
    [2, '2'],
    [21234.5, '21,234.5'],
    [28988998.129, '28,988,998.129']
  ])('test numberWithCommas should format %d to %s', (value, expected) => {
    expect(numberWithCommas(value)).toEqual(expected);
  });

  it.each([
    ['2.12345', 2, 2.12],
    ['2.1', 2, 2.1],
    ['2', 2, 2],
    ['2.12345', 1, 2.1],
    ['2.129', 1, 2.1]
  ])('test toFixedIfNecessary should rounds %s to %d decimal places as %f', (value, dp, expected) => {
    expect(toFixedIfNecessary(value, dp)).toBeCloseTo(expected);
  });

  it.each<[number, number, number]>([
    [0, 1, 0],
    [1, 0, 0],
    [100, 500, 0.02]
  ])('test-estimateShare-should-return-correctly-share', (totalBaseAmount, totalQuoteAmount, expectedResult) => {
    // setup
    const payload = {
      baseAmount: 1,
      quoteAmount: 2,
      totalShare: 5,
      totalBaseAmount,
      totalQuoteAmount
    };

    // act
    const result = estimateShare(payload);

    // assertion
    expect(result).toEqual(expectedResult);

    // if totalShare is falsy
    payload.totalShare = NaN;
    expect(estimateShare(payload)).toEqual(0);
  });
});
