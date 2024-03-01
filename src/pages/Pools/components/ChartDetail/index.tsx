import { ExecuteInstruction } from '@cosmjs/cosmwasm-stargate';
import { CW20_DECIMALS, ORAI, ORAI_INFO, USDT_CONTRACT, toDecimal, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as UpIcon } from 'assets/icons/up-arrow.svg';
import { ReactComponent as DownIcon } from 'assets/icons/down-arrow-v2.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import bg_claim_btn from 'assets/images/bg_claim_btn.svg';
import bg_claim_btn_light from 'assets/images/bg_claim_btn_light.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import CosmJs from 'libs/cosmjs';
import {
  getStatisticData,
  useGetMyStake,
  useGetPools,
  useGetRewardInfo,
  useGetTotalClaimable
} from 'pages/Pools/hooks';
import { FC, useEffect, useState } from 'react';
import { PoolInfoResponse } from 'types/pool';
import LiquidityChart from '../LiquidityChart';
import VolumeChart from '../VolumeChart';
import styles from './index.module.scss';

import React from 'react';
import { FILTER_DAY, LIST_FILTER_DAY } from '../Header';

export enum TAB_CHART {
  LIQUIDITY = 'Liquidity',
  VOLUME = 'Volume'
}

const ChartDetail = ({ pair }: { pair: string }) => {
  const [filterDay, setFilterDay] = useState(FILTER_DAY.DAY);
  const [tab, setTab] = useState(TAB_CHART.LIQUIDITY);
  return (
    <div className={styles.chartDetail}>
      <div className={styles.header}>
        <div className={styles.tabWrapper}>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.LIQUIDITY ? styles.active : ''}`}
            onClick={() => setTab(TAB_CHART.LIQUIDITY)}
          >
            {TAB_CHART.LIQUIDITY}
          </button>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.VOLUME ? styles.active : ''}`}
            onClick={() => setTab(TAB_CHART.VOLUME)}
          >
            {TAB_CHART.VOLUME}
          </button>
        </div>
        <div className={styles.filter_day_wrapper}>
          {LIST_FILTER_DAY.map((e) => {
            return (
              <button
                key={'day-key-chart' + e.label}
                className={`${styles.filter_day}${' '}${e.value === filterDay ? styles.active : ''}`}
                onClick={() => setFilterDay(e.value)}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={`${styles.chartItem} ${tab === TAB_CHART.LIQUIDITY ? styles.activeChart : ''}`}>
          <LiquidityChart filterDay={filterDay} pair={pair} height={230} />
        </div>
        <div className={`${styles.chartItem} ${tab === TAB_CHART.VOLUME ? styles.activeChart : ''}`}>
          <VolumeChart filterDay={filterDay} pair={pair} height={230} />
        </div>
      </div>
    </div>
  );
};

export default ChartDetail;
