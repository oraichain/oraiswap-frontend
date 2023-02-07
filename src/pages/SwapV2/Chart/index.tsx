import React, { useState, useEffect, useMemo, useCallback } from 'react';
import cn from 'classnames/bind';
import { ReactComponent as SYMBOLIcon } from 'assets/icons/symbols_swap.svg';
import styles from './index.module.scss';
import ChartComponent from './Chart';
import moment from 'moment';
import { poolTokens, getPair } from 'config/pools';
import TokenBalance from 'components/TokenBalance';
import LoadingBox from 'components/LoadingBox';
import notFound from 'assets/images/notFound.svg';
import { INTERVALS } from './constants';
import { InfoMove, InfoPool } from './type';
import { getPoolAllSv, getPoolLiquiditySv, getPoolSv } from './services';
const cx = cn.bind(styles);

const SwapChart: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
}> = ({ fromTokenDenom, toTokenDenom }) => {
  const [initialData, setInitialData] = useState([]);
  const [typeData, setTypeData] = useState(INTERVALS[0].key);
  const [infoMove, setInfoMove] = useState<InfoMove>();
  const [listPools, setListPool] = useState<InfoPool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [liquidity24h, setLiquidity24h] = useState<number | null>(null);

  const pairInfo = getPair(fromTokenDenom, toTokenDenom);
  const poolId = listPools.find(
    (el) => el?.contract_address === pairInfo?.contract_addr
  )?.id;

  useEffect(() => {
    getPoolAll();
  }, []);

  useEffect(() => {
    if (poolId) {
      getPool();
      getPoolLiquidity();
    } else {
      setInitialData([]);
      setLiquidity24h(null);
    }
  }, [typeData, poolId]);

  const IconFromToken = useMemo(() => {
    return poolTokens.find((el) => el.denom === fromTokenDenom)?.Icon;
  }, [fromTokenDenom]);

  const IconToToken = useMemo(() => {
    return poolTokens.find((el) => el.denom === toTokenDenom)?.Icon;
  }, [toTokenDenom]);

  const getPoolAll = useCallback(async () => {
    const res = await getPoolAllSv();
    if (res?.data) setListPool(res?.data);
  }, []);

  const getPoolLiquidity = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPoolLiquiditySv({ poolId, typeData, range: 30 });
      setLoading(false);
      if (res?.data) setInitialData(res?.data);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  
  }, [typeData, poolId]);

  const getPool = useCallback(async () => {
    const res = await getPoolSv(poolId);
    const price = res?.data?.[0]?.price_24h_change;
    if (price) setLiquidity24h(price.toFixed(2));
  }, [poolId]);

  return (
    <div className={cx('chart-container')}>
      <LoadingBox loading={loading}>
        <div className={cx('head-info')}>
          <div>
            <div className={cx('head-info-top')}>
              <div className={cx('item')}>
                <div className={cx('item-logo')}>
                  <IconFromToken />
                </div>
                <span className={cx('item-text')}>
                  {poolTokens
                    .find((el) => el.denom === fromTokenDenom)
                    ?.name?.toUpperCase()}
                </span>
              </div>
              <span className={cx('wall')}>/</span>
              <div className={cx('item')}>
                <div className={cx('item-logo')}>
                  <IconToToken />
                </div>
                <span className={cx('item-text')}>
                  {poolTokens
                    .find((el) => el.denom === toTokenDenom)
                    ?.name?.toUpperCase()}
                </span>
              </div>
              {liquidity24h && (
                <span
                  className={cx('percent', liquidity24h >= 0 ? 'up' : 'down')}
                >
                  {liquidity24h >= 0 ? `+${liquidity24h}%` : `${liquidity24h}%`}
                </span>
              )}
            </div>
          </div>
          {poolId && (
            <div className={cx('head-info-content')}>
              <div>
                <div className={cx('content-price')}>
                  <SYMBOLIcon />
                  <TokenBalance balance={infoMove?.value} decimalScale={2} />
                </div>
                <p className={cx('content-date')}>
                  {infoMove?.time
                    ? moment(
                        `${infoMove?.time?.year}-${infoMove?.time?.month}-${infoMove?.time?.day}`
                      ).format('ll')
                    : moment().format('ll')}
                </p>
              </div>
              <div>
                <div className={cx('date-select')}>
                  {INTERVALS.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTypeData(item.key)}
                      className={cx(item.key === typeData ? 'active' : '')}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {poolId ? (
          <div className={cx('chart-box')}>
            <ChartComponent
              data={initialData}
              setInfoMove={setInfoMove}
              colors={{
                backgroundColor: 'rgba(31, 33, 40,0)',
                lineColor: '#A871DF',
                textColor: 'black',
                areaTopColor: '#612fca',
                // areaTopColor: 'rgba(168, 113, 223, 0.5)',
                areaBottomColor: 'rgba(86, 42, 209, 0)',
              }}
            />
          </div>
        ) : (
          <div className={cx('no-data')}>
            <img src={notFound} alt="nodata" />
          </div>
        )}
      </LoadingBox>
    </div>
  );
};

export default SwapChart;
