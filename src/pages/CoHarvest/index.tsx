import { isMobile } from '@walletconnect/browser-utils';
import { useEffect, useState } from 'react';
import BannerHistory from './components/Banner';
import Bidding from './components/Bidding';
import BiddingChart from './components/BiddingChart';
import BiddingHistory from './components/BiddingHistory';
import ExplainReturnModal from './components/ExplainReturnModal';
import HarvestInfo from './components/HarvestInfo';
import { MILLISECOND_PER_DAY, TIMER } from './constants';
import { checkTimeIsMillisecond } from './helpers';
import { useGetBidding, useGetRound } from './hooks/useGetBidRound';
import styles from './index.module.scss';

const CoHarvest = () => {
  const mobileMode = isMobile();
  const currentActiveRound = useGetRound();
  const [selectedRound, setSelectedRound] = useState(currentActiveRound);
  const { biddingInfo } = useGetBidding(selectedRound);
  const isCurrentRound = selectedRound === currentActiveRound;

  const poolValue = biddingInfo?.distribution_info?.total_distribution;
  const startTime = biddingInfo?.bid_info?.start_time;

  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openBanner, setOpenBanner] = useState(false);

  // useEffect(() => {
  //   if (currentActiveRound && !selectedRound && currentActiveRound !== selectedRound) {
  //     setSelectedRound(currentActiveRound);
  //   }
  // }, [currentActiveRound]);

  useEffect(() => {
    // check pass if has startTime is in second number
    if (!(startTime && !checkTimeIsMillisecond(startTime))) return;

    const checkShowBanner = Date.now() <= new Date(startTime * TIMER.MILLISECOND + MILLISECOND_PER_DAY).getTime();

    setOpenBanner(checkShowBanner);
  }, [startTime]);

  const onStart = () => {
    setIsStarted(true);
  };

  const onEnd = () => {
    setIsEnd(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <BannerHistory openBanner={openBanner} setOpenBanner={setOpenBanner} />
      <div className={`${styles.container} ${openBanner ? styles.withBanner : ''}`}>
        <ExplainReturnModal open={isOpen} onClose={() => setIsOpen(false)} />

        {!mobileMode ? (
          <div className={styles.auction}>
            <div className={styles.top}>
              <div className={styles.bid}>
                <Bidding
                  openExplainModal={() => setIsOpen(true)}
                  round={selectedRound}
                  isEnd={isEnd}
                  isStarted={isStarted}
                  isCurrentRound={isCurrentRound}
                  backToCurrentRound={() => setSelectedRound(currentActiveRound)}
                />
              </div>
              <div className={styles.info}>
                <HarvestInfo
                  openExplainModal={() => setIsOpen(true)}
                  poolValue={poolValue}
                  bidInfo={biddingInfo.bid_info}
                  onEnd={onEnd}
                  onStart={onStart}
                  isCurrentRound={isCurrentRound}
                />
                <BiddingChart bidInfo={biddingInfo.bid_info} round={selectedRound} />
              </div>
            </div>
            <BiddingHistory round={currentActiveRound} filterRound={selectedRound} setFilterRound={setSelectedRound} />
          </div>
        ) : (
          <div className={styles.auction}>
            <HarvestInfo
              openExplainModal={() => setIsOpen(true)}
              poolValue={poolValue}
              bidInfo={biddingInfo.bid_info}
              onEnd={onEnd}
              onStart={onStart}
              isCurrentRound={isCurrentRound}
            />
            <Bidding
              openExplainModal={() => setIsOpen(true)}
              round={selectedRound}
              isEnd={isEnd}
              isStarted={isStarted}
              isCurrentRound={isCurrentRound}
              backToCurrentRound={() => setSelectedRound(currentActiveRound)}
            />
            <BiddingChart bidInfo={biddingInfo.bid_info} round={selectedRound} />
            <BiddingHistory round={currentActiveRound} filterRound={selectedRound} setFilterRound={setSelectedRound} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoHarvest;
