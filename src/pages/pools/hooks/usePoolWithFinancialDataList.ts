//@ts-nocheck

import { Dec } from '@keplr-wallet/unit';
import { PricePretty } from '@keplr-wallet/unit/build/price-pretty';
import { useMemo } from 'react';

export function usePoolWithFinancialDataList() {
  const { chainStore, queriesStore, priceStore } = {};
  //   const queries = queriesStore.get(chainStore.current.chainId);
  const queries = { osmosis: {} }; // queriesStore.get(chainStore.current.chainId);

  //   const pools = queries.osmosis.queryGammPools.getPoolsDescendingOrderTVL(
  //     priceStore,
  //     priceStore.getFiatCurrency('usd')!
  //   );
  const pools = [
    {
      id: '1',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '3000000000000000'
        }
      }
    },
    {
      id: '560',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '2000000000000000'
        }
      }
    },
    {
      id: '561',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '2000000000000000'
        }
      }
    },
    {
      id: '497',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '3000000000000000'
        }
      }
    },
    {
      id: '604',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '3000000000000000'
        }
      }
    },
    {
      id: '584',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '2000000000000000'
        }
      }
    },
    {
      id: '2',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '5000000000000000'
        }
      }
    },
    {
      id: '605',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '2000000000000000'
        }
      }
    },
    {
      id: '9',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '2000000000000000'
        }
      }
    },
    {
      id: '601',
      swapFee: {
        floatingDecimalPointRight: 2,
        _options: {
          maxDecimals: 4,
          trim: true,
          shrink: false,
          ready: true,
          locale: true,
          inequalitySymbol: false,
          inequalitySymbolSeparator: ' '
        },
        dec: {
          int: '3000000000000000'
        }
      }
    }
  ];
  const poolFinancialDataByPoolId = {
    status: 'loading',
    isLoading: true,
    isSuccess: false,
    isError: false,
    isIdle: false,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: true,
    isLoadingError: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isStale: true
  };

  const fiat = {
    currency: 'usd',
    symbol: '$',
    maxDecimals: 2,
    locale: 'en-US'
  };

  return useMemo(() => {
    return pools.map((pool) => {
      const volume24hRaw =
        poolFinancialDataByPoolId.data?.[pool.id]?.[0]?.volume_24h;
      /**
       * Sometimes, the volume24h has the decimals greater than 18.
       * In this case, the `Dec` type can't handle such big decimals.
       * So, must truncate the decimals with `toFixed()` method.
       * */
      const volume24h =
        volume24hRaw != null
          ? new PricePretty(
              //   priceStore.getFiatCurrency('usd')!,
              fiat,
              new Dec(volume24hRaw.toFixed(10))
            ).toString()
          : '...';
      //   const tvl = pool.computeTotalValueLocked(
      //     priceStore,
      //     // priceStore.getFiatCurrency('usd')!
      //     'usd'
      //   );
      const tvl = new PricePretty(fiat, new Dec(0));
      const swapFee = `${pool.swapFee.toString()}%`;
      return { pool, volume24h, tvl, swapFee };
    });
  }, [pools, poolFinancialDataByPoolId.data, priceStore]);
}
