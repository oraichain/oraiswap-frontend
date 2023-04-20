import { fetchPriceMarket } from 'helper';

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const FALLBACK_PRICES = {
  airight: 0,
  cosmos: 0,
  'kawaii-islands': 0,
  'milky-token': 0,
  'oraichain-token': 0,
  oraidex: 0,
  osmosis: 0,
  scorai: 0,
  tether: 0,
  tron: 0,
  'usd-coin': 0
};

describe('fetch price market', () => {
  const mockSignal = new AbortController().signal;

  it.each([
    [
      {
        'oraichain-token': {
          usd: 2
        }
      },
      {},
      {
        'oraichain-token': 2
      }
    ],
    [
      {
        'oraichain-token': {
          usd: 2
        }
      },
      { 'oraichain-token': 1 },
      {
        'oraichain-token': 2
      }
    ]
  ])('should fetch price in market', async (mockPrices, cachedPrices, expectedPrices) => {
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(JSON.stringify(mockPrices))
    } as any);

    const result = await fetchPriceMarket(cachedPrices, mockSignal);
    console.log({ result });
    expect(result).toEqual(expectedPrices);
  });

  it('should return zero price if api fails and dont have cache price yet', async () => {
    mockFetch.mockRejectedValue(new Error('Error fetch market price'));

    const result = await fetchPriceMarket({}, mockSignal);
    expect(result).toEqual(FALLBACK_PRICES);
  });

  it.each([
    [
      {
        'oraichain-token': 1
      }
    ],
    [
      {
        airight: 21,
        cosmos: 21,
        'kawaii-islands': 21,
        'milky-token': 21,
        'oraichain-token': 21
      }
    ]
  ])('should return cache prices if api fails', async (cachedPrice) => {
    mockFetch.mockRejectedValue(new Error('Error fetch market price'));

    const result = await fetchPriceMarket(cachedPrice, mockSignal);
    expect(result).toEqual(cachedPrice);
  });
});
