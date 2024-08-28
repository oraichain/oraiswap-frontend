import { network } from 'config/networks';
import { gql, GraphQLClient } from 'graphql-request';

export const INDEXER_V3_URL = network.indexer_v3 ?? 'https://staging-ammv3-indexer.oraidex.io/';
export const graphqlClient = new GraphQLClient(INDEXER_V3_URL);

export const HOURS_PER_DAY = 24;
export const MILIS_PER_HOUR = 60 * 60 * 1000;
export const MILIS_PER_DAY = HOURS_PER_DAY * MILIS_PER_HOUR;

export const getFeeClaimData = async (address: string) => {
  try {
    const document = gql`
        {
          query {
            positions(
                filter: {
                    ownerId: { equalTo: "${address}" }
                    status: { equalTo: true }
                }
            ) {
                nodes {
                    id
                    poolId
                    status
                    principalAmountX
                    principalAmountY
                    fees {
                        nodes {
                            amountInUSD
                            amountX
                            amountY
                            claimFeeIncentiveTokens {
                                nodes {
                                    id
                                    tokenId
                                    token {
                                        id
                                        denom
                                        name
                                        logo
                                    }
                                    rewardAmount
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      `;
    const result = await graphqlClient.request<any>(document);
    return result.query.positions.nodes || [];
  } catch (error) {
    console.log('error', error);
    return [];
  }
};

export type PoolDayDataV3 = {
  keys: string[];
  sum: {
    tvlUSD: number;
    volumeInUSD: number;
    feesInUSD: number;
  };
};

export type PoolDayDataV3Raw = {
  query: {
    poolDayData: {
      groupedAggregates: PoolDayDataV3[];
    };
  };
};

