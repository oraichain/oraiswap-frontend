import { isMobile } from '@walletconnect/browser-utils';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import HarvestInfo from './components/HarvestInfo';
import { useCountdown } from './hooks/useCountdown';
import { useGetBidding, useGetRound } from './hooks/useGetBidRound';
import styles from './index.module.scss';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const round = useGetRound();
  const { biddingInfo, isLoading, refetchBiddingInfo } = useGetBidding(round);
  const { timeRemaining, percent, isEnd } = useCountdown(biddingInfo.bid_info);
  const poolValue = biddingInfo.distribution_info.total_distribution;

  return (
    <div className={styles.container}>
      {!mobileMode ? (
        <div className={styles.auction}>
          <div className={styles.top}>
            <div className={styles.bid}>
              <Bidding round={round} isEnd={isEnd} />
            </div>
            <div className={styles.info}>
              <HarvestInfo
                poolValue={poolValue}
                round={round}
                timeRemaining={timeRemaining}
                percent={percent}
                isEnd={isEnd}
              />
              <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
            </div>
          </div>
          <BiddingHistory round={round} />
        </div>
      ) : (
        <div className={styles.auction}>
          <HarvestInfo
            poolValue={poolValue}
            round={round}
            timeRemaining={timeRemaining}
            percent={percent}
            isEnd={isEnd}
          />
          <Bidding round={round} isEnd={isEnd} />
          <BiddingChart bidInfo={biddingInfo.bid_info} round={round} />
          <BiddingHistory round={round} />
        </div>
      )}
    </div>
  );
};

export default CoHarvest;
