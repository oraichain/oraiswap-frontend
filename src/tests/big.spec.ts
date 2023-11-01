// @ts-nocheck
import { BigDecimal } from '@oraichain/oraidex-common';
import { transform } from '@babel/core';

describe('operator overloading', () => {
  it('binary expression', () => {
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');

    const c: BigDecimal = ((a + b) / 2 + 15) * 20.12;
    const d = 10 + 12 - 5;
    const e: BigDecimal = c + d;
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
    `,
      {
        configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        plugins: [['./plugins/operator-overloading', { enabled: true, classNames: ['BigDecimal'] }]]
      }
    );

    console.log(actual.code);
  });
});
