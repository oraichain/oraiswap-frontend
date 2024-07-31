import { useState } from 'react';
import styles from './index.module.scss';
import PositionItem from '../PositionItem';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import useTheme from 'hooks/useTheme';
import { useEffect } from 'react';
import useConfigReducer from 'hooks/useConfigReducer';
import { oraichainTokens } from 'config/bridgeTokens';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import {
  PERCENTAGE_SCALE,
  calcYPerXPriceByTickIndex,
  calculateTokenAmounts,
  convertPosition,
  getConvertedPool,
  getConvertedPosition
} from 'pages/Pool-V3/helpers/helper';
import { printBigint } from '../PriceRangePlot/utils';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import LoadingBox from 'components/LoadingBox';
import { getIconPoolData } from 'pages/Pool-V3/helpers/format';

const PositionList = () => {
  const theme = useTheme();
  const [dataPosition, setDataPosition] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [address] = useConfigReducer('address');
  const isLight = theme === 'light';
  const [cachePrices] = useConfigReducer('coingecko');
  const [indexRemove, setInRemoveSuccess] = useState<boolean>(undefined);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!address) return setDataPosition([]);

        const [positions, poolsData] = await Promise.all([
          SingletonOraiswapV3.getAllPosition(address),
          SingletonOraiswapV3.getPools()
        ]);

        const positionsMap = convertPosition({
          positions,
          poolsData,
          cachePrices,
          address,
          isLight
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
