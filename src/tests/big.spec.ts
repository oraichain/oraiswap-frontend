// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';

describe('operator', () => {
  it('transplie', () => {
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');
    const c = ((a + b) / 2 + 15) * 20.12;
    const d = 10 + 12 - 5;
    const e = c + d;
    console.log(c, c.toNumber(), e.toNumber());
  });
});
