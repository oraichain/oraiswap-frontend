import { useState } from 'react';
import styles from './index.module.scss';
import PositionItem from '../PositionItem';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import useTheme from 'hooks/useTheme';
import { useEffect } from 'react';
import useConfigReducer from 'hooks/useConfigReducer';
import { convertPosition } from 'pages/Pool-V3/helpers/helper';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import LoadingBox from 'components/LoadingBox';
import { gql, request, GraphQLClient } from 'graphql-request';

export const getFeeClaimData = async (address: string) => {
  try {
    // https://subql-staging.orai.io/
    const endpoint = `https://staging-ammv3-indexer.oraidex.io/`;
    const client = new GraphQLClient(endpoint);

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
                    amountXInUSD
                    amountYInUSD
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

    // return MOCK_DATA;

    const result = await client.request<any>(document);

    const data = result.query.positions.nodes;

    return data || [];
  } catch (error) {
    console.log('error', error);
    return [];
  }
};

const PositionList = () => {
  const theme = useTheme();

  const isLight = theme === 'light';

  const [cachePrices] = useConfigReducer('coingecko');
  const [address] = useConfigReducer('address');

  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feeClaimData, setFeeClaimData] = useState([]);
  const [statusRemove, setStatusRemove] = useState<boolean>(undefined);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!address) return setDataPosition([]);

        const [positions, poolsData, feeClaimData] = await Promise.all([
          SingletonOraiswapV3.getAllPosition(address),
          SingletonOraiswapV3.getPools(),
          getFeeClaimData(address)
        ]);

        const positionsMap = convertPosition({
          positions: positions.map((po, ind) => ({ ...po, ind })),
          poolsData,
          cachePrices,
          address,
          isLight,
          feeClaimData
        });

        setDataPosition(positionsMap);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
        setStatusRemove(false);
      }
    })();

    return () => {};
  }, [address, statusRemove]);

  return (
    <div className={styles.positionList}>
      <LoadingBox loading={loading} styles={{ minHeight: '60vh', height: 'fit-content' }}>
        {dataPosition.length
          ? dataPosition.map((position, key) => {
              return (
                <div className={styles.item} key={`position-list-item-${key}`}>
                  <PositionItem position={position} setStatusRemove={setStatusRemove} />
                </div>
              );
            })
          : !loading && (
              <div className={styles.nodata}>
                {theme === 'light' ? <NoData /> : <NoDataDark />}
                <span>No Positions!</span>
              </div>
            )}
      </LoadingBox>
    </div>
  );
};

export default PositionList;

export const MOCK_DATA = [
  {
    id: 'orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100-84',
    poolId: 'orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100',
    principalAmountX: '500000',
    principalAmountY: '1126302',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: '0A8B981EC18080CA491EB23E18A571439B0902FA222D18F5D3B17EAADDC2DCF4-claimFee-orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100-84-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '1661'
              }
            ]
          }
        },
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '312',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: '446866EC0563851CF86AAF935601DD1F3E74DBC780820C8BF0B243DDD3EE3891-claimFee-orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100-84-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '398576'
              }
            ]
          }
        },
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '33',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: 'D5FB1C6E77640D4CD6EDC313BA043866D6A5C535282929861523F4B4C345C3AB-claimFee-orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100-84-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '164764'
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-3000000000-100-154',
    poolId: 'orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-3000000000-100',
    principalAmountX: '100000',
    principalAmountY: '532732',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: '0E4913310390F391E21C47BE68F24F907DF9845F82466EC25AC00A3073F71D9B-claimFee-orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-3000000000-100-154-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '7777'
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-3000000000-100-17',
    poolId:
      'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-3000000000-100',
    principalAmountX: '387330',
    principalAmountY: '1143314',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-160',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '100000',
    principalAmountY: '539684344',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-500000000-10-52',
    poolId:
      'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-500000000-10',
    principalAmountX: '70374',
    principalAmountY: '119972',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-98',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '93072',
    principalAmountY: '105354416',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '169',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: '73D98E5910363AA2DD25AFCA680E405AF84EDF757E3B8E0B8F12AD833FD97A8B-claimFee-orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-98-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '240408'
              }
            ]
          }
        },
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: []
          }
        }
      ]
    }
  },
  {
    id: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-500000000-10-70',
    poolId:
      'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-500000000-10',
    principalAmountX: '1982821',
    principalAmountY: '2241197',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '6',
          claimFeeIncentiveTokens: {
            nodes: []
          }
        }
      ]
    }
  },
  {
    id: 'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/ton-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-153',
    poolId:
      'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/ton-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '1000000000',
    principalAmountY: '1543494902',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '2450494',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: []
          }
        }
      ]
    }
  },
  {
    id: 'orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-3000000000-100-156',
    poolId: 'orai-orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd-3000000000-100',
    principalAmountX: '1000000',
    principalAmountY: '4345107',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-100000000-1-81',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-100000000-1',
    principalAmountX: '10000',
    principalAmountY: '26756',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-100000000-1-90',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-100000000-1',
    principalAmountX: '100',
    principalAmountY: '146',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-88',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '100',
    principalAmountY: '113198',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: '97F86751A2C900A988ABC482CA50687C4F31AF6BF0B76E200B4640EF66C2FD86-claimFee-orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-88-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '40'
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-3000000000-100-18',
    poolId:
      'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-orai1hn8w33cqvysun2aujk5sv33tku4pgcxhhnsxmvnkfvdxagcx0p8qa4l98q-3000000000-100',
    principalAmountX: '387325',
    principalAmountY: '1143314',
    fees: {
      nodes: []
    }
  },
  {
    id: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-91',
    poolId: 'orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '1',
    principalAmountY: '11560',
    fees: {
      nodes: [
        {
          amountXInUSD: null,
          amountYInUSD: null,
          amountX: '0',
          amountY: '0',
          claimFeeIncentiveTokens: {
            nodes: [
              {
                id: 'E8DAFABA05274A0A736B704AE2E681A9F823783B6CB2E275F1B071DFC89371E3-claimFee-orai-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-91-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                tokenId: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                token: {
                  id: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  denom: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                  name: 'ORAIX',
                  logo: 'https://i.ibb.co/VmMJtf7/oraix.png'
                },
                rewardAmount: '6'
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/ton-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100-152',
    poolId:
      'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/ton-orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge-3000000000-100',
    principalAmountX: '10000000',
    principalAmountY: '15434950',
    fees: {
      nodes: []
    }
  }
];
