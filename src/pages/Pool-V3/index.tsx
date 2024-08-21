import SearchLightSvg from 'assets/images/search-light-svg.svg';
import SearchSvg from 'assets/images/search-svg.svg';
import classNames from 'classnames';
import useTheme from 'hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CreateNewPool from './components/CreateNewPool';
import PoolList from './components/PoolList';
import PositionList from './components/PositionList';
import { useGetPoolList } from './hooks/useGetPoolList';
import styles from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';

export enum PoolV3PageType {
  POOL = 'pools',
  POSITION = 'positions'
}

type TabRender = {
  id: PoolV3PageType;
  value: string;
  content: React.FC;
};

const listTab = Object.values(PoolV3PageType);
const listTabRender: TabRender[] = [
  { id: PoolV3PageType.POOL, value: 'Pools', content: PoolList },
  { id: PoolV3PageType.POSITION, value: 'Your LPs', content: PositionList }
];

const PoolV3 = () => {
  const theme = useTheme();
  const [prices,] = useConfigReducer('coingecko');
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const type = searchParams.get('type') as PoolV3PageType;
  const [search, setSearch] = useState<string>();
  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;
  const { poolList } = useGetPoolList(prices);

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
                {e.value}
              </Link>
            );
          })}
        </div>

        {type === PoolV3PageType.POOL && (
          <div className={styles.right}>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="Search pool"
                value={search}
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
                style={{
                  paddingLeft: 40,
                  backgroundImage: `url(${bgUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '16px center'
                }}
              />
            </div>
            <CreateNewPool pools={poolList} />
          </div>
        )}
      </div>
      <div className={classNames(styles.content, styles[theme], styles[type])}>
        {Content && <Content search={search} />}
      </div>
    </div>
  );
};

export default PoolV3;
