import cn from 'classnames/bind';
import TVChartContainer from 'components/TVChartContainer/TVChartContainer';
import Content from 'layouts/Content';
import React, { useState } from 'react';
import SwapComponent from './SwapV3';
import styles from './index.module.scss';
import { RoutingSection, HeaderTab, TabsTxs, HistoryTab, AssetsTab, StepByStep } from './Component';
import { TYPE } from './helpers';
import { TransactionProcess } from './Modals';

const cx = cn.bind(styles);

const Swap: React.FC = () => {
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<[string, string]>(['orai', 'usdt']);
  const [hideChart, setHideChart] = useState<boolean>(false);
  const [type, setType] = useState<string>(TYPE.ASSETS);
  const [isTxsProcess, setIsTxsProcress] = useState<boolean>(false);
  return (
    <Content nonBackground>
      <div className={cx('swap-container')}>
        <div className={cx('swap-col', 'w60')}>
          <div>
            <HeaderTab setHideChart={setHideChart} hideChart={hideChart} />
            <div className={cx('tv-chart', hideChart ? 'hidden' : '')}>
              {isTxsProcess && <TransactionProcess close={() => setIsTxsProcress(!isTxsProcess)} />}
              <TVChartContainer />
            </div>
            <RoutingSection />
            <TabsTxs type={type} setType={setType} />
            {type === TYPE.HISTORY && <HistoryTab />}
            {type === TYPE.ASSETS && <AssetsTab />}
          </div>
        </div>
        <div className={cx('swap-col', 'w40')}>
          <SwapComponent fromTokenDenom={fromTokenDenom} toTokenDenom={toTokenDenom} setSwapTokens={setSwapTokens} />
        </div>
      </div>
    </Content>
  );
};

export default Swap;
