import React, { useState, useEffect } from 'react';
import cn from 'classnames/bind';
import { ReactComponent as SYMBOLIcon } from 'assets/icons/symbols_swap.svg';
import styles from './index.module.scss';
import { renderLogoNetwork } from 'helpers';
import ChartComponent from './Chart';
import { seriesesData } from './dataTest';
import moment from 'moment';
const cx = cn.bind(styles);

export const INTERVALS = ['24H', '1W', '1M', '1Y'];

interface InfoMove {
  value: number;
  time: string;
}

const SwapChart: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
}> = ({ fromTokenDenom, toTokenDenom }) => {
  const [initialData, setInitialData] = useState([]);
  const [typeData, setTypeData] = useState(INTERVALS[0]);
  const [infoMove, setInfoMove] = useState<InfoMove>();

  useEffect(() => {
    setInitialData(seriesesData.get(typeData));
  }, [typeData]);

  console.log('TO', toTokenDenom);

  return (
    <div className={cx('chart-container')}>
      <div className={cx('head-info')}>
        <div>
          <div className={cx('head-info-top')}>
            <div className={cx('item')}>
              <div className={cx('item-logo')}>
                {renderLogoNetwork(fromTokenDenom)}
              </div>
              <span className={cx('item-text')}>
                {fromTokenDenom.toUpperCase()}
              </span>
            </div>
            <span className={cx('wall')}>/</span>
            <div className={cx('item')}>
              <div className={cx('item-logo')}>
                {renderLogoNetwork(toTokenDenom)}
              </div>
              <span className={cx('item-text')}>
                {toTokenDenom.toUpperCase()}
              </span>
            </div>
            <span className={cx('percent', 'up')}>+0.51 (+0.39%)</span>
          </div>
        </div>
        <div className={cx('head-info-content')}>
          <div>
            <div className={cx('content-price')}>
              <SYMBOLIcon />
              <span>{infoMove?.value}</span>
            </div>
            <p className={cx('content-date')}>
              {infoMove?.time ? moment(infoMove?.time).format('ll') : ''}
            </p>
          </div>
          <div>
            <div className={cx('date-select')}>
              {INTERVALS.map((item) => (
                <button
                  key={item}
                  onClick={() => setTypeData(item)}
                  className={cx(item === typeData ? 'active' : '')}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default SwapChart;
