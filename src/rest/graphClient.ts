import { network } from 'config/networks';
import { gql, GraphQLClient } from 'graphql-request';

export const INDEXER_V3_URL = network.indexer_v3 ?? 'https://staging-ammv3-indexer.oraidex.io/';
export const graphqlClient = new GraphQLClient(INDEXER_V3_URL);

export const getFeeClaimData = async (address: string) => {
  try {
    const document = gql`
        {
          query {
            positions(filter: { ownerId: { equalTo: "${address}" } }) {
              nodes {
                id
                poolId
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

export const getFeeDailyData = async (dayIndex: number): Promise<FeeDailyData[]> => {
  try {
    const document = gql`
      {
        query {
          poolDayData(filter: { dayIndex: { equalTo: ${dayIndex} } }) {
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