export const getPoolDayDataV3 = async () => {
  try {
    const document = gql`
      {
        query {
          poolDayData {
            groupedAggregates(groupBy: DAY_INDEX) {
              keys
              sum {
                tvlUSD
                volumeInUSD
                feesInUSD
              }
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<PoolDayDataV3Raw>(document);
    return result.query.poolDayData.groupedAggregates || [];
  } catch (error) {
    console.log('error getPoolDayDataV3', error);
    return [];
  }
};

export type FeeDailyData = {
  poolId: string;
  tvlUSD: number;
  feesInUSD: number;
};

export const getFeeDailyData = async (): Promise<FeeDailyData[]> => {
  const yesterdayIndex = Math.floor(Date.now() / MILIS_PER_DAY) - 1;
  try {
    const document = gql`
      {
        query {
          poolDayData(filter: { dayIndex: { equalTo: ${yesterdayIndex} } }) {
            nodes {
              poolId
              tvlUSD
              volumeInUSD
              feesInUSD
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.query.poolDayData.nodes || [];
  } catch (error) {
    console.log('error getPoolDayDataV3', error);
    return [];
  }
};

export type PoolLiquidityAndVolume = {
  id: string;
  totalValueLockedInUSD: number;
  poolDayData: {
    aggregates: {
      sum: {
        feesInUSD: number;
        volumeInUSD: number;
      };
    };
  };
};

export const getPoolsLiquidityAndVolume = async (): Promise<PoolLiquidityAndVolume[]> => {
  const yesterdayIndex = Math.floor(Date.now() / MILIS_PER_DAY) - 1;
  try {
    const document = gql`
      query {
        pools {
          nodes {
            id
            totalValueLockedInUSD
            poolDayData(filter: { dayIndex: { equalTo: ${yesterdayIndex} } }) {
              aggregates {
                sum {
                  feesInUSD
                  volumeInUSD
                }
              }
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.pools.nodes || [];
  } catch (error) {
    console.log('error getPoolsLiquidityAndVolume', error);
    return [];
  }
};

export type PoolLiquidityAndVolumeAmount = {
  id: string;
  tokenX: {
    coingeckoId: string;
    decimals: number;
  };
  tokenY: {
    coingeckoId: string;
    decimals: number;
  };
  totalValueLockedInUSD: number;
  totalValueLockedTokenX: number;
  totalValueLockedTokenY: number;
  poolDayData: {
    nodes: {
      volumeTokenX: number;
      volumeTokenY: number;
    }[];
  };
};

export const getPoolsLiqudityAndVolumeAmount = async (): Promise<PoolLiquidityAndVolumeAmount[]> => {
  const yesterdayIndex = Math.floor(Date.now() / MILIS_PER_DAY) - 1;
  try {
    const document = gql`
      query {
        pools {
          nodes {
            id
            tokenX {
                    coingeckoId
                    decimals
                }
                tokenY {
                    coingeckoId
                    decimals
                }
            totalValueLockedInUSD
            totalValueLockedTokenX
            totalValueLockedTokenY
            poolDayData(filter: { dayIndex: { equalTo: ${yesterdayIndex} } }, distinct: [ID]) {
              nodes {
                volumeTokenX
                volumeTokenY
              }
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.pools.nodes || [];
  } catch (error) {
    console.log('error getPoolsLiqudityAndVolumeAmount', error);
    return [];
  }
};

export const getPoolsVolumeByTokenLatest24h = async (): Promise<PoolLiquidityAndVolumeAmount[]> => {
  const currentHour = Math.floor(Date.now() / MILIS_PER_HOUR);
  const twentyHourBefore = currentHour - HOURS_PER_DAY;
  try {
    const document = gql`
      query Pools {
        pools {
          nodes {
            id
            tokenXId
            tokenYId
            tokenX {
              coingeckoId
              decimals
            }
            tokenY {
              coingeckoId
              decimals
            }
            poolHourData(filter: { hourIndex: { greaterThan: ${twentyHourBefore}, lessThanOrEqualTo: ${currentHour} } }, distinct: [ID]) {
              aggregates {
                volume24hByToken: sum {
                  volumeTokenX
                  volumeTokenY
                }
              }
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.pools.nodes || [];
  } catch (error) {
    console.log('error getPoolsLiqudityAndVolumeAmountHourly', error);
    return [];
  }
};

export type PositionInfo = {
  liquidity: string;
  tickLower: number;
  tickUpper: number;
};

export type PoolPositionsInfo = {
  id: string;
  currentTick: number;
  sqrtPrice: string;
  tokenX: {
    coingeckoId: string;
    decimals: number;
  };
  tokenY: {
    coingeckoId: string;
    decimals: number;
  };
  positions: {
    nodes: PositionInfo[];
  };
};

export const getPoolPositionsInfo = async (): Promise<PoolPositionsInfo[]> => {
  try {
    const document = gql`
      {
        query {
          pools {
            nodes {
              id
              currentTick
              sqrtPrice
              tokenX {
                coingeckoId
                decimals
              }
              tokenY {
                coingeckoId
                decimals
              }
              positions(filter: { status: { equalTo: true } }) {
                nodes {
                  liquidity
                  tickLower
                  tickUpper
                }
              }
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    // console.log({ result });
    return result.query.pools.nodes || [];
  } catch (error) {
    console.log('error getPoolPositionsInfo', error);
    return [];
  }
};

export type Pool = {
  id: string;
  currentTick: number;
  liquidity: string;
};

export const getPools = async (): Promise<Pool[]> => {
  try {
    const document = gql`
      {
        query {
          pools {
            nodes {
              id
              currentTick
              liquidity
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.query.pools.nodes || [];
  } catch (error) {
    console.log('error getPools', error);
    return [];
  }
};

export type PoolDetail = {
  id: string;
  tokenX: {
    id: string;
    decimals: number;
    coingeckoId: string;
  };
  tokenY: {
    id: string;
    decimals: number;
    coingeckoId: string;
  };
  totalValueLockedTokenX: string;
  totalValueLockedTokenY: string;
  totalValueLockedInUSD: string;
};

export const getPoolDetail = async (poolId: string): Promise<PoolDetail> => {
  try {
    const document = gql`
      {
        query {
          pools(
            filter: {
              id: { equalTo: "${poolId}" }
            }
            first: 1
          ) {
            nodes {
              id
              tokenX {
                id
                decimals
                coingeckoId
              }
              tokenY {
                id
                decimals
                coingeckoId
              }
              totalValueLockedTokenX
              totalValueLockedTokenY
              totalValueLockedInUSD
            }
          }
        }
      }
    `;
    const result = await graphqlClient.request<any>(document);
    return result.query.pools.nodes[0] || null;
  } catch (error) {
    console.log('error getPoolDetail', error);
    return null;
  }
};
