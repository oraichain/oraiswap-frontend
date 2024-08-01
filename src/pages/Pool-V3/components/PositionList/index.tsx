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
    return [];
    // https://subql-staging.orai.io/
    const endpoint = `http://10.10.20.72:3000/`;
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
                    amountUSD
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

    const result = await client.request<any>(document);

    console.log('result', result);

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
  const [indexRemove, setInRemoveSuccess] = useState<boolean>(undefined);

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
      }
    })();

    return () => {};
  }, [address]);

  return (
    <div className={styles.positionList}>
      <LoadingBox loading={loading} styles={{ height: '60vh' }}>
        {dataPosition.length
          ? dataPosition
              .filter((data) => (indexRemove === undefined ? data : data.id !== indexRemove))
              .map((position, key) => {
                return (
                  <div className={styles.item} key={`position-list-item-${key}`}>
                    <PositionItem position={position} setInRemoveSuccess={setInRemoveSuccess} />
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
