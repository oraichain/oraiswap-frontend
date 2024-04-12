import { CW20_DECIMALS, ORAI_BRIDGE_EVM_DENOM_PREFIX, USDT_BSC_CONTRACT, toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDepositWithdrawVault } from 'pages/VaultDetail/hooks/useDepositWithdrawVault';
import { vaultInfos } from 'pages/Vaults/helpers/vault-query';
import { FC, useState } from 'react';
import { InputWithOptionPercent } from '../InputWithOptionPercent';
import styles from './ModalDeposit.module.scss';
const cx = cn.bind(styles);

export const ModalDeposit: FC<any> = ({ isOpen, close, open, totalTokenBalance }) => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const [depositAmount, setDepositAmount] = useState<bigint | null>(null);
  const { deposit, loading } = useDepositWithdrawVault();

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
            else setDepositAmount(toAmount(floatValue, CW20_DECIMALS));
          }}
          value={depositAmount}
          token={null}
          setAmountFromPercent={setDepositAmount}
          totalAmount={totalTokenBalance}
        />
        {(() => {
          let disableMsg: string;
          if (depositAmount <= 0) disableMsg = 'Enter an amount';
          if (depositAmount > totalTokenBalance) disableMsg = `Insufficient balance`;
          const disabled = loading || depositAmount <= 0 || depositAmount > totalTokenBalance;

          return (
            <div className={cx('btn-confirm')}>
              <Button
                onClick={() =>
                  deposit({
                    amount: depositAmount,
                    userAddr: address,
                    evmDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
                    vaultAddr: vaultInfos[0].vaultAddr
                  })
                }
                type="primary"
                disabled={disabled}
              >
                {loading && <Loader width={22} height={22} />}
                {disableMsg || 'Deposit'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
