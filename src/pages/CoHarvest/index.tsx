import { isMobile } from '@walletconnect/browser-utils';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import HarvestInfo from './components/HarvestInfo';
import { useCountdown } from './hooks/useCountdown';
import { useGetBidding, useGetRound } from './hooks/useGetBidRound';
import styles from './index.module.scss';
import { useState } from 'react';
import ExplainReturnModal from './components/ExplainReturnModal';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const round = useGetRound();
  const { biddingInfo } = useGetBidding(round);

  const poolValue = biddingInfo.distribution_info.total_distribution;

  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onStart = () => {
    setIsStarted(true);
  };

  const onEnd = () => {
    setIsEnd(true);
  };

  return (
    <div className={styles.container}>
      <ExplainReturnModal open={isOpen} onClose={() => setIsOpen(false)} />

      {!mobileMode ? (
        <div className={styles.auction}>
          <div className={styles.top}>
            <div className={styles.bid}>
              <Bidding openExplainModal={() => setIsOpen(true)} round={round} isEnd={isEnd} isStarted={isStarted} />
            </div>
            <div className={styles.info}>
              <HarvestInfo
                openExplainModal={() => setIsOpen(true)}
                poolValue={poolValue}
                bidInfo={biddingInfo.bid_info}
                onEnd={onEnd}
                onStart={onStart}
              />
              <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
            </div>
          </div>
          <BiddingHistory round={round} isEnd={isEnd} />
        </div>
      ) : (
        <div className={styles.auction}>
          <HarvestInfo
            openExplainModal={() => setIsOpen(true)}
            poolValue={poolValue}
            bidInfo={biddingInfo.bid_info}
            onEnd={onEnd}
            onStart={onStart}
          />
          <Bidding openExplainModal={() => setIsOpen(true)} round={round} isEnd={isEnd} isStarted={isStarted} />
          <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
          <BiddingHistory round={round} isEnd={isEnd} />
        </div>
      )}
    </div>
  );
};

export default CoHarvest;
