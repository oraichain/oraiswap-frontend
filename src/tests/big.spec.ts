// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';

describe('operator', () => {
  it('transplie', () => {
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c: BigDecimal = ((a + b) / 2 + 15) * 20.12;
    const d = 10 + 12 - 5;
    const e: BigDecimal = c + d;
    expect(c.toNumber()).toBe(8373.441);
  });
});

// describe('operator', () => {
//   it('transplie', () => {
//     const { transform } = require('@babel/core');
//     const actual = transform(
//       `
//     import { BigDecimal } from '@oraichain/oraidex-common';

//     console.log(  BigDecimal('2') -  BigDecimal('1'));
//     `,
//       {
//         presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
//         plugins: [['./plugins/operator-overloading', { enabled: true }]]
//       }
//     );
//     eval(actual.code);
//     console.log(actual.code);
//   });
// });
