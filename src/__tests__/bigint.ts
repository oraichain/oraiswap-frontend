import { toAmount } from 'libs/utils';

describe('bigint', () => {
  it('amount > 1000', () => {
    const amount = 6000;
    const decimals = 18;
    const formattedAmount = toAmount(amount, decimals).toString();
    expect(formattedAmount).toBe('6000000000000000000000');
  });
});
