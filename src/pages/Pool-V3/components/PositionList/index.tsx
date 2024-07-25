import { useState } from 'react';
import styles from './index.module.scss';
import PositionItem from '../PositionItem';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import useTheme from 'hooks/useTheme';

const PositionList = () => {
  const theme = useTheme();
  const [list, setList] = useState<any[]>([...Array(10)]);

  return (
    <div className={styles.positionList}>
      {list.length ? (
        list.map((item, key) => {
          return (
            <div className={styles.item} key={`position-list-item-${key}`}>
              <PositionItem item={item} />
            </div>
          );
        })
      ) : (
        <div className={styles.nodata}>
          {theme === 'light' ? <NoData /> : <NoDataDark />}
          <span>No Positions!</span>
        </div>
      )}
    </div>
  );
};

export default PositionList;
