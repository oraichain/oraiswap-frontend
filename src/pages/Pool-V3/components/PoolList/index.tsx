import { BigDecimal, toDisplay } from '@oraichain/oraidex-common';
import Loading from 'assets/gif/loading.gif';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import SearchLightSvg from 'assets/images/search-light-svg.svg';
import SearchSvg from 'assets/images/search-svg.svg';
import classNames from 'classnames';
import { TooltipIcon } from 'components/Tooltip';
import { network } from 'config/networks';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useTheme from 'hooks/useTheme';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { getCosmWasmClient } from 'libs/cosmjs';
import { formatPoolData } from 'pages/Pool-V3/helpers/format';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const PoolList = () => {
  const { data: prices } = useCoinGeckoPrices();
  const theme = useTheme();
  const [search, setSearch] = useState<string>();
  const [liquidity, setLiquidity] = useState<Record<string, number>>({});
  const [totalLiquidity, setTotalLiquidity] = useState<number>();
  const [dataPool, setDataPool] = useState([...Array(0)]);
  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;

  useEffect(() => {
    (async () => {
      try {
        const pools = await SingletonOraiswapV3.getPools();

        const fmtPools = (pools || []).map((p) => {
          const isLight = theme === 'light';
          return formatPoolData(p, isLight);
        });

        setDataPool(fmtPools);
      } catch (error) {
        console.log('error: get pools', error);
      }
    })();

    return () => {};
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (dataPool.length) {
          const liquidityByPools = await SingletonOraiswapV3.getPoolLiquidities(dataPool, prices);

          setLiquidity(liquidityByPools);

          const totalLiq = Object.values(liquidityByPools).reduce((acc, cur) => {
            acc = acc.add(cur || 0);
            return acc;
          }, new BigDecimal(0));

          setTotalLiquidity(totalLiq.toNumber());
        }
      } catch (error) {
        console.log('error: get liquidities', error);
      }
    })();
  }, [dataPool]);

  return (
    <div className={styles.poolList}>
      <div className={styles.headerTable}>
        <div className={styles.total}>
          <p>Total liquidity</p>
          {totalLiquidity === 0 || totalLiquidity ? (
            <h1>{formatDisplayUsdt(totalLiquidity || 0)}</h1>
          ) : (
            <img src={Loading} alt="loading" width={32} height={32} />
          )}
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
        {dataPool?.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Pool name</th>
                  <th className={styles.textRight}>Liquidity</th>
                  {/* <th className={styles.textRight}>Volume (24H)</th> */}
                  <th className={styles.textRight}>APR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataPool
                  .filter((p) => {
                    if (!search) return true;

                    const { tokenXinfo, tokenYinfo } = p;

                    return (
                      (tokenXinfo && tokenXinfo.name.toLowerCase().includes(search.toLowerCase())) ||
                      (tokenYinfo && tokenYinfo.name.toLowerCase().includes(search.toLowerCase()))
                    );
                  })
                  .map((item, index) => {
                    return (
                      <tr className={styles.item} key={`${index}-pool-${item?.id}`}>
                        <PoolItemTData item={item} theme={theme} liquidity={liquidity[item?.poolKey]} />
                      </tr>
                    );
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

const PoolItemTData = ({ item, theme, liquidity }) => {
  const [openTooltip, setOpenTooltip] = useState(false);
  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const navigate = useNavigate();
  const { FromTokenIcon, ToTokenIcon, feeTier, tokenXinfo, tokenYinfo, poolKey } = item;

  return (
    <>
      <td>
        <div className={styles.name} onClick={() => navigate(`/pools-v3/${poolKey}`)}>
          <div className={classNames(styles.icons, styles[theme])}>
            <FromTokenIcon />
            <ToTokenIcon />
          </div>
          <span>
            {tokenXinfo?.name} / {tokenYinfo?.name}
          </span>

          <div>
            <span className={styles.fee}>Fee: {toDisplay(BigInt(feeTier), 10)}%</span>
          </div>
        </div>
      </td>
      <td className={styles.textRight}>
        <span className={classNames(styles.amount, { [styles.loading]: !liquidity })}>
          {liquidity === 0 || liquidity ? (
            formatDisplayUsdt(liquidity)
          ) : (
            <img src={Loading} alt="loading" width={30} height={30} />
          )}
        </span>
      </td>
      {/* <td className={styles.textRight}>
        <span className={styles.amount}>{formatDisplayUsdt(1348)}</span>
      </td> */}
      <td>
        <div className={styles.apr}>
          <span className={styles.amount}>{numberWithCommas(13.48)}%</span>

          <TooltipIcon
            className={styles.tooltipWrapper}
            placement="top"
            visible={openTooltip}
            icon={<IconInfo />}
            setVisible={setOpenTooltip}
            content={
              <div className={classNames(styles.tooltip, styles[theme])}>
                <div className={styles.itemInfo}>
                  <span>Swap fee</span>
                  <span className={styles.value}>{numberWithCommas(11.91)}%</span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    ORAI Boost&nbsp;
                    <IconBoots />
                  </span>
                  <span className={styles.value}>{numberWithCommas(11.91)}%</span>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/new-position/${item.pool_key.token_x}-${item.pool_key.token_y}-${item.pool_key.fee_tier.fee}`);
          }}
          className={styles.add}
        >
          Add Position
        </button>
      </td>
    </>
  );
};

export default PoolList;
