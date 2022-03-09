//@ts-nocheck
// CONTRACT: Use with `observer`

import { ExtraGaugeInPool } from 'config';

const extraIncentivePools = [
  {
    poolId: '497',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'juno-network',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/juno.svg',
        coinMinimalDenom:
          'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
        coinDenom: 'JUNO',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-42'
          }
        ],
        originChainId: 'juno-1',
        originCurrency: {
          coinDenom: 'JUNO',
          coinMinimalDenom: 'ujuno',
          coinDecimals: 6,
          coinGeckoId: 'juno-network',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/juno.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1679', '1680', '1681'],
    incentiveDenom:
      'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED'
  },
  {
    poolId: '498',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'juno-network',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/juno.svg',
        coinMinimalDenom:
          'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
        coinDenom: 'JUNO',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-42'
          }
        ],
        originChainId: 'juno-1',
        originCurrency: {
          coinDenom: 'JUNO',
          coinMinimalDenom: 'ujuno',
          coinDecimals: 6,
          coinGeckoId: 'juno-network',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/juno.svg'
        }
      }
    ],
    gaugeIds: ['1682', '1683', '1684'],
    incentiveDenom:
      'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED'
  },
  {
    poolId: '547',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:utick',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/tick.svg',
        coinMinimalDenom:
          'ibc/655BCEF3CDEBE32863FF281DBBE3B06160339E9897DC9C9C9821932A5F8BA6F8',
        coinDenom: 'TICK',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-39'
          }
        ],
        originChainId: 'microtick-1',
        originCurrency: {
          coinDenom: 'TICK',
          coinMinimalDenom: 'utick',
          coinDecimals: 6,
          coinGeckoId: 'pool:utick',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/tick.svg'
        }
      }
    ],
    gaugeIds: ['2021', '2022', '2023'],
    incentiveDenom:
      'ibc/655BCEF3CDEBE32863FF281DBBE3B06160339E9897DC9C9C9821932A5F8BA6F8'
  },
  {
    poolId: '553',
    currencies: [
      {
        coinDecimals: 9,
        coinGeckoId: 'likecoin',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/likecoin.svg',
        coinMinimalDenom:
          'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
        coinDenom: 'LIKE',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-53'
          }
        ],
        originChainId: 'likecoin-mainnet-2',
        originCurrency: {
          coinDenom: 'LIKE',
          coinMinimalDenom: 'nanolike',
          coinDecimals: 9,
          coinGeckoId: 'likecoin',
          coinImageUrl:
            'http://localhost:8080/public/assets/tokens/likecoin.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2257', '2256', '2255'],
    incentiveDenom:
      'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525'
  },
  {
    poolId: '555',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 9,
        coinGeckoId: 'likecoin',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/likecoin.svg',
        coinMinimalDenom:
          'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
        coinDenom: 'LIKE',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-53'
          }
        ],
        originChainId: 'likecoin-mainnet-2',
        originCurrency: {
          coinDenom: 'LIKE',
          coinMinimalDenom: 'nanolike',
          coinDecimals: 9,
          coinGeckoId: 'likecoin',
          coinImageUrl:
            'http://localhost:8080/public/assets/tokens/likecoin.svg'
        }
      }
    ],
    gaugeIds: ['2254', '2253', '2252'],
    incentiveDenom:
      'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525'
  },
  {
    poolId: '560',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1948', '1949', '1950'],
    incentiveDenom:
      'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0'
  },
  {
    poolId: '562',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'terra-luna',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/luna.png',
        coinMinimalDenom:
          'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
        coinDenom: 'LUNA',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'LUNA',
          coinMinimalDenom: 'uluna',
          coinDecimals: 6,
          coinGeckoId: 'terra-luna',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/luna.png'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      }
    ],
    gaugeIds: ['1951', '1952', '1953'],
    incentiveDenom:
      'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0'
  },
  {
    poolId: '571',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'bitcanna',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/bcna.svg',
        coinMinimalDenom:
          'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
        coinDenom: 'BCNA',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-51'
          }
        ],
        originChainId: 'bitcanna-1',
        originCurrency: {
          coinDenom: 'BCNA',
          coinMinimalDenom: 'ubcna',
          coinDecimals: 6,
          coinGeckoId: 'bitcanna',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/bcna.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1759', '1760', '1761'],
    incentiveDenom:
      'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5'
  },
  {
    poolId: '572',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'bitcanna',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/bcna.svg',
        coinMinimalDenom:
          'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
        coinDenom: 'BCNA',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-51'
          }
        ],
        originChainId: 'bitcanna-1',
        originCurrency: {
          coinDenom: 'BCNA',
          coinMinimalDenom: 'ubcna',
          coinDecimals: 6,
          coinGeckoId: 'bitcanna',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/bcna.svg'
        }
      }
    ],
    gaugeIds: ['1762', '1763', '1764'],
    incentiveDenom:
      'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5'
  },
  {
    poolId: '573',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:ubtsg',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg',
        coinMinimalDenom:
          'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
        coinDenom: 'BTSG',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-73'
          }
        ],
        originChainId: 'bitsong-2b',
        originCurrency: {
          coinDenom: 'BTSG',
          coinMinimalDenom: 'ubtsg',
          coinDecimals: 6,
          coinGeckoId: 'pool:ubtsg',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2030', '2031', '2032'],
    incentiveDenom:
      'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452'
  },
  {
    poolId: '574',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:ubtsg',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg',
        coinMinimalDenom:
          'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
        coinDenom: 'BTSG',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-73'
          }
        ],
        originChainId: 'bitsong-2b',
        originCurrency: {
          coinDenom: 'BTSG',
          coinMinimalDenom: 'ubtsg',
          coinDecimals: 6,
          coinGeckoId: 'pool:ubtsg',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg'
        }
      }
    ],
    gaugeIds: ['2033', '2034', '2035'],
    incentiveDenom:
      'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452'
  },
  {
    poolId: '577',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uxki',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ki.svg',
        coinMinimalDenom:
          'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
        coinDenom: 'XKI',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-77'
          }
        ],
        originChainId: 'kichain-2',
        originCurrency: {
          coinDenom: 'XKI',
          coinMinimalDenom: 'uxki',
          coinDecimals: 6,
          coinGeckoId: 'pool:uxki',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ki.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2088', '2089', '2090'],
    incentiveDenom:
      'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E'
  },
  {
    poolId: '578',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uxki',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ki.svg',
        coinMinimalDenom:
          'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
        coinDenom: 'XKI',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-77'
          }
        ],
        originChainId: 'kichain-2',
        originCurrency: {
          coinDenom: 'XKI',
          coinMinimalDenom: 'uxki',
          coinDecimals: 6,
          coinGeckoId: 'pool:uxki',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ki.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      }
    ],
    gaugeIds: ['2091', '2092', '2093'],
    incentiveDenom:
      'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E'
  },
  {
    poolId: '586',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'medibloc',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/med.png',
        coinMinimalDenom:
          'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
        coinDenom: 'MED',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-82'
          }
        ],
        originChainId: 'panacea-3',
        originCurrency: {
          coinDenom: 'MED',
          coinMinimalDenom: 'umed',
          coinDecimals: 6,
          coinGeckoId: 'medibloc',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/med.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1885', '1886', '1887'],
    incentiveDenom:
      'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB'
  },
  {
    poolId: '587',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'medibloc',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/med.png',
        coinMinimalDenom:
          'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
        coinDenom: 'MED',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-82'
          }
        ],
        originChainId: 'panacea-3',
        originCurrency: {
          coinDenom: 'MED',
          coinMinimalDenom: 'umed',
          coinDecimals: 6,
          coinGeckoId: 'medibloc',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/med.png'
        }
      }
    ],
    gaugeIds: ['1888', '1889', '1890'],
    incentiveDenom:
      'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB'
  },
  {
    poolId: '592',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:ubtsg',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg',
        coinMinimalDenom:
          'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
        coinDenom: 'BTSG',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-73'
          }
        ],
        originChainId: 'bitsong-2b',
        originCurrency: {
          coinDenom: 'BTSG',
          coinMinimalDenom: 'ubtsg',
          coinDecimals: 6,
          coinGeckoId: 'pool:ubtsg',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/btsg.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      }
    ],
    gaugeIds: ['2036', '2037', '2038'],
    incentiveDenom:
      'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452'
  },
  {
    poolId: '602',
    currencies: [
      {
        coinDecimals: 9,
        coinGeckoId: 'cheqd-network',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cheq.svg',
        coinMinimalDenom:
          'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
        coinDenom: 'CHEQ',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-108'
          }
        ],
        originChainId: 'cheqd-mainnet-1',
        originCurrency: {
          coinDenom: 'CHEQ',
          coinMinimalDenom: 'ncheq',
          coinDecimals: 9,
          coinGeckoId: 'cheqd-network',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cheq.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2127', '2128'],
    incentiveDenom:
      'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA'
  },
  {
    poolId: '604',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:ustars',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/stars.png',
        coinMinimalDenom:
          'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
        coinDenom: 'STARS',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-75'
          }
        ],
        originChainId: 'stargaze-1',
        originCurrency: {
          coinDenom: 'STARS',
          coinMinimalDenom: 'ustars',
          coinDecimals: 6,
          coinGeckoId: 'pool:ustars',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/stars.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1995', '1996', '1997'],
    incentiveDenom:
      'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4'
  },
  {
    poolId: '605',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uhuahua',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/huahua.png',
        coinMinimalDenom:
          'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
        coinDenom: 'HUAHUA',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-113'
          }
        ],
        originChainId: 'chihuahua-1',
        originCurrency: {
          coinDenom: 'HUAHUA',
          coinMinimalDenom: 'uhuahua',
          coinDecimals: 6,
          coinGeckoId: 'pool:uhuahua',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/huahua.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1960', '1961', '1962'],
    incentiveDenom:
      'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228'
  },
  {
    poolId: '606',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uhuahua',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/huahua.png',
        coinMinimalDenom:
          'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
        coinDenom: 'HUAHUA',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-113'
          }
        ],
        originChainId: 'chihuahua-1',
        originCurrency: {
          coinDenom: 'HUAHUA',
          coinMinimalDenom: 'uhuahua',
          coinDecimals: 6,
          coinGeckoId: 'pool:uhuahua',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/huahua.png'
        }
      }
    ],
    gaugeIds: ['1963', '1964', '1965'],
    incentiveDenom:
      'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228'
  },
  {
    poolId: '611',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:ustars',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/stars.png',
        coinMinimalDenom:
          'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
        coinDenom: 'STARS',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-75'
          }
        ],
        originChainId: 'stargaze-1',
        originCurrency: {
          coinDenom: 'STARS',
          coinMinimalDenom: 'ustars',
          coinDecimals: 6,
          coinGeckoId: 'pool:ustars',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/stars.png'
        }
      }
    ],
    gaugeIds: ['1998', '1999', '2000'],
    incentiveDenom:
      'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4'
  },
  {
    poolId: '612',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'persistence',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/xprt.png',
        coinMinimalDenom:
          'ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293',
        coinDenom: 'XPRT',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-4'
          }
        ],
        originChainId: 'core-1',
        originCurrency: {
          coinDenom: 'XPRT',
          coinMinimalDenom: 'uxprt',
          coinDecimals: 6,
          coinGeckoId: 'persistence',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/xprt.png'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      }
    ],
    gaugeIds: ['2109'],
    incentiveDenom:
      'ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293'
  },
  {
    poolId: '613',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'vidulum',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/vdl.svg',
        coinMinimalDenom:
          'ibc/E7B35499CFBEB0FF5778127ABA4FB2C4B79A6B8D3D831D4379C4048C238796BD',
        coinDenom: 'VDL',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-124'
          }
        ],
        originChainId: 'vidulum-1',
        originCurrency: {
          coinDenom: 'VDL',
          coinMinimalDenom: 'uvdl',
          coinDecimals: 6,
          coinGeckoId: 'vidulum',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/vdl.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['1982', '2013', '2014'],
    incentiveDenom:
      'ibc/E7B35499CFBEB0FF5778127ABA4FB2C4B79A6B8D3D831D4379C4048C238796BD'
  },
  {
    poolId: '617',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 9,
        coinGeckoId: 'cheqd-network',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cheq.svg',
        coinMinimalDenom:
          'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
        coinDenom: 'CHEQ',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-108'
          }
        ],
        originChainId: 'cheqd-mainnet-1',
        originCurrency: {
          coinDenom: 'CHEQ',
          coinMinimalDenom: 'ncheq',
          coinDecimals: 9,
          coinGeckoId: 'cheqd-network',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cheq.svg'
        }
      }
    ],
    gaugeIds: ['2125', '2126'],
    incentiveDenom:
      'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA'
  },
  {
    poolId: '618',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:udsm',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/dsm.svg',
        coinMinimalDenom:
          'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
        coinDenom: 'DSM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-135'
          }
        ],
        originChainId: 'desmos-mainnet',
        originCurrency: {
          coinDenom: 'DSM',
          coinMinimalDenom: 'udsm',
          coinDecimals: 6,
          coinGeckoId: 'pool:udsm',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/dsm.svg'
        }
      }
    ],
    gaugeIds: ['2004', '2005', '2006'],
    incentiveDenom:
      'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C'
  },
  {
    poolId: '619',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:udsm',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/dsm.svg',
        coinMinimalDenom:
          'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
        coinDenom: 'DSM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-135'
          }
        ],
        originChainId: 'desmos-mainnet',
        originCurrency: {
          coinDenom: 'DSM',
          coinMinimalDenom: 'udsm',
          coinDecimals: 6,
          coinGeckoId: 'pool:udsm',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/dsm.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2007', '2008', '2009'],
    incentiveDenom:
      'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C'
  },
  {
    poolId: '621',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:udig',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/dig.png',
        coinMinimalDenom:
          'ibc/307E5C96C8F60D1CBEE269A9A86C0834E1DB06F2B3788AE4F716EDB97A48B97D',
        coinDenom: 'DIG',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-128'
          }
        ],
        originChainId: 'dig-1',
        originCurrency: {
          coinDenom: 'DIG',
          coinMinimalDenom: 'udig',
          coinDecimals: 6,
          coinGeckoId: 'pool:udig',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/dig.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2020'],
    incentiveDenom:
      'ibc/307E5C96C8F60D1CBEE269A9A86C0834E1DB06F2B3788AE4F716EDB97A48B97D'
  },
  {
    poolId: '637',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:udarc',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/darc.svg',
        coinMinimalDenom:
          'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
        coinDenom: 'DARC',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-171'
          }
        ],
        originChainId: 'darchub',
        originCurrency: {
          coinDenom: 'DARC',
          coinMinimalDenom: 'udarc',
          coinDecimals: 6,
          coinGeckoId: 'pool:udarc',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/darc.svg'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2258', '2259', '2260'],
    incentiveDenom:
      'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593'
  },
  {
    poolId: '638',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:udarc',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/darc.svg',
        coinMinimalDenom:
          'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
        coinDenom: 'DARC',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-171'
          }
        ],
        originChainId: 'darchub',
        originCurrency: {
          coinDenom: 'DARC',
          coinMinimalDenom: 'udarc',
          coinDecimals: 6,
          coinGeckoId: 'pool:udarc',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/darc.svg'
        }
      }
    ],
    gaugeIds: ['2261', '2262', '2263'],
    incentiveDenom:
      'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593'
  },
  {
    poolId: '641',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uumee',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png',
        coinMinimalDenom:
          'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
        coinDenom: 'UMEE',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-184'
          }
        ],
        originChainId: 'umee-1',
        originCurrency: {
          coinDenom: 'UMEE',
          coinMinimalDenom: 'uumee',
          coinDecimals: 6,
          coinGeckoId: 'pool:uumee',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2129', '2130', '2131'],
    incentiveDenom:
      'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C'
  },
  {
    poolId: '642',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uumee',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png',
        coinMinimalDenom:
          'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
        coinDenom: 'UMEE',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-184'
          }
        ],
        originChainId: 'umee-1',
        originCurrency: {
          coinDenom: 'UMEE',
          coinMinimalDenom: 'uumee',
          coinDecimals: 6,
          coinGeckoId: 'pool:uumee',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'terrausd',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png',
        coinMinimalDenom:
          'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
        coinDenom: 'UST',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-72'
          }
        ],
        originChainId: 'columbus-5',
        originCurrency: {
          coinDenom: 'UST',
          coinMinimalDenom: 'uusd',
          coinDecimals: 6,
          coinGeckoId: 'terrausd',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/ust.png'
        }
      }
    ],
    gaugeIds: ['2269', '2270', '2271'],
    incentiveDenom:
      'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C'
  },
  {
    poolId: '643',
    currencies: [
      {
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg',
        coinMinimalDenom:
          'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
        coinDenom: 'ATOM',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-0'
          }
        ],
        originChainId: 'cosmoshub-4',
        originCurrency: {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/cosmos.svg'
        }
      },
      {
        coinDecimals: 6,
        coinGeckoId: 'pool:uumee',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png',
        coinMinimalDenom:
          'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
        coinDenom: 'UMEE',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-184'
          }
        ],
        originChainId: 'umee-1',
        originCurrency: {
          coinDenom: 'UMEE',
          coinMinimalDenom: 'uumee',
          coinDecimals: 6,
          coinGeckoId: 'pool:uumee',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/umee.png'
        }
      }
    ],
    gaugeIds: ['2266', '2267', '2268'],
    incentiveDenom:
      'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C'
  },
  {
    poolId: '648',
    currencies: [
      {
        coinDecimals: 18,
        coinGeckoId: 'pstake-finance',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/pstake.png',
        coinMinimalDenom:
          'ibc/8061A06D3BD4D52C4A28FFECF7150D370393AF0BA661C3776C54FF32836C3961',
        coinDenom: 'PSTAKE (channel-4)',
        paths: [
          {
            portId: 'transfer',
            channelId: 'channel-4'
          },
          {
            portId: 'transfer',
            channelId: 'channel-38'
          }
        ],
        originChainId: 'gravity-bridge-3',
        originCurrency: {
          coinDenom: 'PSTAKE',
          coinMinimalDenom: 'gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006',
          coinDecimals: 18,
          coinGeckoId: 'pstake-finance',
          coinImageUrl: 'http://localhost:8080/public/assets/tokens/pstake.png'
        }
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl: 'http://localhost:8080/public/assets/tokens/osmosis.svg'
      }
    ],
    gaugeIds: ['2272'],
    incentiveDenom:
      'ibc/8061A06D3BD4D52C4A28FFECF7150D370393AF0BA661C3776C54FF32836C3961'
  }
];

export const useFilteredExtraIncentivePools = () => {
  return extraIncentivePools;
};
