import { toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { FC, useState } from 'react';
import { InputWithOptionPercent } from '../InputWithOptionPercent';
import styles from './ModalDeposit.module.scss';
const cx = cn.bind(styles);

export const ModalDeposit: FC<any> = ({ isOpen, close, open, onLiquidityChange, lpPrice }) => {
  const [theme] = useConfigReducer('theme');

  const [actionLoading, setActionLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<bigint | null>(null);
  const [unbondAmountInUsdt, setUnBondAmountInUsdt] = useState(0);

  const totalTokenBalance = 1;

  const onUnbonedSuccess = () => {};

  const handleDeposit = async (parsedAmount: bigint) => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
    } catch (error) {
      console.log('error in handleDeposit: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Deposit</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <InputWithOptionPercent
          onValueChange={({ floatValue }) => {
            if (floatValue === undefined) setDepositAmount(null);
            else setDepositAmount(toAmount(floatValue, 6));
          }}
          value={depositAmount}
          token={null}
          setAmountFromPercent={setDepositAmount}
          totalAmount={1n}
          amountInUsdt={unbondAmountInUsdt}
        />
        {(() => {
          let disableMsg: string;
          if (depositAmount <= 0) disableMsg = 'Enter an amount';
          if (depositAmount > totalTokenBalance) disableMsg = `Insufficient balance`;
          const disabled = actionLoading || depositAmount <= 0 || depositAmount > totalTokenBalance;

          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleDeposit(depositAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={22} height={22} />}
                {disableMsg || 'Deposit'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
