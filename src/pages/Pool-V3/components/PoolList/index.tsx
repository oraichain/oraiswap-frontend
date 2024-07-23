import SearchLightSvg from 'assets/images/search-light-svg.svg';
import SearchSvg from 'assets/images/search-svg.svg';
import useTheme from 'hooks/useTheme';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useState } from 'react';
import styles from './index.module.scss';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as OraixIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';

const PoolList = () => {
  const [theme] = useTheme();
  const [search, setSearch] = useState<string>();
  const [list, setList] = useState<any[]>([...Array(9)]);
  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;

  return (
    <div className={styles.poolList}>
      <div className={styles.headerTable}>
        <div className={styles.total}>
          <p>Total liquidity</p>
          <h1>{formatDisplayUsdt(29512.16)}</h1>
        </div>
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
      </div>
      <div className={styles.list}>
        {[list]?.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Pool name</th>
                  <th>Liquidity</th>
                  <th>Volume (24H)</th>
                  <th>APR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, index) => {
                  return <PoolItemTData item={item} key={`${index}-pool-${item?.id}`} theme={theme} />;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.nodata}>
            {theme === 'light' ? <NoData /> : <NoDataDark />}
            <span>No Pools!</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PoolItemTData = ({ item, key, theme }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  return (
    <tr className={styles.item} key={key}>
      <td>
        <div className={styles.name}>
          <div className={styles.icons}>
            <OraixIcon />
            <UsdtIcon />
          </div>
          <span>ORAIX / USDT</span>

          <div>
            <span className={styles.fee}>Fee: 0.003%</span>
          </div>
        </div>
      </td>
      <td>
        <span className={styles.amount}>{formatDisplayUsdt(1232343)}</span>
      </td>
      <td>
        <span className={styles.amount}>{formatDisplayUsdt(1348)}</span>
      </td>
      <td>
        <div className={styles.apr}>
          <span className={styles.amount}>{formatDisplayUsdt(1348)}</span>

          <TooltipIcon
            placement="top"
            visible={openTooltip}
            icon={<IconInfo />}
            setVisible={setOpenTooltip}
            content={
              <div className={classNames(styles.tooltip, styles[theme])}>
                <div className={styles.itemInfo}>
                  <span>Swap fee</span>
                  <span>{numberWithCommas(11.91)}%</span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    ORAI Boost &nbsp; <IconBoots />
                  </span>
                  <span>{numberWithCommas(11.91)}%</span>
                </div>
                <div className={styles.itemInfo}>
                  <span>Total APR</span>
                  <span className={styles.totalApr}>{numberWithCommas(11.91)}%</span>
                </div>
              </div>
            }
          />
        </div>
      </td>
      <td>
        <Link to="/new-position/ORAIX/USDT/0.01">Add Position</Link>
      </td>
    </tr>
  );
};

export default PoolList;
