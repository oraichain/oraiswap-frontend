export const poolsList = Array(40)
  .fill({})
  .map(() => {
    const randomVolume = Math.random() * 1000000000
    const randomTVL = Math.random() * 500000000
    const randomFee = +(Math.random() * 500).toFixed(2)
    const randomApy = Math.random() * 5000000000
    const randomVolume24 = Math.random() * 1000
    const randomTvl24 = Math.random() * 100000
    const randomApyDataFees = Math.random() * 100
    const randomAccumulatedFarmsAvg = Math.random() * 1000
    const randomAccumulatedFarmsSingleTick = Math.random() * 2000

    return {
      symbolFrom: 'BCT',
      symbolTo: 'USDT',
      iconFrom:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      iconTo:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
      volume: randomVolume,
      TVL: randomTVL,
      fee: randomFee,
      apy: randomApy,
      apyData: {
        fees: randomApyDataFees,
        accumulatedFarmsAvg: randomAccumulatedFarmsAvg,
        accumulatedFarmsSingleTick: randomAccumulatedFarmsSingleTick
      },
      tokenXDetails: {
        address: '5Dvb5E8zKU4E9c7YxfNL5VC8YQj4VAFUTCGYY9ayFLnnY3UA',
        chainId: 101,
        decimals: 6,
        name: 'UST (Portal)',
        symbol: 'UST',
        logoURI:
          'https://raw.githubusercontent.com/wormhole-foundation/wormhole-token-list/main/assets/UST_wh.png',
        tags: ['wormhole', 'old-registry'],
        extensions: { coingeckoId: 'terrausd-wormhole' },
        coingeckoId: 'terrausd-wormhole'
      },
      tokenYDetails: {
        address: '5Dvb5E8zKU4E9c7YxfNL5VC8YQj4VAFUTCGYY9ayFLnnY3UA',
        chainId: 101,
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC',
        logoURI:
          'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        tags: ['old-registry', 'solana-fm'],
        extensions: { coingeckoId: 'usd-coin' },
        coingeckoId: 'usd-coin'
      },
      volume24: randomVolume24,
      tvl: randomTvl24
    }
  })

export const tokensList = [
  {
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    name: 'Wrapped SOL',
    symbol: 'SOL',
    price: 123.321321452,
    priceChange: 0.123,
    volume: 421323423.23,
    tvl: 32065.79898800001,
    tokenDetails: {
      address: '5Dvb5E8zKU4E9c7YxfNL5VC8YQj4VAFUTCGYY9ayFLnnY3UA',
      chainId: 101,
      decimals: 6,
      name: 'USD Coin',
      symbol: 'USDC',
      logoURI:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      tags: ['old-registry', 'solana-fm'],
      extensions: { coingeckoId: 'usd-coin' },
      coingeckoId: 'usd-coin'
    },
    volume24: 841.2384
  },
  {
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
    name: 'USDT',
    symbol: 'USDT',
    price: 1.321452,
    priceChange: 2,
    volume: 421323423.23,
    tvl: 234413532.43,
    tokenDetails: {
      address: '5Dvb5E8zKU4E9c7YxfNL5VC8YQj4VAFUTCGYY9ayFLnnY3UA',
      chainId: 101,
      decimals: 9,
      name: 'Wrapped SOL',
      symbol: 'SOL',
      logoURI:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      tags: ['old-registry'],
      extensions: { coingeckoId: 'wrapped-solana' },
      coingeckoId: 'wrapped-solana'
    },
    volume24: 21.2384
  },
  {
    icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.0,
    priceChange: 0.83,
    volume: 421323423.23,
    tvl: 234413532.43,
    tokenDetails: {
      address: '5Dvb5E8zKU4E9c7YxfNL5VC8YQj4VAFUTCGYY9ayFLnnY3UA',
      chainId: 101,
      decimals: 9,
      name: 'Wrapped SOL',
      symbol: 'SOL',
      logoURI:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      tags: ['old-registry'],
      extensions: { coingeckoId: 'wrapped-solana' },
      coingeckoId: 'wrapped-solana'
    },
    volume24: 8241.2384
  }
]

