import { validateNumber } from 'libs/utils';

describe('validateNumber', () => {
  it('validateNumber-NaN-should-return-zero', async () => {
    const amount = Number.NaN;
    const res = validateNumber(amount);
    expect(res).toBe(0);
  });

  it('validateNumber-infinite-should-return-zero', async () => {
    const amount = Number.POSITIVE_INFINITY;
    const res = validateNumber(amount);
    expect(res).toBe(0);
  });

  it('validateNumber-super-large-number', async () => {
    const amount = 2 * Math.pow(10, 21);
    const res = validateNumber(amount);
    expect(res).toBe(2e+21);
  });

  it('validateNumber-happy-path-should-return-amount', async () => {
    const amount = 6;
    const res = validateNumber(amount);
    expect(res).toBe(6);
  });
});
