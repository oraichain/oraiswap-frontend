import React, { useState, useEffect, useMemo, useCallback } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import ChartComponent from './Chart';
import { Pairs } from 'config/pools';
import LoadingBox from 'components/LoadingBox';
import { INTERVALS } from './constants';
import { DataChart, InfoMove, InfoToken } from './type';
import { getInfoTokenSv, getPriceTokenWithTF } from './services';
import SymbolSwapImg from 'assets/images/symbols_swap.svg';
import { formateNumberDecimalsAuto } from 'libs/utils';

const cx = cn.bind(styles);

const SwapChart: React.FC<{
  fromTokenDenom: string;
}> = ({ fromTokenDenom }) => {
  const [initialData, setInitialData] = useState<DataChart[] | []>([]);
  const [typeData, setTypeData] = useState(INTERVALS[0].tf);
  const [infoMove, setInfoMove] = useState<InfoMove>();
  const [loading, setLoading] = useState<boolean>(false);
  const [price24hChange, setPrice24hChange] = useState<number | null>(null);
  const [infoToken, setInfoToken] = useState<InfoToken | null>(null);

  const tokenName = Pairs.getPoolTokens().find((el) => el.denom === fromTokenDenom)?.name;

  useEffect(() => {
    if (infoToken?.price24hChange) {
      setPrice24hChange(infoToken?.price24hChange);
    }
  }, [infoToken]);

  useEffect(() => {
    if (tokenName) {
      getInfoToken();
      getPriceToken();
    } else {
      setInitialData([]);
      setInfoToken(null);
    }
  }, [typeData, tokenName]);

  const IconFromToken = useMemo(() => {
    return Pairs.getPoolTokens().find((el) => el.denom === fromTokenDenom)?.Icon;
  }, [fromTokenDenom]);

  const getInfoToken = useCallback(async () => {
    try {
      const res = await getInfoTokenSv(tokenName);
      if (res?.data) setInfoToken(res?.data);
    } catch (error) {
      console.log(error);
    }
  }, [tokenName]);

  const getPriceToken = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPriceTokenWithTF(tokenName, typeData);
      setLoading(false);
      if (res?.data) {
        const dataPrice = res?.data;
        setInitialData(dataPrice);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [tokenName, typeData]);

  return (
    <div className={cx('chart-container')}>
      <LoadingBox loading={loading}>
        <div className={cx('head-info')}>
          {price24hChange && (
            <div>
              <div className={cx('head-info-top')}>
                <div className={cx('item')}>
                  <div className={cx('item-logo')}>
                    <IconFromToken />
                  </div>
                  <span className={cx('item-text')}>
                    {Pairs.getPoolTokens().find((el) => el.denom === fromTokenDenom)?.name?.toUpperCase()}
                  </span>
                </div>
                <span className={cx('percent', price24hChange >= 0 ? 'up' : 'down')}>
                  {price24hChange >= 0 ? `+${price24hChange.toFixed(2)}%` : `${price24hChange.toFixed(2)}%`}
                </span>
              </div>
            </div>
          )}
          {initialData.length > 0 && (
            <div className={cx('head-info-content')}>
              <div>
                <div className={cx('content-price')}>
                  <img src={SymbolSwapImg} />
                  <span>
                    {formateNumberDecimalsAuto({
                      price: infoMove?.value,
                      maxDecimal: 6,
                      minDecimal: 2,
                      unit: '$',
                      minPrice: 1,
                      unitPosition: 'prefix'
                    })}
                  </span>
                </div>
                <p className={cx('content-date')}>
                  {new Date(infoMove?.time ? infoMove?.time * 1000 : Date.now()).toLocaleString('en-US', {
                    month: 'short',
                    year: 'numeric',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <div className={cx('date-select')}>
                  {INTERVALS.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTypeData(item.tf)}
                      className={cx(item.tf === typeData ? 'active' : '')}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {initialData.length > 0 && (
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
                areaBottomColor: 'rgba(86, 42, 209, 0)'
              }}
            />
          </div>
        )}
      </LoadingBox>
    </div>
  );
};

export default SwapChart;
