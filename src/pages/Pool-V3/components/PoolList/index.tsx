import { BigDecimal, toDisplay } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import Loading from 'assets/gif/loading.gif';
import { ReactComponent as SortDownIcon } from 'assets/icons/down_icon.svg';
import { ReactComponent as IconInfo } from 'assets/icons/infomationIcon.svg';
import { ReactComponent as SortUpIcon } from 'assets/icons/up_icon.svg';
import { ReactComponent as NoDataDark } from 'assets/images/NoDataPool.svg';
import { ReactComponent as NoData } from 'assets/images/NoDataPoolLight.svg';
import classNames from 'classnames';
import LoadingBox from 'components/LoadingBox';
import Pagination from 'components/Pagination';
import usePagination from 'components/Pagination/usePagination';
import { CoefficientBySort, SortType } from 'components/Table';
import { TooltipIcon } from 'components/Tooltip';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useTheme from 'hooks/useTheme';
import { fetchPoolAprInfo } from 'libs/contractSingleton';
import { POOL_TYPE } from 'pages/Pool-V3';
import { useGetFeeDailyData } from 'pages/Pool-V3/hooks/useGetFeeDailyData';
import { useGetPoolLiquidityVolume } from 'pages/Pool-V3/hooks/useGetPoolLiquidityVolume';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { useGetPoolPositionInfo } from 'pages/Pool-V3/hooks/useGetPoolPositionInfo';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { useEffect, useRef, useState } from 'react';
import CreateNewPosition from '../CreateNewPosition';
import styles from './index.module.scss';
import PoolItemDataMobile from './PoolItemDataMobile';
import PoolItemTData from './PoolItemTData';
import { AddLiquidityModal } from 'pages/Pools/components/AddLiquidityModal';

export enum PoolColumnHeader {
  POOL_NAME = 'Pool name',
  LIQUIDITY = 'Liquidity',
  VOLUME = 'Volume (24h)',
  APR = 'Apr'
}

