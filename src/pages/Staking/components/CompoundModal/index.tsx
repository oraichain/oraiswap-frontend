import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as ArrowRight } from 'assets/icons/arrow_right_ic.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/icon_tooltip.svg';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TooltipIcon } from 'components/Tooltip';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useTheme from 'hooks/useTheme';
import { useRef, useState } from 'react';
import styles from './index.module.scss';

export type CompoundModalProps = {
  loading: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reward: number | string;
  oraixAmount: number | string;
};

const CompoundModal = ({ loading, open, onClose, onConfirm, reward, oraixAmount }: CompoundModalProps) => {
  const ref = useRef(null);
  const mobileMode = isMobile();
  const theme = useTheme();
  const [openTooltip, setOpenTooltip] = useState(false);

  useOnClickOutside(ref, () => {
    onClose();
  });

  const btnConfirmType = mobileMode ? 'primary-sm' : 'primary';

  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalConfirm} ref={ref}>
      <div className={styles.overlay} onClick={onClose}></div>

      <div className={styles.modalContent}>
        <div className={styles.closeIcon} onClick={onClose}>
          <CloseIcon />
        </div>

        <div className={styles.title}>
          Compound{' '}
          <TooltipIcon
            placement="auto"
            visible={openTooltip}
            icon={<IconTooltip />}
            setVisible={setOpenTooltip}
            content={
              <div className={classNames(styles.tooltip, styles[theme])}>
                The Compound auto-claims and reinvests your fees and rewards into your existing liquidity pool,
                enhancing and growing your investments effortlessly.
              </div>
            }
          />
        </div>

        <div className={styles.content}>
          <div className={styles.detail}>
            <div className={styles.coin}>
              <span className={styles.label}>Claimable Rewards</span>
              <span className={styles.value}>
                <UsdcIcon /> {reward}
              </span>
            </div>
            <div className={styles.arrow}>
              <ArrowRight />
            </div>
            <div className={styles.coin}>
              <span className={styles.label}>Est. Stake</span>
              <span className={styles.value}>
                {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />} {oraixAmount}
              </span>
            </div>
          </div>
          <div className={styles.desc}>
            Convert {reward} USDC to ≈{oraixAmount} ORAIX and stake
          </div>
          <div className={styles.noti}>
            Compound may not work at first try due to slippage, please retry if it happens
          </div>
        </div>
        <div className={styles.button}>
          <Button
            disabled={!oraixAmount}
            type={btnConfirmType}
            onClick={() => {
              onConfirm();
            }}
          >
            {loading && <Loader width={22} height={22} />}&nbsp; Compound
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompoundModal;
