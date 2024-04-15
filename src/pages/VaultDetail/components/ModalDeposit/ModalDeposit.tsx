import {
  TokenItemType,
  CW20_DECIMALS,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  USDT_BSC_CONTRACT,
  toAmount
} from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDepositWithdrawVault } from 'pages/VaultDetail/hooks/useDepositWithdrawVault';
import { FC, useEffect, useState } from 'react';
import { InputWithOptionPercent } from '../InputWithOptionPercent';
import styles from './ModalDeposit.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { ModalDepositWithdrawProps } from 'pages/Vaults/type';
const cx = cn.bind(styles);

export const ModalDeposit: FC<ModalDepositWithdrawProps> = ({ isOpen, close, open, vaultDetail }) => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [depositAmount, setDepositAmount] = useState<bigint | null>(null);
  const [depositToken, setDepositToken] = useState<TokenItemType | null>(null);
  const { deposit, loading } = useDepositWithdrawVault();

  useEffect(() => {
    if (!vaultDetail) return;

    const tokenDepositInOraichain = oraichainTokensWithIcon.find(
      (t) => t.coinGeckoId === vaultDetail.tokenInfo0.coinGeckoId
    );
    setDepositToken(tokenDepositInOraichain);
  }, [vaultDetail, amounts]);

  const tokenDepositBalance = depositToken ? BigInt(amounts[depositToken.denom]) : 0n;

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
          token={depositToken}
          setAmountFromPercent={setDepositAmount}
          totalAmount={tokenDepositBalance}
          TokenIcon={vaultDetail.tokenInfo0.Icon}
        />
        {(() => {
          let disableMsg: string;
          if (depositAmount <= 0) disableMsg = 'Enter an amount';
          if (depositAmount > tokenDepositBalance) disableMsg = `Insufficient balance`;
          const disabled = loading || depositAmount <= 0 || depositAmount > tokenDepositBalance;

          return (
            <div className={cx('btn-confirm')}>
              <Button
                onClick={() =>
                  deposit({
                    amount: depositAmount,
                    userAddr: address,
                    evmDenom: ORAI_BRIDGE_EVM_DENOM_PREFIX + USDT_BSC_CONTRACT,
                    vaultAddr: vaultDetail?.vaultAddr
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
