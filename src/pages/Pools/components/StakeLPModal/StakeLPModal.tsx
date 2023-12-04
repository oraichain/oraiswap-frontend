import { toAmount } from '@oraichain/oraidex-common/build/helper';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useStakeLP } from 'pages/Pools/hooks/useStakeLP';
import { FC } from 'react';
import { PoolModalProps } from 'types/pool';
import InputWithOptionPercent from '../InputWithOptionPercent';
import styles from './StakeLPModal.module.scss';

const cx = cn.bind(styles);

export const StakeLPModal: FC<PoolModalProps> = ({ isOpen, close, open, myLpBalance, myLpUsdt, onLiquidityChange }) => {
  const [theme] = useConfigReducer('theme');
  const {
    actionLoading,
    lpTokenInfoData,
    lpTokenBalance,
    pairInfoData,
    bondAmountInUsdt,
    bondAmount,
    setBondAmount,
    handleBond
  } = useStakeLP({ myLpBalance, myLpUsdt, onLiquidityChange });

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Stake LP</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>

        <InputWithOptionPercent
          onValueChange={({ floatValue }) => {
            if (floatValue === undefined) setBondAmount(null);
            else setBondAmount(toAmount(floatValue, lpTokenInfoData?.decimals));
          }}
          value={bondAmount}
          token={lpTokenInfoData}
          setAmountFromPercent={setBondAmount}
          totalAmount={lpTokenBalance}
          apr={toFixedIfNecessary(pairInfoData?.apr.toString() || '0', 2)}
          amountInUsdt={bondAmountInUsdt}
        />
        {(() => {
          let disableMsg: string;
          if (bondAmount <= 0) disableMsg = 'Enter an amount';
          if (bondAmount > lpTokenBalance) disableMsg = `Insufficient LP token balance`;

          const disabled = actionLoading || bondAmount <= 0 || bondAmount > lpTokenBalance;
          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleBond(bondAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={22} height={22} />}
                {disableMsg || 'Stake'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
