import cn from 'classnames/bind';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from 'config/bridgeTokens';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { toAmount, toDisplay } from 'libs/utils';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import { generateMiningMsgs, Type } from 'rest/api';
import { TokenInfo } from 'types/token';
import styles from './BondingModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  lpTokenInfoData: TokenInfo;
  lpTokenBalance: string;
  liquidityValue: number;
  assetToken: TokenItemType;
  onBondingAction: Function;
  apr: number;
}

const BondingModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  lpTokenInfoData,
  lpTokenBalance: lpTokenBalanceValue,
  liquidityValue,
  assetToken,
  onBondingAction,
  apr
}) => {
  const [bondAmount, setBondAmount] = useState(BigInt(0));
  const [actionLoading, setActionLoading] = useState(false);

  const lpTokenBalance = BigInt(lpTokenBalanceValue);

  const handleBond = async (parsedAmount: bigint) => {
    if (parsedAmount <= 0 || parsedAmount > lpTokenBalance)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Amount is invalid!'
      });

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await window.Keplr.getKeplrAddr();
      if (!oraiAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login both metamask and keplr!'
        });
        return;
      }

      const msgs = await generateMiningMsgs({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        lpToken: lpTokenInfoData.contractAddress!,
        assetToken
      });

      const msg = msgs[0];
      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: oraiAddress,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        handleOptions: { funds: msg.sent_funds }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        onBondingAction();
      }
    } catch (error) {
      console.log('error in bond form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      <div className={cx('container')}>
        <div className={cx('title')}>Bond LP tokens</div>

        <div className={cx('detail')}>
          {apr && (
            <div className={cx('row')}>
              <div className={cx('row-title')}>
                <span>Current APR</span>
              </div>
              <span className={cx('row-des', 'highlight')}>{apr.toFixed(2)}%</span>
            </div>
          )}
        </div>
        <div className={cx('supply')}>
          <div className={cx('header')}>
            <div className={cx('title')}>AMOUNT TO BOND</div>
          </div>
          <div className={cx('balance')}>
            <TokenBalance
              balance={{
                amount: lpTokenBalance,
                denom: lpTokenInfoData?.symbol,
                decimals: lpTokenInfoData?.decimals
              }}
              decimalScale={6}
              prefix="Balance: "
            />

            <div className={cx('btn')} onClick={() => setBondAmount(lpTokenBalance)}>
              MAX
            </div>
            <div className={cx('btn')} onClick={() => setBondAmount(lpTokenBalance / BigInt(2))}>
              HALF
            </div>
            <TokenBalance style={{ flexGrow: 1, textAlign: 'right' }} balance={liquidityValue} decimalScale={2} />
          </div>
          <div className={cx('input')}>
            <NumberFormat
              className={cx('amount')}
              thousandSeparator
              decimalScale={6}
              placeholder={'0'}
              // type="input"
              value={toDisplay(bondAmount, lpTokenInfoData.decimals)}
              onChange={(e: { target: { value: string } }) => {
                setBondAmount(toAmount(Number(e.target.value.replaceAll(',', '')), lpTokenInfoData.decimals));
              }}
            />
          </div>
        </div>

        <button className={cx('swap-btn')} onClick={() => handleBond(bondAmount)} disabled={actionLoading}>
          {actionLoading && <Loader width={20} height={20} />}
          <span>Bond</span>
        </button>
      </div>
    </Modal>
  );
};

export default BondingModal;
