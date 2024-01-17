import { isMobile } from '@walletconnect/browser-utils';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import HarvestInfo from './components/HarvestInfo';
import { useCountdown } from './hooks/useCountdown';
import { useGetBidding, useGetRound } from './hooks/useGetBidRound';
import styles from './index.module.scss';
import { useState } from 'react';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const round = useGetRound();
  const { biddingInfo } = useGetBidding(round);

  const poolValue = biddingInfo.distribution_info.total_distribution;

  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const onStart = () => {
    setIsStarted(true);
  };

  const onEnd = () => {
    setIsEnd(true);
  };

  return (
    <div className={styles.container}>
      {!mobileMode ? (
        <div className={styles.auction}>
          <div className={styles.top}>
            <div className={styles.bid}>
              <Bidding round={round} isEnd={isEnd} isStarted={isStarted} />
            </div>
            <div className={styles.info}>
              <HarvestInfo poolValue={poolValue} bidInfo={biddingInfo.bid_info} onEnd={onEnd} onStart={onStart} />
              <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
            </div>
          </div>
          <BiddingHistory round={round} />
        </div>
      ) : (
        <div className={styles.auction}>
          <HarvestInfo poolValue={poolValue} bidInfo={biddingInfo.bid_info} onEnd={onEnd} onStart={onStart} />
          <Bidding round={round} isEnd={isEnd} isStarted={isStarted} />
          <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
          <BiddingHistory round={round} />
        </div>
      )}
    </div>
  );
};

export default CoHarvest;
