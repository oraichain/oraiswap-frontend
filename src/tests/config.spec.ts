import { formatTVDate, formatTVTime } from 'components/TVChartContainer/config';

describe('Date format', () => {
  it('format date time', () => {
    const date = new Date('Fri Aug 04 2023 16:47:21');
    expect(formatTVDate(date)).toEqual('04 Aug 2023');
    expect(formatTVTime(date)).toEqual('4:47:21 PM');
  });
});
