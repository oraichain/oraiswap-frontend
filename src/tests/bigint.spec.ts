import { TokenItemType, flattenTokens } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd, toAmount, toDecimal, toDisplay } from 'libs/utils';

describe('bigint', () => {
  describe('toAmount', () => {
    it('toAmount-percent', () => {
      const bondAmount = BigInt(1000);
      const percentValue = (toAmount(0.3, 6) * bondAmount) / BigInt(100000000);
      expect(percentValue.toString()).toBe('3');
    });

    it.each([
      [6000, 18, '6000000000000000000000'],
      [2000000, 18, '2000000000000000000000000'],
      [6000.5043177, 6, '6000504317'],
      [6000.504317725654, 6, '6000504317'],
      [0.0006863532, 6, '686']
    ])(
      'toAmount number %.7f with decimal %d should return %s',
      (amount: number, decimal: number, expectedAmount: string) => {
        const res = toAmount(amount, decimal).toString();
        expect(res).toBe(expectedAmount);
      }
    );
  });

  describe('toDisplay', () => {
    it.each([
      ['1000', 6, '0.001', 6],
      ['454136345353413531', 15, '454.136345', 6],
      ['454136345353413531', 15, '454.13', 2],
      ['100000000000000', 18, '0.0001', 6]
    ])(
      'toDisplay number %d with decimal %d should return %s',
      (amount: string, decimal: number, expectedAmount: string, desDecimal: number) => {
        const res = toDisplay(amount, decimal, desDecimal).toString();
        expect(res).toBe(expectedAmount);
      }
    );
  });

  describe('toDecimal', () => {
    it('toDecimal-happy-path', async () => {
      const numerator = BigInt(6);
      const denominator = BigInt(3);
      const res = toDecimal(numerator, denominator);
      expect(res).toBe(2);
    });

    it('should return 0 when denominator is zero', async () => {
      const numerator = BigInt(123456);
      const denominator = BigInt(0);
      expect(toDecimal(numerator, denominator)).toBe(0);
    });

    it('should correctly convert a fraction into its equivalent decimal value', () => {
      const numerator = BigInt(1);
      const denominator = BigInt(3);

      // Convert the fraction to its decimal value using toDecimal.
      const decimalValue = toDecimal(numerator, denominator);
      // Expect the decimal value to be equal to the expected value.
      expect(decimalValue).toBeCloseTo(0.333333, 6);
    });

    it.each([
      [BigInt(1), BigInt(3), 0.333333, 6],
      [BigInt(1), BigInt(3), 0.3333, 4],
      [BigInt(1), BigInt(2), 0.5, 6]
    ])(
      'should correctly convert a fraction into its equivalent decimal value',
      (numerator, denominator, expectedDecValue, desDecimal) => {
        // Convert the fraction to its decimal value using toDecimal.
        const decimalValue = toDecimal(numerator, denominator);
        // Expect the decimal value to be equal to the expected value.
        expect(decimalValue).toBeCloseTo(expectedDecValue, desDecimal);
      }
    );

    it.each([
      [BigInt(1000000), flattenTokens.find((t) => t.denom === 'orai'), {}, 0],
      [BigInt(1000000), flattenTokens.find((t) => t.denom === 'orai'), { 'oraichain-token': 2 }, 2],
      [BigInt(1000000), flattenTokens.find((t) => t.denom === 'orai'), { airight: 2 }, 0]
    ])(
      'should correctly get amount USD of token base on price in market',
      (amount: string | bigint, tokenInfo: TokenItemType, prices: CoinGeckoPrices<string>, expectedUsd: number) => {
        const usd = getUsd(amount, tokenInfo, prices);
        expect(usd).toEqual(expectedUsd);
      }
    );
  });
});
