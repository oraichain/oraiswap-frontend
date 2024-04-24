import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import styles from './index.module.scss';
import classNames from 'classnames';
import { floatToPercent } from 'helper';

const SwapDetail = ({
  simulatePrice,
  expected,
  minimumReceived,
  slippage,

  relayerFee,
  bridgeFee,
  totalFee,
  swapFee,

  isOpen,
  onClose,
  tokenName
}: {
  simulatePrice: number | string;
  expected: number | string;
  minimumReceived: number | string;
  slippage: number | string;

  relayerFee: number | string;
  bridgeFee: number | string;
  totalFee: number | string;
  swapFee: number | string;

  isOpen: boolean;
  onClose: () => void;
  tokenName: string;
}) => {
  return (
    <div>
      {/* {isOpen && <div className={styles.overlay} onClick={onClose}></div>} */}

      <div className={classNames(styles.swapDetail, { [styles.active]: isOpen })}>
        <div className={styles.header}>
          <div></div>
          <div className={styles.titleHeader}>Details</div>
          <div className={styles.close} onClick={onClose}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.detail}>
          <div className={styles.titleDetail}>Summary</div>
          <div className={styles.summary}>
            <div className={styles.content}>
              <div className={styles.row}>
                <div className={styles.title}>
                  <span>Exchange Rate:</span>
                </div>
                <div className={styles.value}>
                  ≈ {simulatePrice} {tokenName}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.title}>
                  <span>Expected Output:</span>
                </div>
                <div className={styles.value}>
                  ≈ {expected} {tokenName}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.title}>
                  <span>Minimum Received:</span>
                </div>
                <div className={styles.value}>
                  ≈ {minimumReceived} {tokenName}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.title}>
                  <span>Slippage Rate:</span>
                </div>
                <div className={styles.value}>
                  ≈ {slippage} {tokenName}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.titleDetail}>Estimated Fee</div>
          <div className={styles.feeWrapper}>
            <div className={styles.row}>
              <div className={styles.title}>
                <span>Relayer Fees:</span>
              </div>
              <div className={styles.value}>
                ≈ {relayerFee} {tokenName}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>
                <span>Bridge Fees:</span>
              </div>
              <div className={styles.value}>
                ≈ {bridgeFee} {tokenName}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.title}>
                <span>Swap Fees:</span>
              </div>
              <span>{floatToPercent(Number(swapFee)) + '%'}</span>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>
                <span>Total:</span>
              </div>

              <div className={styles.value}>
                ≈ {totalFee} {tokenName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetail;
