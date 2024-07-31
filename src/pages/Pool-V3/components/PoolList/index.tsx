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
import SingletonOraiswapV3, { fetchPoolAprInfo, PoolAprInfo, poolKeyToString } from 'libs/contractSingleton';
import { getCosmWasmClient } from 'libs/cosmjs';
import { formatPoolData, parsePoolKeyString } from 'pages/Pool-V3/helpers/format';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';
import axios from 'axios';
import { oraichainTokens } from 'config/bridgeTokens';
import LoadingBox from 'components/LoadingBox';

const PoolList = () => {
  const { data: prices } = useCoinGeckoPrices();
  const [liquidityPools, setLiquidityPools] = useConfigReducer('liquidityPools');
  const [volumnePools, setVolumnePools] = useConfigReducer('volumnePools');

  const theme = useTheme();

  const bgUrl = theme === 'light' ? SearchLightSvg : SearchSvg;

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [dataPool, setDataPool] = useState([...Array(0)]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const pools = await SingletonOraiswapV3.getPools();
        const fmtPools = (pools || [])
          .map((p) => {
            const isLight = theme === 'light';
            return formatPoolData(p, isLight);
          })
          .sort((a, b) => Number(b.pool.liquidity) - Number(a.pool.liquidity));
        setDataPool(fmtPools);
      } catch (error) {
        console.log('error: get pools', error);
      } finally {
        setLoading(false);
      }
    })();

    return () => {};
  }, []);

  const totalLiquidity = useMemo(() => {
    if (liquidityPools && Object.values(liquidityPools).length) {
      return Object.values(liquidityPools).reduce((acc, cur) => Number(acc) + Number(cur), 0);
    }
    return 0;
  }, [liquidityPools]);

  useEffect(() => {
    (async () => {
      try {
        if (dataPool.length) {
          const liquidityByPools = await SingletonOraiswapV3.getPoolLiquidities(dataPool, prices);
          setLiquidityPools(liquidityByPools);
        }
      } catch (error) {
        console.log('error: get liquidities', error);
      }
    })();
  }, [dataPool]);

  const [aprInfo, setAprInfo] = useState<Record<string, PoolAprInfo>>();
  useEffect(() => {
    const getAPRInfo = async () => {
      const poolKeys = dataPool.map((pool) => parsePoolKeyString(pool.poolKey));

      const res = await fetchPoolAprInfo(poolKeys, prices, liquidityPools);
      console.log({res});
      setAprInfo(res);
    };
    if (dataPool && prices && liquidityPools) {
      getAPRInfo();
    }
  }, [dataPool, prices, liquidityPools]);

  useEffect(() => {
    const fetchStatusAmmV3 = async () => {
      try {
        const res = await axios.get('/pool-v3/status', { baseURL: 'https://api-staging.oraidex.io/v1' });
        return res.data;
      } catch (error) {
        return [];
      }
    };

    fetchStatusAmmV3().then(async (data) => {
      const pools = await SingletonOraiswapV3.getPools();
      const allPoolsData = pools.map((pool) => {
        return {
          tokenX: pool.pool_key.token_x,
          tokenY: pool.pool_key.token_y,
          fee: BigInt(pool.pool_key.fee_tier.fee),
          poolKey: poolKeyToString(pool.pool_key)
        };
      });
      const poolsDataObject: Record<
        string,
        {
          tokenX: string;
          tokenY: string;
          fee: bigint;
          poolKey: string;
        }
      > = {};
      allPoolsData.forEach((pool) => {
        poolsDataObject[pool.poolKey.toString()] = pool;
      });

      // let allTokens = oraichainTokens.reduce((acc, cur) => {
      //   return { ...acc, [cur.contractAddress || cur.denom]: cur };
      // }, {});

      // const unknownTokens = new Set<string>();
      // allPoolsData.forEach((pool) => {
      //   if (!allTokens[pool.tokenX.toString()]) {
      //     unknownTokens.add(pool.tokenX);
      //   }

      //   if (!allTokens[pool.tokenY.toString()]) {
      //     unknownTokens.add(pool.tokenY);
      //   }
      // });

      // const tokenInfos = await SingletonOraiswapV3.getTokensInfo([...unknownTokens]);
      // // yield* put(poolsActions.addTokens(newTokens))

      // const preparedTokens: Record<string, any> = {};
      // Object.entries(allTokens).forEach(([key, val]) => {
      //   // @ts-ignore
      //   if (typeof val.coinGeckoId !== 'undefined') {
      //     preparedTokens[key] = val as Required<any>;
      //   }
      // });

      // let tokensPricesData: Record<string, any> = {};

      // const volume24 = {
      //   value: 0,
      //   change: 0
      // };
      // const tvl24 = {
      //   value: 0,
      //   change: 0
      // };
      // const fees24 = {
      //   value: 0,
      //   change: 0
      // };

      // const tokensDataObject: Record<string, any> = {};
      let poolsData: {
        poolAddress: string;
        tokenX: string;
        tokenY: string;
        fee: number;
        volume24: number;
        tvl: number;
        apy: number;
      }[] = [];
      // const volumeForTimestamps: Record<string, number> = {};
      // const liquidityForTimestamps: Record<string, number> = {};
      // const feesForTimestamps: Record<string, number> = {};

      const lastTimestamp = Math.max(
        ...Object.values(data)
          .filter((snaps: any) => snaps.length > 0)
          .map((snaps: any) => +snaps[snaps.length - 1].timestamp)
      );

      Object.entries(data).forEach(([address, snapshots]) => {
        //   if (!poolsDataObject[address]) {
        //     return;
        //   }
        //   const tokenXId = preparedTokens?.[poolsDataObject[address].tokenX.toString()]?.coingeckoId ?? '';
        //   const tokenYId = preparedTokens?.[poolsDataObject[address].tokenY.toString()]?.coingeckoId ?? '';
        //   if (!tokensDataObject[poolsDataObject[address].tokenX.toString()]) {
        //     tokensDataObject[poolsDataObject[address].tokenX.toString()] = {
        //       address: poolsDataObject[address].tokenX,
        //       price: tokensPricesData?.[tokenXId]?.price ?? 0,
        //       volume24: 0,
        //       tvl: 0,
        //       priceChange: 0
        //     };
        //   }
        //   if (!tokensDataObject[poolsDataObject[address].tokenY.toString()]) {
        //     tokensDataObject[poolsDataObject[address].tokenY.toString()] = {
        //       address: poolsDataObject[address].tokenY,
        //       price: tokensPricesData?.[tokenYId]?.price ?? 0,
        //       volume24: 0,
        //       tvl: 0,
        //       priceChange: 0
        //     };
        //   }
        // @ts-ignore
        if (!snapshots.length) {
          poolsData.push({
            volume24: 0,
            tvl: 0,
            tokenX: poolsDataObject[address].tokenX,
            tokenY: poolsDataObject[address].tokenY,
            // TODO: hard code decimals
            fee: Number(poolsDataObject[address].fee),
            apy: 0, // TODO: calculate apy
            poolAddress: address
          });
          return;
        }
        //   const tokenX = allTokens[poolsDataObject[address].tokenX.toString()];
        //   const tokenY = allTokens[poolsDataObject[address].tokenY.toString()];
        //@ts-ignore
        const lastSnapshot = snapshots[snapshots.length - 1];
        //   console.log('token: ', tokenX.coingeckoId, tokenY.coingeckoId, lastSnapshot, lastTimestamp);
        //   tokensDataObject[(tokenX.contractAddress || tokenX.denom).toString()].volume24 +=
        //     lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeX.usdValue24 : 0;
        //   tokensDataObject[(tokenX.contractAddress || tokenX.denom).toString()].volume24 +=
        //     lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeY.usdValue24 : 0;
        //   tokensDataObject[(tokenX.contractAddress || tokenX.denom).toString()].tvl += lastSnapshot.liquidityX.usdValue24;
        //   tokensDataObject[(tokenX.contractAddress || tokenX.denom).toString()].tvl += lastSnapshot.liquidityY.usdValue24;
        poolsData.push({
          volume24:
            lastSnapshot.timestamp === lastTimestamp
              ? lastSnapshot.volumeX.usdValue24 + lastSnapshot.volumeY.usdValue24
              : 0,
          tvl:
            lastSnapshot.timestamp === lastTimestamp
              ? lastSnapshot.liquidityX.usdValue24 + lastSnapshot.liquidityY.usdValue24
              : 0,
          tokenX: poolsDataObject[address]?.tokenX,
          tokenY: poolsDataObject[address]?.tokenY,
          fee: Number(poolsDataObject[address]?.fee),
          apy: 0, // TODO: calculate apy
          poolAddress: address
        });
        //   // @ts-ignore
        //   snapshots.slice(-30).forEach((snapshot) => {
        //     const timestamp = snapshot.timestamp.toString();
        //     if (!volumeForTimestamps[timestamp]) {
        //       volumeForTimestamps[timestamp] = 0;
        //     }
        //     if (!liquidityForTimestamps[timestamp]) {
        //       liquidityForTimestamps[timestamp] = 0;
        //     }
        //     if (!feesForTimestamps[timestamp]) {
        //       feesForTimestamps[timestamp] = 0;
        //     }
        //     volumeForTimestamps[timestamp] += snapshot.volumeX.usdValue24 + snapshot.volumeY.usdValue24;
        //     liquidityForTimestamps[timestamp] += snapshot.liquidityX.usdValue24 + snapshot.liquidityY.usdValue24;
        //     feesForTimestamps[timestamp] += snapshot.feeX.usdValue24 + snapshot.feeY.usdValue24;
        //   });
      });

      // const volumePlot: any[] = Object.entries(volumeForTimestamps)
      //   .map(([timestamp, value]) => ({
      //     timestamp: +timestamp,
      //     value
      //   }))
      //   .sort((a, b) => a.timestamp - b.timestamp);
      // const liquidityPlot: any[] = Object.entries(liquidityForTimestamps)
      //   .map(([timestamp, value]) => ({
      //     timestamp: +timestamp,
      //     value
      //   }))
      //   .sort((a, b) => a.timestamp - b.timestamp);
      // const feePlot: any[] = Object.entries(feesForTimestamps)
      //   .map(([timestamp, value]) => ({
      //     timestamp: +timestamp,
      //     value
      //   }))
      //   .sort((a, b) => a.timestamp - b.timestamp);

      const tiersToOmit = [0.001, 0.003];

      poolsData = poolsData.filter((pool) => !tiersToOmit.includes(pool.fee));

      // volume24.value = volumePlot.length ? volumePlot[volumePlot.length - 1].value : 0;
      // tvl24.value = liquidityPlot.length ? liquidityPlot[liquidityPlot.length - 1].value : 0;
      // fees24.value = feePlot.length ? feePlot[feePlot.length - 1].value : 0;

      // const prevVolume24 = volumePlot.length > 1 ? volumePlot[volumePlot.length - 2].value : 0;
      // const prevTvl24 = liquidityPlot.length > 1 ? liquidityPlot[liquidityPlot.length - 2].value : 0;
      // const prevFees24 = feePlot.length > 1 ? feePlot[feePlot.length - 2].value : 0;

      // volume24.change = ((volume24.value - prevVolume24) / prevVolume24) * 100;
      // tvl24.change = ((tvl24.value - prevTvl24) / prevTvl24) * 100;
      // fees24.change = ((fees24.value - prevFees24) / prevFees24) * 100;

      setVolumnePools(poolsData);
    });
  }, []);

  return (
    <div className={styles.poolList}>
      <div className={styles.headerTable}>
        <div className={styles.total}>
          <p>Total liquidity</p>
          {totalLiquidity === 0 || totalLiquidity ? (
            <h1>{formatDisplayUsdt(Number(totalLiquidity) || 0)}</h1>
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
      <LoadingBox loading={loading} styles={{ height: '60vh' }}>
        <div className={styles.list}>
          {dataPool?.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Pool name</th>
                    <th className={styles.textRight}>Liquidity</th>
                    <th className={styles.textRight}>Volume (24H)</th>
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
                      let volumn = 0;
                      if (item?.poolKey) {
                        const findPool = volumnePools && volumnePools.find((vo) => vo.poolAddress === item?.poolKey);
                        if (findPool) volumn = findPool.volume24;
                      }

                      return (
                        <tr className={styles.item} key={`${index}-pool-${item?.id}`}>
                          <PoolItemTData
                            item={item}
                            theme={theme}
                            volumn={volumn}
                            liquidity={liquidityPools?.[item?.poolKey]}
                            aprInfo={aprInfo?.[item?.poolKey] ?? {
                              apr: 0,
                              incentives: [],
                              swapFee: 0,
                              incentivesApr: 0
                            }}
                          />
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <div className={styles.nodata}>
                {theme === 'light' ? <NoData /> : <NoDataDark />}
                <span>No Pools!</span>
              </div>
            )
          )}
        </div>
      </LoadingBox>
    </div>
  );
};

const PoolItemTData = ({ item, theme, liquidity, volumn, aprInfo }) => {
  const navigate = useNavigate();

  const [openTooltip, setOpenTooltip] = useState(false);

  const isLight = theme === 'light';
  const IconBoots = isLight ? BootsIcon : BootsIconDark;
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
      <td className={styles.textRight}>
        <span className={styles.amount}>{formatDisplayUsdt(volumn)}</span>
      </td>
      <td>
        <div className={styles.apr}>
          <span className={styles.amount}>{numberWithCommas(aprInfo.apr * 100)}%</span>
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
                  <span className={styles.value}>{numberWithCommas(aprInfo.swapFee * 100)}%</span>
                </div>
                <div className={styles.itemInfo}>
                  <span>
                    Incentives Boost&nbsp;
                    <IconBoots />
                  </span>
                  <span className={styles.value}>{numberWithCommas(aprInfo.incentivesApr * 100)}%</span>
                </div>
                <div className={styles.itemInfo}>
                  <span>Total APR</span>
                  <span className={styles.totalApr}>{numberWithCommas(aprInfo.apr * 100)}%</span>
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
