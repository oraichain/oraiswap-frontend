import * as utils from 'libs/utils';

describe('test-utils-function', () => {
  it.each([
    // ['777', 6, 3],
    // ['777', 18, 17],
    ['1000000', 6, 3],
    ['7777', 6, 3]
  ])('test-toDisplay-should-display-correctly-amount', (amount, sourceDecimal, desDecimal) => {
    const result = utils.toDisplay(amount, sourceDecimal, desDecimal);
    console.log({ result });
  });
});