export const volume24h = { value: 4022333.4231874547, change: -52.239195549272985 }

export const tvl24h = { value: 279204.3080979749, change: -3.604507854550285 }

export const fees24h = { value: 599.544959417, change: -47.79969743772543 }

export const volumePlotData = [
  { timestamp: 1716552000000, value: 4512625.608953071 },
  { timestamp: 1716638400000, value: 2696192.124473429 },
  { timestamp: 1716724800000, value: 1659467.054644387 },
  { timestamp: 1716811200000, value: 2478284.0069509996 },
  { timestamp: 1716897600000, value: 4066913.005100426 },
  { timestamp: 1717070400000, value: 8535283.141011314 },
  { timestamp: 1717156800000, value: 3057580.304299723 },
  { timestamp: 1717243200000, value: 3438682.6270488105 },
  { timestamp: 1717329600000, value: 2405098.563568 },
  { timestamp: 1717416000000, value: 3010963.8025822206 },
  { timestamp: 1717502400000, value: 3361458.9228925616 },
  { timestamp: 1717588800000, value: 4530301.107894169 },
  { timestamp: 1717675200000, value: 4650692.700283449 },
  { timestamp: 1717761600000, value: 6302225.768652554 },
  { timestamp: 1717848000000, value: 7763069.118376541 },
  { timestamp: 1717934400000, value: 3534570.8735763766 },
  { timestamp: 1718020800000, value: 3844000.33935 },
  { timestamp: 1718107200000, value: 4168392.436431511 },
  { timestamp: 1718193600000, value: 4212258.790136831 },
  { timestamp: 1718280000000, value: 4115531.3857006463 },
  { timestamp: 1718366400000, value: 2844247.1688079913 },
  { timestamp: 1718452800000, value: 3571590.550698615 },
  { timestamp: 1718539200000, value: 1919774.698571 },
  { timestamp: 1718625600000, value: 3474827.407744309 },
  { timestamp: 1718712000000, value: 6270210.212383572 },
  { timestamp: 1718798400000, value: 8944805.2201305 },
  { timestamp: 1718884800000, value: 8421829.300084637 },
  { timestamp: 1718971200000, value: 4022333.4231874547 }
]

export const liquidityPlotData = [
  { timestamp: 1716552000000, value: 283814.9853831609 },
  { timestamp: 1716638400000, value: 296563.856253402 },
  { timestamp: 1716724800000, value: 279605.94078915595 },
  { timestamp: 1716811200000, value: 286414.33889901394 },
  { timestamp: 1716897600000, value: 289328.01251464605 },
  { timestamp: 1717070400000, value: 291109.37093950785 },
  { timestamp: 1717156800000, value: 299144.8861490599 },
  { timestamp: 1717243200000, value: 286275.867182114 },
  { timestamp: 1717329600000, value: 269892.904872398 },
  { timestamp: 1717416000000, value: 267545.83903459297 },
  { timestamp: 1717502400000, value: 263298.0398656629 },
  { timestamp: 1717588800000, value: 267228.09554199304 },
  { timestamp: 1717675200000, value: 264501.37196904595 },
  { timestamp: 1717761600000, value: 265863.77726675477 },
  { timestamp: 1717848000000, value: 402046.74954411597 },
  { timestamp: 1717934400000, value: 414647.28326416895 },
  { timestamp: 1718020800000, value: 412864.8249698 },
  { timestamp: 1718107200000, value: 425187.23476959986 },
  { timestamp: 1718193600000, value: 427589.885517467 },
  { timestamp: 1718280000000, value: 433799.8806224759 },
  { timestamp: 1718366400000, value: 463301.1012211619 },
  { timestamp: 1718452800000, value: 469062.1202646391 },
  { timestamp: 1718539200000, value: 460250.9162467961 },
  { timestamp: 1718625600000, value: 449104.74350912473 },
  { timestamp: 1718712000000, value: 427811.60435006284 },
  { timestamp: 1718798400000, value: 287254.4826316768 },
  { timestamp: 1718884800000, value: 289644.56935049174 },
  { timestamp: 1718971200000, value: 279204.3080979749 }
]

export const isLoadingStats = false
