import cn from 'classnames/bind';
import TVChartContainer from 'components/TVChartContainer/TVChartContainer';
import Content from 'layouts/Content';
import React, { useState } from 'react';
import SwapComponent from './SwapV3';
import styles from './index.module.scss';
import { RoutingSection, HeaderTab, TabsTxs, HistoryTab, AssetsTab } from './Component';
import { NetworkFilter, TYPE, initNetworkFilter } from './helpers';
import { TransactionProcess } from './Modals';
import { isMobile } from '@walletconnect/browser-utils';

const cx = cn.bind(styles);

const Swap: React.FC = () => {
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<[string, string]>(['orai', 'usdt']);
  const [hideChart, setHideChart] = useState<boolean>(false);
  const [type, setType] = useState<string>(TYPE.ASSETS);
  const [isTxsProcess, setIsTxsProcress] = useState<boolean>(false);
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>(initNetworkFilter);
  const mobileMode = isMobile();
  return (
    <Content nonBackground>
      <div className={cx('swap-container')}>
        <div className={cx('swap-col', 'w60')}>
          <div>
            {!mobileMode && (
              <>
                <HeaderTab setHideChart={setHideChart} hideChart={hideChart} />
                <div className={cx('tv-chart', hideChart ? 'hidden' : '')}>
                  {isTxsProcess && <TransactionProcess close={() => setIsTxsProcress(!isTxsProcess)} />}
                  <TVChartContainer />
                </div>
              </>
            )}

            <RoutingSection />
            <TabsTxs
              type={type}
              setType={setType}
              setNetworkFilter={setNetworkFilter}
              networkFilter={networkFilter.label}
            />
            {type === TYPE.HISTORY && <HistoryTab networkFilter={networkFilter.value} />}
            {type === TYPE.ASSETS && <AssetsTab networkFilter={networkFilter.value} />}
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
