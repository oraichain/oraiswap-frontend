// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';
import { transform } from '@babel/core';

describe('operator overloading', () => {
  it('binary expression', () => {
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c = ((a + b) / 2n + 15 * (a - b)) * 20.12;
    const d = 10 + 12 - 5;
    const e = c + d;
    console.log(c, d, e);
  });

  it('transform', () => {
    const actual = transform(
      `
    import { BigDecimal } from '@oraichain/oraidex-common';

    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c = ((a + b) / 2n + 15 * (a - b)) * 20.12;
    const d = 10 + 12 - 5;
    const e = c + d;    
    console.log(c, d, e);
    `
    );

    console.log(actual.code);
  });
});
