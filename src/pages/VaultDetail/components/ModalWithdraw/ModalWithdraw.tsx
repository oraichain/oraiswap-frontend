import { toAmount, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { useDepositWithdrawVault } from 'pages/VaultDetail/hooks/useDepositWithdrawVault';
import { useVaultFee } from 'pages/VaultDetail/hooks/useVaultFee';
import { VaultNetworkChainId } from 'pages/VaultDetail/type';
import { useGetShareBalance } from 'pages/Vaults/hooks';
import { ModalDepositWithdrawProps } from 'pages/Vaults/type';
import { FC, useState } from 'react';
import { InputWithOptionPercent } from '../InputWithOptionPercent';
import styles from './ModalWithdraw.module.scss';
const cx = cn.bind(styles);

export const ModalWithdraw: FC<ModalDepositWithdrawProps> = ({
  isOpen,
  close,
  open,
  vaultDetail,
  tokenDepositInOraichain
}) => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const [withdrawAmount, setWithdrawAmount] = useState<bigint | null>(null);
  const { withdraw, loading } = useDepositWithdrawVault();

  const { refetchShareBalance, shareBalance } = useGetShareBalance({
    vaultAddress: vaultDetail.vaultAddr,
    userAddress: address,
    oraiVaultShare: vaultDetail.oraiBalance
  });

  const { bridgeFee, relayerFee } = useVaultFee(tokenDepositInOraichain, VaultNetworkChainId[vaultDetail.network]);

  const withdrawAmountInUsdt = toDisplay(withdrawAmount, vaultDetail.lpToken.decimals) * vaultDetail.sharePrice;

  const withdrawFee = withdrawAmountInUsdt * bridgeFee * 0.01 + relayerFee;
  const receivedAmount = withdrawAmountInUsdt - withdrawFee;
  const renderBridgeFee = () => {
    return (
      <div className={styles.bridgeFee}>
        <div className={styles.relayerFee}>
          Withdraw fee:&nbsp;
          <span>
            ~{withdrawFee.toFixed(6)} {tokenDepositInOraichain.name}{' '}
          </span>
        </div>
        &nbsp;- Received amount:&nbsp;
        <span>
          ~{receivedAmount < 0 ? 0 : receivedAmount.toFixed(6)} {tokenDepositInOraichain.name}
        </span>
      </div>
    );
  };

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
            else setWithdrawAmount(toAmount(floatValue, vaultDetail.lpToken.decimals));
          }}
          value={withdrawAmount}
          token={vaultDetail.lpToken}
          setAmountFromPercent={setWithdrawAmount}
          totalAmount={BigInt(+shareBalance * Math.pow(10, vaultDetail.lpToken.decimals))}
          prefixText="Max Available to Withdraw: "
          decimals={vaultDetail.lpToken.decimals}
          amountInUsdt={withdrawAmountInUsdt}
        />
        {renderBridgeFee()}
        {(() => {
          let disableMsg: string;
          if (withdrawAmount <= 0) disableMsg = 'Enter an amount';
          if (withdrawAmount > BigInt(+shareBalance * Math.pow(10, vaultDetail.lpToken.decimals)))
            disableMsg = `Insufficient share`;

          return (
            <div className={cx('btn-confirm')}>
              <Button
                onClick={async () => {
                  await withdraw({
                    amount: withdrawAmount,
                    userAddr: address,
                    vaultAddr: vaultDetail.vaultAddr,
                    networkWithdraw: vaultDetail.network
                  });
                  refetchShareBalance();
                }}
                type="primary"
                disabled={Boolean(disableMsg)}
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
