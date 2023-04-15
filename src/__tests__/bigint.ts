import { toAmount, toDecimal, toDisplay } from 'libs/utils';

describe('bigint', () => {
  describe('toAmount', () => {
    it('toAmount-happy-path', async () => {
      const amount = 6000;
      const decimal = 18;
      const res = toAmount(amount, decimal).toString();
      expect(res).toBe('6000000000000000000000');
    });

    it('toAmount-percent', () => {
      const bondAmount = BigInt(1000);
      const percentValue = (toAmount(0.3, 6) * bondAmount) / BigInt(100000000);
      expect(percentValue.toString()).toBe('3');
    });

    it('toAmount-super-large-number-should-return-equal-amount-form-in-number', async () => {
      const amount = 2000000;
      const decimal = 18;
      const res = toAmount(amount, decimal).toString();
      expect(res).toBe('2000000000000000000000000');
    });

    it('toAmount-float-high-decimal-points-should-not-round-up', async () => {
      const amount = 6000.5043177;
      const decimal = 6;
      const res = toAmount(amount, decimal).toString();
      expect(res).toBe('6000504317');
    });

    it('toAmount-float-should-auto-trim-and-convert', async () => {
      const amount = 6000.504317725654;
      const decimal = 6;
      const res = toAmount(amount, decimal).toString();
      expect(res).toBe('6000504317');
    });

    it('toAmount-small-float-test', async () => {
      const amount = 0.0006863532;
      const decimal = 6;
      const res = toAmount(amount, decimal).toString();
      expect(res).toBe('686');
    });
  });

  describe('toDisplay', () => {
    it('toDisplay-happy-path', async () => {
      const amount = '1000';
      const decimal = 6;
      const res = toDisplay(amount, decimal).toString();
      expect(res).toBe('0.001');
    });

    it('toDisplay-float-number-should-display-correct-des-decimal', async () => {
      // display number from value in string or bigint or e^n format
      const amount = '454136345353413531';
      const decimal = 15;
      let res = toDisplay(amount, decimal).toString();
      expect(res).toBe('454.136345');

      const desDecimal = 2;
      res = toDisplay(amount, decimal, desDecimal).toString();
      expect(res).toBe('454.13'); // here toFixed round up, but its okay because it is just display, not true amount
    });

    it('toDisplay-big-number-should-display-correct-des-decimal', async () => {
      // display number from value in string or bigint or e^n format
      const amount = '100000000000000';
      const decimal = 18;
      let res = toDisplay(amount, decimal).toString();
      expect(res).toBe('0.0001');
    });
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
  });
});
