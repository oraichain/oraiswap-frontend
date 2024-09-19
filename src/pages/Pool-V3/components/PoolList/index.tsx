import { BigDecimal, toDisplay } from '@oraichain/oraidex-common';
import Loading from 'assets/gif/loading.gif';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { ReactComponent as SortDownIcon } from 'assets/icons/down_icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as AddLPIcon } from 'assets/icons/addLP_ic.svg';
import { ReactComponent as SortUpIcon } from 'assets/icons/up_icon.svg';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import classNames from 'classnames';
import LoadingBox from 'components/LoadingBox';
import { CoefficientBySort, SortType } from 'components/Table';
import { TooltipIcon } from 'components/Tooltip';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { fetchPoolAprInfo } from 'libs/contractSingleton';
import { formatPoolData } from 'pages/Pool-V3/helpers/format';
import { useGetFeeDailyData } from 'pages/Pool-V3/hooks/useGetFeeDailyData';
import { useGetPoolLiquidityVolume } from 'pages/Pool-V3/hooks/useGetPoolLiquidityVolume';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { useGetPoolPositionInfo } from 'pages/Pool-V3/hooks/useGetPoolPositionInfo';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateNewPosition from '../CreateNewPosition';
import styles from './index.module.scss';
import isEqual from 'lodash/isEqual';
import { Button } from 'components/Button';
import { isMobile } from '@walletconnect/browser-utils';

export enum PoolColumnHeader {
  POOL_NAME = 'Pool name',
  LIQUIDITY = 'Liquidity',
  VOLUME = 'Volume (24h)',
  APR = 'Apr'
}

