import { isMobile } from '@walletconnect/browser-utils';
import classNames from 'classnames';
import useTheme from 'hooks/useTheme';
import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PoolList from './components/PoolList';
import PositionList from './components/PositionList';
import WrappedStats from './components/Statistics/WrappedStats/WrappedStats';
import styles from './index.module.scss';

export enum PoolV3PageType {
  POOL = 'pools',
  POSITION = 'positions',
  // STAT = 'stats'
}

type TabRender = {
  id: PoolV3PageType;
  value: string;
  content: React.FC;
};

const listTab = Object.values(PoolV3PageType);
const listTabRender: TabRender[] = [
  { id: PoolV3PageType.POOL, value: 'Pools', content: PoolList },
  { id: PoolV3PageType.POSITION, value: 'My positions', content: PositionList },
  // { id: PoolV3PageType.STAT, value: 'Stats', content: WrappedStats }
];

const PoolV3 = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const type = searchParams.get('type') as PoolV3PageType;
  const mobileMode = isMobile();

  useEffect(() => {
    if (!listTab.includes(type)) {
      navigate(`/pools-v3?type=${PoolV3PageType.POOL}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const Content = listTabRender.find((tab) => tab.id === type)?.content ?? PoolList;

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
                {!mobileMode ? e.value : e.value === 'Your Liquidity Positions' ? 'Your Positions' : e.value}
              </Link>
            );
          })}
        </div>
      </div>
      <div className={classNames(styles.content, styles[theme], styles[type])}>{Content && <Content />}</div>
    </div>
  );
};

export default PoolV3;
