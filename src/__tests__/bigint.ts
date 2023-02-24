import { parseAmountToWithDecimal } from 'libs/utils';

describe('bigint', () => {
  it('amount > 1000', () => {
    const amount = 6000;
    const decimals = 18;
    const formattedAmount = BigInt(
      parseAmountToWithDecimal(amount, decimals)
    ).toString();
    console.log(formattedAmount);
  });
});
