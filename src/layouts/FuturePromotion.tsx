import React, { useEffect } from 'react';

import PromotionImage from 'assets/images/future-promotion.png';
import cn from 'classnames/bind';

import { Button } from 'components/Button';
import styles from './FuturePromotion.module.scss';

const cx = cn.bind(styles);

const LEARN_MORE_LINK = 'https://blog.orai.io/futures-trading-beta-competition-its-on-d755b198bea9';

const FuturePromotion: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openLearnMoreLink = () => {
    window.open(LEARN_MORE_LINK, '_blank');
  };

  // useEffect(() => {
  //   const TIMEOUT_TIME = 5000;
  //   const TIMEOUT_ID = setTimeout(() => {
  //     setIsOpen(true);
  //   }, TIMEOUT_TIME);

  //   return () => clearTimeout(TIMEOUT_ID);
  // }, []);

  if (isOpen)
    return (
      <div className={cx('future-promotion')}>
        <div className={cx('future-promotion-container')}>
          <div className={cx('future-promotion-img')}>
            <img src={PromotionImage} alt="promotion image" />
          </div>
          <div className={cx('content-container')}>
            <div className={cx('title')}>Futures Trading Beta Competition is live! 🎁</div>
            <div className={cx('description')}>
              Join now to be among the first to experience the feature, and earn rewards for your active involvement.
            </div>
            <div className={cx('actions')}>
              <Button type="secondary" onClick={() => setIsOpen(false)}>
                Skip
              </Button>
              <Button type="primary" onClick={openLearnMoreLink}>
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  return null;
};

export default FuturePromotion;
