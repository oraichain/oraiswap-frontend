import { transform } from '@babel/core';

describe('operator', () => {
  it('transplie', () => {
    const actual = transform(
      `
    import { BigDecimal } from '@oraichain/oraidex-common';
    const a = new BigDecimal('123.45');
    const b = new BigDecimal('678.9');
    const c =  (((a + b) / 2) + 15) * 20.12;
    console.log(c);`,
      {
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        plugins: [['./plugins/operator-overloading', { enabled: true }]]
      }
    );
    eval(actual.code);
    console.log(actual.code);
  });
});
