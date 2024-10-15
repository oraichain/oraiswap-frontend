import { minimize } from 'helper';
import styles from './index.module.scss';
import { TokenItemType } from '@oraichain/oraidex-common';
import { FC } from 'react';
import classNames from 'classnames';
import { numberWithCommas } from 'helper/format';

interface PriceDetailProps {
  leftInput: number;
  rightInput: number;
  currentPrice: number;
  tokenX: TokenItemType;
  tokenY: TokenItemType;
}

const PriceDetail: FC<PriceDetailProps> = ({ leftInput, rightInput, currentPrice, tokenX, tokenY }) => {
  return (
    <div className={styles.minMaxPriceWrapper}>
      <div className={styles.item}>
        <div className={styles.minMaxPrice}>
          <div className={styles.minMaxPriceTitle}>
            <p>Min Price</p>
          </div>
          <div className={styles.minMaxPriceValue}>
            <p>
              <p>{minimize(leftInput.toString())}</p>
              <p className={styles.pair}>
                {tokenY.name.toUpperCase()} / {tokenX.name.toUpperCase()}
              </p>
            </p>
          </div>
        </div>
        <div className={styles.percent}>
          <p>Min Current Price:</p>
          <span className={classNames(styles.value, { [styles.positive]: false })}>
            {(((+leftInput - currentPrice) / currentPrice) * 100).toLocaleString(undefined, {
              maximumFractionDigits: 3
            })}
            %
          </span>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.minMaxPrice}>
          <div className={styles.minMaxPriceTitle}>
            <p>Max Price</p>
          </div>
          <div className={styles.minMaxPriceValue}>
            <p>
              {/* <p>{numberWithCommas(Number(rightInputRounded), undefined, { maximumFractionDigits: 6 })}</p> */}
              <p>{minimize(rightInput.toString())}</p>
              <p className={styles.pair}>
                {tokenY.name.toUpperCase()} / {tokenX.name.toUpperCase()}
              </p>
            </p>
          </div>
        </div>
        <div className={classNames(styles.percent, styles.maxCurrentPrice)}>
          <p>Max Current Price:</p>
          <span className={classNames(styles.value, { [styles.positive]: true })}>
            {numberWithCommas(((+rightInput - currentPrice) / currentPrice) * 100, undefined, {
              maximumFractionDigits: 3
            })}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetail;