const PoolList = ({ search, filterType }: { search: string; filterType: POOL_TYPE }) => {
  const theme = useTheme();
  const { data: price } = useCoinGeckoPrices();
  const [, setLiquidityPools] = useConfigReducer('liquidityPools');
  const [volumnePools, setVolumnePools] = useConfigReducer('volumnePools');
  const [aprInfo, setAprInfo] = useConfigReducer('aprPools');
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const mobileMode = isMobile();
  const sortRef = useRef();

  const [sort, setSort] = useState<Record<PoolColumnHeader, SortType>>({
    [PoolColumnHeader.VOLUME]: SortType.DESC
  } as Record<PoolColumnHeader, SortType>);
  const [sortField, sortOrder] = Object.entries(sort)[0];

  const [currentPool, setCurrentPool] = useState(null);
  const [isOpenCreatePosition, setIsOpenCreatePosition] = useState(false);
  const [pairDenomsDeposit, setPairDenomsDeposit] = useState('');

  // const [dataPool, setDataPool] = useState([...Array(0)]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const { feeDailyData } = useGetFeeDailyData();
  const { poolList: dataPool, poolPrice, loading } = useGetPoolList(price);
  const { poolLiquidities, poolVolume, volumeV2, liquidityV2 } = useGetPoolLiquidityVolume(poolPrice);
  const { poolPositionInfo } = useGetPoolPositionInfo(poolPrice);

  useEffect(() => {
    const getAPRInfo = async () => {
      const res = await fetchPoolAprInfo(dataPool, poolPrice, poolPositionInfo, feeDailyData);
      setAprInfo(res);
    };
    if (dataPool.length && poolPrice && Object.keys(poolPositionInfo).length) {
      getAPRInfo();
    }
  }, [dataPool, Object.keys(poolPositionInfo).length, poolPrice]);

  const handleClickSort = (sortField: PoolColumnHeader) => {
    let newSort = { [sortField]: SortType.DESC } as Record<PoolColumnHeader, SortType>;

    if (sort[sortField] === SortType.DESC) {
      newSort = { [sortField]: SortType.ASC } as Record<PoolColumnHeader, SortType>;
      setSort(newSort);
      return;
    }

    setSort(newSort);
  };

  useEffect(() => {
    if (Object.values(poolVolume).length > 0) {
      const totalVolume24h = Object.values(poolVolume).reduce((acc, cur) => acc + cur, 0);

      const totalAllPoolVol = new BigDecimal(totalVolume24h).add(volumeV2).toNumber();
      setTotalVolume(totalAllPoolVol);
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
      const totalAllPoolLiq = new BigDecimal(totalLiqudity).add(liquidityV2).toNumber();
      setTotalLiquidity(totalAllPoolLiq);
    }
  }, [poolLiquidities, dataPool]);

  const filteredPool = dataPool
    .map((item) => {
      let volumeV3 = 0;
      if (item?.poolKey) {
        const findPool = volumnePools && volumnePools.find((vo) => vo.poolAddress === item?.poolKey);
        if (findPool) volumeV3 = findPool.volume24;
      }

      const { type, totalLiquidity: liquidityV2, volume24Hour: volumeV2, liquidityAddr, poolKey } = item || {};

      const showLiquidity =
        type === POOL_TYPE.V3 ? poolLiquidities?.[item?.poolKey] : toDisplay(Math.trunc(liquidityV2 || 0).toString());
      const showVolume = type === POOL_TYPE.V3 ? volumeV3 : toDisplay(volumeV2 || 0);
      const showApr = aprInfo?.[poolKey] || aprInfo?.[liquidityAddr] || {};

      return {
        ...item,
        showVolume,
        showLiquidity,
        showApr
      };
    })
    .sort((a, b) => {
      switch (sortField) {
        case PoolColumnHeader.LIQUIDITY:
          // return (
          //   Number(CoefficientBySort[sortOrder]) *
          //   ((poolLiquidities?.[a?.poolKey] || 0) - (poolLiquidities?.[b?.poolKey] || 0))
          // );
          return Number(CoefficientBySort[sortOrder]) * ((a.showLiquidity || 0) - (b.showLiquidity || 0));
        case PoolColumnHeader.POOL_NAME:
          return CoefficientBySort[sortOrder] * (a?.tokenXinfo?.name || '').localeCompare(b.tokenXinfo?.name || '');
        case PoolColumnHeader.VOLUME:
          return new BigDecimal(CoefficientBySort[sortOrder]).mul(a.showVolume - b.showVolume).toNumber();
        case PoolColumnHeader.APR:
          return new BigDecimal(CoefficientBySort[sortOrder])
            .mul((a?.showApr.apr.max || 0) - (b?.showApr.apr.max || 0))
            .toNumber();

        default:
          return 0;
      }
    })
    .filter((p) => {
      const { tokenXinfo, tokenYinfo, type } = p;
      let conditions = true;

      if (search) {
        conditions =
          conditions &&
          ((tokenXinfo && tokenXinfo.name.toLowerCase().includes(search.toLowerCase())) ||
            (tokenYinfo && tokenYinfo.name.toLowerCase().includes(search.toLowerCase())));
      }

      if (filterType && filterType !== POOL_TYPE.ALL) {
        conditions = conditions && type === filterType;
      }

      return conditions;
    });

  const { setPage, page, handleNext, handlePrev, totalPages, indexOfLastItem, indexOfFirstItem } = usePagination({
    data: filteredPool
  });

  useOnClickOutside(sortRef, () => {
    setOpenSort(false);
  });

  const renderList = () => {
    return mobileMode ? (
      <div className={styles.listMobile}>
        <div className={styles.header}>
          <span>List Pools</span>

          <div className={styles.sortMobileWrapper}>
            <div
              className={styles.sortBtn}
              onClick={() => {
                const [sortField] = Object.entries(sort)[0];

                handleClickSort(sortField as PoolColumnHeader);
              }}
            >
              {sortOrder === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />}
            </div>
            <div className={styles.labelSort} ref={sortRef} onClick={() => setOpenSort(!openSort)}>
              {sortField}
              <div className={classNames(styles.sortList, { [styles.active]: openSort })}>
                {Object.values(PoolColumnHeader).map((item, k) => {
                  return (
                    <span
                      key={`${k}-sort-item-${item}`}
                      className={styles.item}
                      onClick={() => {
                        handleClickSort(item);
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {filteredPool.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => {
          const { showLiquidity, showVolume, showApr } = item || {};
          return (
            <PoolItemDataMobile
              key={`${index}-item-mobile-${item?.id}`}
              item={item}
              theme={theme}
              volume={showVolume ?? 0}
              liquidity={showLiquidity ?? 0}
              aprInfo={{
                apr: 0,
                incentives: [],
                swapFee: 0,
                incentivesApr: 0,
                ...showApr
              }}
              setCurrentPool={setCurrentPool}
              setIsOpenCreatePosition={setIsOpenCreatePosition}
              setPairDenomsDeposit={setPairDenomsDeposit}
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
            {filteredPool.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => {
              const { showLiquidity, showVolume, showApr } = item || {};

              // const { type, totalLiquidity: liquidityV2, volume24Hour: volumeV2, liquidityAddr, poolKey } = item || {};

              // const showLiquidity =
              //   type === POOL_TYPE.V3 ? poolLiquidities?.[item?.poolKey] : toDisplay(Math.trunc(liquidityV2 || 0).toString());
              // const showVolume = type === POOL_TYPE.V3 ? volumeV3 : toDisplay(volumeV2 || 0);
              // const showApr = aprInfo?.[poolKey] || aprInfo?.[liquidityAddr];

              return (
                <tr className={styles.item} key={`${index}-pool-${item?.id}`}>
                  <PoolItemTData
                    item={item}
                    theme={theme}
                    volume={showVolume ?? 0}
                    liquidity={showLiquidity ?? 0}
                    aprInfo={{
                      apr: 0,
                      incentives: [],
                      swapFee: 0,
                      incentivesApr: 0,
                      ...showApr
                    }}
                    setCurrentPool={setCurrentPool}
                    setIsOpenCreatePosition={setIsOpenCreatePosition}
                    setPairDenomsDeposit={setPairDenomsDeposit}
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

        <div className={styles.paginate}>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              paginate={setPage}
              currentPage={page}
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          )}
        </div>

        {isOpenCreatePosition && currentPool && (
          <CreateNewPosition
            showModal={isOpenCreatePosition}
            setShowModal={setIsOpenCreatePosition}
            pool={currentPool}
          />
        )}

        {pairDenomsDeposit && (
          <AddLiquidityModal
            isOpen={!!pairDenomsDeposit}
            close={() => setPairDenomsDeposit('')}
            pairDenoms={pairDenomsDeposit}
          />
        )}
      </LoadingBox>
    </div>
  );
};

export default PoolList;
