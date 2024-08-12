import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import LoadingBox from 'components/LoadingBox';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { convertPosition } from 'pages/Pool-V3/helpers/helper';
import { useEffect, useState } from 'react';
import { getFeeClaimData } from 'rest/graphClient';
import PositionItem from '../PositionItem';
import styles from './index.module.scss';
import { useGetPositions } from 'pages/Pool-V3/hooks/useGetPosition';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';

const PositionList = () => {
  const theme = useTheme();

  const isLight = theme === 'light';

  const [cachePrices] = useConfigReducer('coingecko');
  const [address] = useConfigReducer('address');

  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusRemove, setStatusRemove] = useState<boolean>(undefined);
  const { positions } = useGetPositions(address);
  const { poolList } = useGetPoolList();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!address) return setDataPosition([]);

        const feeClaimData= await getFeeClaimData(address)

        const positionsMap = convertPosition({
          positions: positions.map((po, ind) => ({ ...po, ind })),
          poolsData: poolList,
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
  }, [address, poolList, positions]);

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
