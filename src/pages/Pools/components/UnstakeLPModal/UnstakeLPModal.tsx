import { toAmount } from '@oraichain/oraidex-common/build/helper';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useUnstakeLP } from 'pages/Pools/hooks/useUnstakeLP';
import { FC } from 'react';
import { PoolModalProps } from 'types/pool';
import InputWithOptionPercent from '../InputWithOptionPercent';
import styles from './UnstakeLPModal.module.scss';

const cx = cn.bind(styles);

export const UnstakeLPModal: FC<PoolModalProps> = ({ isOpen, close, open, onLiquidityChange, lpPrice }) => {
  const [theme] = useConfigReducer('theme');
  const {
    actionLoading,
    totalBondAmount,
    pairInfoData,
    lpTokenInfoData,
    unbondAmountInUsdt,
    unbondAmount,
    setUnbondAmount,
    handleUnbond
  } = useUnstakeLP({ onLiquidityChange, lpPrice });

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Unstake LP</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        {/* <div className={cx('apr')}>Current APR: {toFixedIfNecessary(pairInfoData?.apr.toString() || '0', 2)}%</div> */}

        <InputWithOptionPercent
          onValueChange={({ floatValue }) => {
            if (floatValue === undefined) setUnbondAmount(null);
            else setUnbondAmount(toAmount(floatValue, lpTokenInfoData?.decimals));
          }}
          value={unbondAmount}
          token={lpTokenInfoData}
          setAmountFromPercent={setUnbondAmount}
          totalAmount={totalBondAmount}
          apr={toFixedIfNecessary(pairInfoData?.apr.toString() || '0', 2)}
          prefixText="Staked LP Balance: "
          amountInUsdt={unbondAmountInUsdt}
        />
        {(() => {
          let disableMsg: string;
          if (unbondAmount <= 0) disableMsg = 'Enter an amount';
          if (unbondAmount > totalBondAmount) disableMsg = `Insufficient LP token balance`;
          const disabled = actionLoading || unbondAmount <= 0 || unbondAmount > totalBondAmount || !pairInfoData;

          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleUnbond(unbondAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={22} height={22} />}
                {disableMsg || 'Unstake'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
