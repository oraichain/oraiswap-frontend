import classNames from 'classnames';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PoolList from './components/PoolList';
import PositionList from './components/PositionList';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

export enum PoolV3PageType {
  POOL = 'pools',
  POSITION = 'positions',
  SWAP = 'swap'
}

const listTab = [PoolV3PageType.POOL, PoolV3PageType.POSITION];
const listTabRender = [
  { id: PoolV3PageType.POOL, value: 'Pools' },
  { id: PoolV3PageType.POSITION, value: 'Your Liquidity Positions' }
];

const PageContent = {
  [PoolV3PageType.POOL]: PoolList,
  [PoolV3PageType.POSITION]: PositionList
  // [PoolV3PageType.SWAP]: PositionList
};

const PoolV3 = () => {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') as PoolV3PageType;

  useEffect(() => {
    if (!listTab.includes(type)) {
      navigate(`/pools-v3?type=${PoolV3PageType.POOL}`);
    }
  }, [type]);

  const Content = PageContent[type || PoolV3PageType.POOL];

  return (
    <div className={classNames(styles.poolV3, 'small_container')}>
      <div className={styles.header}>
        <div className={styles.headerTab}>
          {listTabRender.map((e) => {
            return (
              <Link
                to={`/pools-v3?type=${e.id}`}
                key={e.id}
                className={classNames(styles.item, { [styles.active]: type === e.id })}
              >
                {e.value}
              </Link>
            );
          })}
        </div>

        <Link className={styles.swapBtn} to={`/pools-v3/swap`}>
          Swap
        </Link>
      </div>

      <div className={styles.content}>{Content && <Content />}</div>
    </div>
  );
};

export default PoolV3;
