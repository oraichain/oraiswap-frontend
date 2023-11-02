// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';
import { transform } from '@babel/core';

describe('operator overloading', () => {
  it('binary expression', () => {
    console.log(new BigDecimal('123.4578912345'));
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c: BigDecimal = ((a + b) / 2 + 15) * 20.12;
    const d = 10 + 12 - 5;
    const e: BigDecimal = c + d;
    console.log(d, e);
    expect(c.toNumber()).toBe(8373.441);
  });

  it('transform', () => {
    const actual = transform(
      `
    import { BigDecimal } from '@oraichain/oraidex-common';

    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c = ((a + b) / 2 + 15) * 20.12;
    const d = 10 + 12 - 5;
    const e = c + d;    
    `
    );

    console.log(actual.code);
  });
});
