import { toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { EVM_DECIMALS } from 'helper/constants';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDepositWithdrawVault } from 'pages/VaultDetail/hooks/useDepositWithdrawVault';
import { vaultInfos } from 'pages/Vaults/helpers/vault-query';
import { FC, useState } from 'react';
import { InputWithOptionPercent } from '../InputWithOptionPercent';
import styles from './ModalWithdraw.module.scss';
const cx = cn.bind(styles);

export const ModalWithdraw: FC<any> = ({ isOpen, close, open, totalShare }) => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const [withdrawAmount, setWithdrawAmount] = useState<bigint | null>(null);
  const { withdraw, loading } = useDepositWithdrawVault();

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Withdraw</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <InputWithOptionPercent
          onValueChange={({ floatValue }) => {
            if (floatValue === undefined) setWithdrawAmount(null);
            else setWithdrawAmount(toAmount(floatValue, EVM_DECIMALS));
          }}
          value={withdrawAmount}
          token={null}
          setAmountFromPercent={setWithdrawAmount}
          totalAmount={totalShare}
          prefixText="Max Available to Withdraw: "
          decimals={EVM_DECIMALS}
        />
        {(() => {
          let disableMsg: string;
          if (withdrawAmount <= 0) disableMsg = 'Enter an amount';
          if (withdrawAmount > totalShare) disableMsg = `Insufficient share`;
          const disabled = loading || withdrawAmount <= 0 || withdrawAmount > totalShare;

          return (
            <div className={cx('btn-confirm')}>
              <Button
                onClick={() =>
                  withdraw({
                    amount: withdrawAmount,
                    userAddr: address,
                    vaultAddr: vaultInfos[0].vaultAddr
                  })
                }
                type="primary"
                disabled={disabled}
              >
                {loading && <Loader width={22} height={22} />}
                {disableMsg || 'Withdraw'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