const PoolList = ({ search }) => {
  const { data: price } = useCoinGeckoPrices();
  const [liquidityPools, setLiquidityPools] = useConfigReducer('liquidityPools');
  const [volumnePools, setVolumnePools] = useConfigReducer('volumnePools');
  const [aprInfo, setAprInfo] = useConfigReducer('aprPools');
  const [openTooltip, setOpenTooltip] = useState(false);
  const mobileMode = isMobile();

  const [sort, setSort] = useState<Record<PoolColumnHeader, SortType>>({
    [PoolColumnHeader.LIQUIDITY]: SortType.DESC
  } as Record<PoolColumnHeader, SortType>);

  const theme = useTheme();

  const [currentPool, setCurrentPool] = useState(null);
  const [isOpenCreatePosition, setIsOpenCreatePosition] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dataPool, setDataPool] = useState([...Array(0)]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const { feeDailyData } = useGetFeeDailyData();
  const { poolList, poolPrice } = useGetPoolList(price);
  const { poolLiquidities, poolVolume } = useGetPoolLiquidityVolume(poolPrice);
  const { poolPositionInfo } = useGetPoolPositionInfo(poolPrice);

  const prevPoolListRef = useRef<any>();
  const prevPoolPriceRef = useRef<any>();

  const formatPoolDataCallback = useCallback(
    (p) => {
      const isLight = theme === 'light';
      return formatPoolData(p, isLight);
    },
    [theme]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        if (!poolList?.length) return;
        if (poolList.length > 0 && isEqual(prevPoolListRef.current, poolList)) return;
        const fmtPools = (poolList || []).map(formatPoolDataCallback).filter((e) => e.isValid);

        setDataPool(fmtPools);
      } catch (error) {
        console.log('error: SingletonOraiswapV3 getPools', error);
      } finally {
        prevPoolListRef.current = poolList ?? [];
        prevPoolPriceRef.current = poolPrice ?? {};
        setLoading(false);
      }
    })();

    return () => {};
  }, [theme, poolList, poolPrice, formatPoolDataCallback]);

  useEffect(() => {
    const getAPRInfo = async () => {
      const res = await fetchPoolAprInfo(dataPool, poolPrice, poolPositionInfo, feeDailyData);
      setAprInfo(res);
    };
    if (dataPool.length && poolPrice && Object.keys(poolPositionInfo).length) {
      getAPRInfo();
    }
  }, [dataPool, Object.keys(poolPositionInfo).length, poolPrice]);

  const [sortField, sortOrder] = Object.entries(sort)[0];

  const handleClickSort = (sortField: PoolColumnHeader) => {
    let newSort = { [sortField]: SortType.DESC } as Record<PoolColumnHeader, SortType>;

    if (sort[sortField] === SortType.DESC) {
      newSort = { [sortField]: SortType.ASC } as Record<PoolColumnHeader, SortType>;
      setSort(newSort);
      sortDataSource(newSort);
      return;
    }

    setSort(newSort);
    sortDataSource(newSort);
  };

  const sortDataSource = (sort: Record<PoolColumnHeader, SortType>) => {
    const [sortField, sortOrder] = Object.entries(sort)[0];

    const sortedData = dataPool
      // .sort((a, b) => (liquidityPools?.[b?.poolKey] || 0) - (liquidityPools?.[a?.poolKey] || 0))
      .map((item) => {
        let volumn = 0;
        if (item?.poolKey) {
          const findPool = volumnePools && volumnePools.find((vo) => vo.poolAddress === item?.poolKey);
          if (findPool) volumn = findPool.volume24;
        }

        return {
          ...item,
          volumn
        };
      })
      .sort((a, b) => {
        switch (sortField) {
          case PoolColumnHeader.LIQUIDITY:
            return (
              Number(CoefficientBySort[sortOrder]) *
              ((poolLiquidities?.[a?.poolKey] || 0) - (poolLiquidities?.[b?.poolKey] || 0))
            );
          case PoolColumnHeader.POOL_NAME:
            return CoefficientBySort[sortOrder] * (a?.tokenXinfo?.name || '').localeCompare(b.tokenXinfo?.name || '');
          case PoolColumnHeader.VOLUME:
            return new BigDecimal(CoefficientBySort[sortOrder]).mul(a.volumn - b.volumn).toNumber();
          case PoolColumnHeader.APR:
            return new BigDecimal(CoefficientBySort[sortOrder])
              .mul((aprInfo?.[a?.poolKey].apr.max || 0) - (aprInfo?.[b?.poolKey].apr.max || 0))
              .toNumber();

          default:
            return 0;
        }
      });

    setDataPool(sortedData);

    return sortedData;
  };

  useEffect(() => {
    if (Object.values(poolVolume).length > 0) {
      const totalVolume24h = Object.values(poolVolume).reduce((acc, cur) => acc + cur, 0);
      setTotalVolume(totalVolume24h);
      setVolumnePools(
        Object.keys(poolVolume).map((poolAddress) => {
          return {
            apy: 0,
            poolAddress,
            fee: 0,
            volume24: poolVolume[poolAddress],
            tokenX: null,
            tokenY: null,
            tvl: null
          };
        })
      );
    }
  }, [poolVolume, dataPool]);

  useEffect(() => {
    if (Object.values(poolLiquidities).length > 0) {
      const totalLiqudity = Object.values(poolLiquidities).reduce((acc, cur) => acc + cur, 0);
      setLiquidityPools(poolLiquidities);
      setTotalLiquidity(totalLiqudity);
    }
  }, [poolLiquidities, dataPool]);

  useEffect(() => {
    if (Object.values(poolLiquidities).length > 0) {
      sortDataSource({
        [PoolColumnHeader.LIQUIDITY]: SortType.DESC
      } as any);
    }
  }, [poolLiquidities]);

  const filteredPool = dataPool.filter((p) => {
    if (!search) return true;

    const { tokenXinfo, tokenYinfo } = p;

    return (
      (tokenXinfo && tokenXinfo.name.toLowerCase().includes(search.toLowerCase())) ||
      (tokenYinfo && tokenYinfo.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const renderList = () => {
    return mobileMode ? (
      <div className={styles.listMobile}>
        <div className={styles.header}>List Pools</div>
        {filteredPool.map((item, index) => {
          return (
            <PoolItemDataMobile
              key={`${index}-item-mobile-${item?.id}`}
              item={item}
              theme={theme}
              volume={poolVolume?.[item?.poolKey] ?? 0}
              liquidity={poolLiquidities?.[item?.poolKey] ?? 0}
              aprInfo={{
                apr: 0,
                incentives: [],
                swapFee: 0,
                incentivesApr: 0,
                ...aprInfo?.[item?.poolKey]
              }}
              setCurrentPool={setCurrentPool}
              setIsOpenCreatePosition={setIsOpenCreatePosition}
            />
          );
        })}
      </div>
    ) : (
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40%' }} onClick={() => handleClickSort(PoolColumnHeader.POOL_NAME)}>
                Pool name
                {sortField === PoolColumnHeader.POOL_NAME &&
                  (sortOrder === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />)}
              </th>
              <th
                style={{ width: '15%' }}
                className={styles.textRight}
                onClick={() => handleClickSort(PoolColumnHeader.LIQUIDITY)}
              >
                Liquidity
                {sortField === PoolColumnHeader.LIQUIDITY &&
                  (sortOrder === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />)}
              </th>
              <th
                style={{ width: '15%' }}
                className={styles.textRight}
                onClick={() => handleClickSort(PoolColumnHeader.VOLUME)}
              >
                Volume (24H)
                {sortField === PoolColumnHeader.VOLUME &&
                  (sortOrder === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />)}
              </th>
              <th
                style={{ width: '15%' }}
                className={classNames(styles.textRight, styles.aprHeader)}
                onClick={() => handleClickSort(PoolColumnHeader.APR)}
              >
                APR
                <TooltipIcon
                  className={styles.tooltipWrapperApr}
                  placement="top"
                  visible={openTooltip}
                  icon={<IconInfo />}
                  setVisible={setOpenTooltip}
                  content={
                    <div className={classNames(styles.tooltipApr, styles[theme])}>
                      <h3 className={styles.titleApr}>How are APRs calculated?</h3>
                      <p className={styles.desc}>
                        All APRs are estimated. They are calculated by taking the average APR for liquidity in the pool.
                      </p>
                      <br />
                      <p className={styles.desc}>
                        In concentrated pools, most users will receive lower rewards. This is due to positions that are
                        more concentrated, which capture more of the incentives.
                      </p>
                    </div>
                  }
                />
                {sortField === PoolColumnHeader.APR && (sortOrder === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />)}
              </th>
              <th style={{ width: '15%' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredPool.map((item, index) => {
              return (
                <tr className={styles.item} key={`${index}-pool-${item?.id}`}>
                  <PoolItemTData
                    item={item}
                    theme={theme}
                    volume={poolVolume?.[item?.poolKey] ?? 0}
                    liquidity={poolLiquidities?.[item?.poolKey] ?? 0}
                    aprInfo={{
                      apr: 0,
                      incentives: [],
                      swapFee: 0,
                      incentivesApr: 0,
                      ...aprInfo?.[item?.poolKey]
                    }}
                    setCurrentPool={setCurrentPool}
                    setIsOpenCreatePosition={setIsOpenCreatePosition}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.poolList}>
      <div className={styles.headerTable}>
        <div className={styles.headerInfo}>
          <div className={styles.total}>
            <p>Total liquidity</p>
            {totalLiquidity === 0 || totalLiquidity ? (
              <h1>{formatDisplayUsdt(Number(totalLiquidity) || 0)}</h1>
            ) : (
              <img src={Loading} alt="loading" width={32} height={32} />
            )}
          </div>
          <div className={styles.total}>
            <p>24H volume</p>
            {totalVolume ? (
              <h1>{formatDisplayUsdt(Number(totalVolume))}</h1>
            ) : (
              <img src={Loading} alt="loading" width={32} height={32} />
            )}
          </div>
        </div>
      </div>
      <LoadingBox loading={loading} styles={{ minHeight: '60vh', height: 'fit-content' }}>
        <div className={styles.list}>
          {filteredPool?.length > 0
            ? renderList()
            : !loading && (
                <div className={styles.nodata}>
                  {theme === 'light' ? <NoData /> : <NoDataDark />}
                  <span>{!dataPool.length ? 'No Pools!' : !filteredPool.length && 'No Matched Pools!'}</span>
                </div>
              )}
        </div>

        {isOpenCreatePosition && currentPool && (
          <CreateNewPosition
            showModal={isOpenCreatePosition}
            setShowModal={setIsOpenCreatePosition}
            pool={currentPool}
          />
        )}
      </LoadingBox>
    </div>
  );
};

const PoolItemTData = ({ item, theme, liquidity, volume, aprInfo, setIsOpenCreatePosition, setCurrentPool }) => {
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState(false);

  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const { FromTokenIcon, ToTokenIcon, feeTier, tokenXinfo, tokenYinfo, poolKey } = item;

  return (
    <>
      <td>
        <div className={styles.name} onClick={() => navigate(`/pools-v3/${encodeURIComponent(poolKey)}`)}>
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
          {liquidity || liquidity === 0 ? (
            formatDisplayUsdt(liquidity)
          ) : (
            <img src={Loading} alt="loading" width={30} height={30} />
          )}
        </span>
      </td>
      <td className={styles.textRight}>
        <span className={styles.amount}>{formatDisplayUsdt(volume)}</span>
      </td>
      <td>
        <div className={styles.apr}>
          <span className={styles.amount}>
            {aprInfo.apr.min === aprInfo.apr.max
              ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
              : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                  maximumFractionDigits: 1
                })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
            %
          </span>
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
                  <span className={styles.value}>
                    {numberWithCommas(aprInfo.swapFee * 100, undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    Incentives Boost&nbsp;
                    <IconBoots />
                  </span>
                  <span className={styles.value}>
                    {aprInfo.incentivesApr.min === aprInfo.incentivesApr.max
                      ? `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.incentivesApr.max * 100, undefined, {
                          maximumFractionDigits: 1
                        })}`}
                    %
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>Total APR</span>
                  <span className={styles.totalApr}>
                    {aprInfo.apr.min === aprInfo.apr.max
                      ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
                    %
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </td>

      <td className={styles.actions}>
        <Button
          className="newPosition"
          type="third-sm"
          onClick={() => {
            setIsOpenCreatePosition(true);
            setCurrentPool(item);
          }}
        >
          Add Position
        </Button>
      </td>
    </>
  );
};

const PoolItemDataMobile = ({ item, theme, liquidity, volume, aprInfo, setIsOpenCreatePosition, setCurrentPool }) => {
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState(false);

  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
  const { FromTokenIcon, ToTokenIcon, feeTier, tokenXinfo, tokenYinfo, poolKey } = item;

  return (
    <div className={styles.mobilePoolItem}>
      <div className={classNames(styles.itemMobile, styles.flexStart)}>
        <div className={styles.name} onClick={() => navigate(`/pools-v3/${encodeURIComponent(poolKey)}`)}>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              <FromTokenIcon />
              <ToTokenIcon />
            </div>
            <span>
              {tokenXinfo?.name} / {tokenYinfo?.name}
            </span>
          </div>

          <div>
            <span className={styles.fee}>Fee: {toDisplay(BigInt(feeTier), 10)}%</span>
          </div>
        </div>
        <div
          title="Add Position"
          className={classNames('newPosition')}
          onClick={() => {
            setIsOpenCreatePosition(true);
            setCurrentPool(item);
          }}
        >
          <AddLPIcon />
        </div>
      </div>
      <div className={styles.itemMobile}>
        <div className={styles.label}>Liquidity</div>
        <div className={styles.textRight}>
          <span className={classNames(styles.amount, { [styles.loading]: !liquidity })}>
            {liquidity || liquidity === 0 ? (
              formatDisplayUsdt(liquidity)
            ) : (
              <img src={Loading} alt="loading" width={30} height={30} />
            )}
          </span>
        </div>
      </div>

      <div className={styles.itemMobile}>
        <div className={styles.label}>Volume (24H)</div>
        <div className={styles.textRight}>
          <span className={styles.amount}>{formatDisplayUsdt(volume)}</span>
        </div>
      </div>
      <div className={styles.itemMobile}>
        <div className={styles.label}>APR</div>
        <div className={styles.apr}>
          <span className={styles.amount}>
            {aprInfo.apr.min === aprInfo.apr.max
              ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
              : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                  maximumFractionDigits: 1
                })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
            %
          </span>
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
                  <span className={styles.value}>
                    {numberWithCommas(aprInfo.swapFee * 100, undefined, { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    Incentives Boost&nbsp;
                    <IconBoots />
                  </span>
                  <span className={styles.value}>
                    {aprInfo.incentivesApr.min === aprInfo.incentivesApr.max
                      ? `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.incentivesApr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.incentivesApr.max * 100, undefined, {
                          maximumFractionDigits: 1
                        })}`}
                    %
                  </span>
                </div>
                <div className={styles.itemInfo}>
                  <span>Total APR</span>
                  <span className={styles.totalApr}>
                    {aprInfo.apr.min === aprInfo.apr.max
                      ? `${numberWithCommas(aprInfo.apr.min * 100, undefined, { maximumFractionDigits: 1 })}`
                      : `${numberWithCommas(aprInfo.apr.min * 100, undefined, {
                          maximumFractionDigits: 1
                        })} - ${numberWithCommas(aprInfo.apr.max * 100, undefined, { maximumFractionDigits: 1 })}`}
                    %
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PoolList;
