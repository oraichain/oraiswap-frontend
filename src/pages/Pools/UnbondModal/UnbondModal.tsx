import cn from 'classnames/bind';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import CosmJs from 'libs/cosmjs';
import { toAmount, toDisplay } from 'libs/utils';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Type, generateMiningMsgs } from 'rest/api';
import { TokenInfo } from 'types/token';
import styles from './UnbondModal.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';

const cx = cn.bind(styles);

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  bondAmount: string;
  bondAmountUsd: number;
  lpTokenInfoData: TokenInfo;
  assetToken: any;
  onBondingAction: any;
}

const UnbondModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  bondAmount: bondAmountValue,
  bondAmountUsd,
  lpTokenInfoData,
  assetToken,
  onBondingAction
}) => {
  const [chosenOption, setChosenOption] = useState(-1);
  const [unbondAmount, setUnbondAmount] = useState(BigInt(0));
  const [actionLoading, setActionLoading] = useState(false);
  const [theme] = useConfigReducer('theme');
  const bondAmount = BigInt(bondAmountValue);

  const handleUnbond = async (parsedAmount: bigint) => {
    if (parsedAmount <= 0 || parsedAmount > bondAmount)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Amount is invalid!'
      });

    const oraiAddress = await handleCheckAddress();

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msg = generateMiningMsgs({
        type: Type.UNBOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        assetToken
      });
      const result = await CosmJs.execute({
        address: msg.contractAddress,
        walletAddr: oraiAddress,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        funds: msg.funds
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
      console.log('error in unbond form: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('setting', theme)}>
        <div className={cx('title', theme)}>
          <div>Unbond LP tokens</div>
          {/* <TooltipIcon
            content="The transfer won’t go through if the bridge rate moves
                        unfavorably by more than this percentage when the
                        transfer is executed."
          /> */}
        </div>
        <div className={cx('supply')}>
          <div className={cx('balance')}>
            <TokenBalance
              balance={{
                amount: bondAmount,
                denom: lpTokenInfoData.symbol,
                decimals: lpTokenInfoData.decimals
              }}
              prefix="Bonded Token Balance: "
              decimalScale={6}
            />

            <TokenBalance balance={bondAmountUsd} style={{ flexGrow: 1, textAlign: 'right' }} decimalScale={2} />
          </div>
          <div className={cx('input')}>
            <NumberFormat
              className={cx('amount', theme)}
              thousandSeparator
              decimalScale={6}
              placeholder={'0'}
              value={toDisplay(unbondAmount, lpTokenInfoData.decimals)}
              onValueChange={({ floatValue }) => setUnbondAmount(toAmount(floatValue, lpTokenInfoData.decimals))}
            />
          </div>
          <div className={cx('options')}>
            {[25, 50, 75, 100].map((option, idx) => (
              <div
                className={cx('item', theme, {
                  isChosen: chosenOption === idx
                })}
                key={idx}
                onClick={() => {
                  setUnbondAmount((BigInt(option) * bondAmount) / BigInt(100));
                  setChosenOption(idx);
                }}
              >
                {option}%
              </div>
            ))}
            <div
              className={cx('item', theme, 'border', {
                isChosen: chosenOption === 4
              })}
              onClick={() => setChosenOption(4)}
            >
              <input
                placeholder="0.00"
                type={'number'}
                className={cx('input', theme)}
                onChange={(event) => {
                  // multiply 10^6 then divide 10^8
                  setUnbondAmount((toAmount(Number(event.target.value), 6) * bondAmount) / BigInt(100000000));
                }}
              />
              %
            </div>
          </div>
        </div>
        <button className={cx('swap-btn')} onClick={() => handleUnbond(unbondAmount)} disabled={actionLoading}>
          {actionLoading && <Loader width={20} height={20} />}
          <span>Unbond</span>
        </button>
      </div>
    </Modal>
  );
};

export default UnbondModal;
