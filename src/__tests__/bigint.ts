import { toAmount, toDisplay } from 'libs/utils';

describe('bigint', () => {
  it('toAmount > 1000', async () => {
    const amount = 6000;
    const decimal = 18;
    const res = toAmount(amount, decimal).toString();
    expect(res).toBe('6000000000000000000000');
  });

  it('toDisplay > 1000', async () => {
    const amount = 1000;
    const decimal = 6;
    const res = toDisplay(amount, decimal).toString();
    expect(res).toBe('0.001');
  });
});
