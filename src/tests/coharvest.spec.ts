import { formatNumberKMB } from 'pages/CoHarvest/helpers';

describe('Co Harvest', () => {
  it.each([
    [0.001234, '$0.0012'],
    [2, '$2'],
    [2.1, '$2.1'],
    [2.129, '$2.13'],
    [1000, '$1.00K'],
    [1239.567, '$1.24K'],
    [999999.99999, '$1000.00K'],
    [1231567, '$1.23M'],
    [1234567891.111, '$1.23B']
  ])('test formatNumberKMB should formats %s to %s', (input, expected) => {
    expect(formatNumberKMB(input)).toBe(expected);
  });
});
