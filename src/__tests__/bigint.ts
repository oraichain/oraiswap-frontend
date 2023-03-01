import { toAmount, toDisplay } from 'libs/utils';

describe('bigint', () => {
  it('toAmount-happy-path', async () => {
    const amount = 6000;
    const decimal = 18;
    const res = toAmount(amount, decimal).toString();
    expect(res).toBe('6000000000000000000000');
  });

  it('toAmount-super-large-number-should-return-equal-amount-form-in-number', async () => {
    const amount = 2000000;
    const decimal = 18;
    const res = toAmount(amount, decimal).toString();
    expect(res).toBe('2000000000000000000000000'); // TODO: how to handle this? BigInt seems to break as well when the amount is too large
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
