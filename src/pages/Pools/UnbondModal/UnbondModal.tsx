import React, { FC, useState } from 'react';
import ReactModal from 'react-modal';
import Modal from 'components/Modal';
import { TooltipIcon } from 'components/Tooltip';
import style from './UnbondModal.module.scss';
import cn from 'classnames/bind';
import { filteredTokens } from 'config/bridgeTokens';
import { getUsd } from 'libs/utils';
import TokenBalance from 'components/TokenBalance';
import { parseAmount, parseDisplayAmount } from 'libs/utils';
import NumberFormat from 'react-number-format';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { generateContractMessages, generateMiningMsgs, Type } from 'rest/api';
import CosmJs from 'libs/cosmjs';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import Loader from 'components/Loader';
import useGlobalState from 'hooks/useGlobalState';

const cx = cn.bind(style);

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  bondAmount: number;
  bondAmountUsd: number;
  lpTokenInfoData: any;
  assetToken: any;
  onBondingAction: any;
}

const UnbondModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  bondAmount,
  bondAmountUsd,
  lpTokenInfoData,
  assetToken,
  onBondingAction
}) => {
  const [chosenOption, setChosenOption] = useState(-1);
  const [unbondAmount, setUnbondAmount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [address] = useGlobalState('address');

  const handleUnbond = async (amount: number) => {
    const parsedAmount = +parseAmount(
      amount.toString(),
      lpTokenInfoData!.decimals
    );

    if (parsedAmount <= 0 || parsedAmount > bondAmount)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Amount is invalid!'
      });

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = await generateMiningMsgs({
        type: Type.UNBOND_LIQUIDITY,
        sender: address,
        amount: parsedAmount,
        assetToken
      });
      const msg = msgs[0];

      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: address,
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
      console.log('error in unbond form: ', error);
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
    <Modal
      isOpen={isOpen}
      close={close}
      open={open}
      isCloseBtn={false}
      className={cx('modal')}
    >
      <div className={cx('setting')}>
        <div className={cx('title')}>
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
                amount: bondAmount ? bondAmount : 0,
                denom: lpTokenInfoData.symbol
              }}
              prefix="Bonded Token Balance: "
              decimalScale={6}
            />

            <TokenBalance
              balance={bondAmountUsd}
              style={{ flexGrow: 1, textAlign: 'right' }}
              decimalScale={2}
            />
          </div>
          <div className={cx('input')}>
            <NumberFormat
              className={cx('amount')}
              thousandSeparator
              decimalScale={6}
              placeholder={'0'}
              value={!!unbondAmount ? unbondAmount : ''}
              onValueChange={({ floatValue }) =>
                setUnbondAmount(floatValue ?? 0)
              }
            />
          </div>
          <div className={cx('options')}>
            {[25, 50, 75, 100].map((option, idx) => (
              <div
                className={cx('item', {
                  isChosen: chosenOption === idx
                })}
                key={idx}
                onClick={() => {
                  setUnbondAmount((option * bondAmount) / (10 ** 6 * 100));
                  setChosenOption(idx);
                }}
              >
                {option}%
              </div>
            ))}
            <div
              className={cx('item', 'border', {
                isChosen: chosenOption === 4
              })}
              onClick={() => setChosenOption(4)}
            >
              <input
                placeholder="0.00"
                type={'number'}
                className={cx('input')}
                // value={chosenOption === 4 && !!unbondAmount ? unbondAmount : ''}
                onChange={(event) => {
                  setUnbondAmount(
                    (+event.target.value * bondAmount) / (10 ** 6 * 100)
                  );
                }}
              />
              %
            </div>
          </div>
        </div>
        <button
          className={cx('swap-btn')}
          onClick={() => handleUnbond(unbondAmount)}
          disabled={actionLoading}
        >
          {actionLoading && <Loader width={20} height={20} />}
          <span>Unbond</span>
        </button>
      </div>
    </Modal>
  );
};

export default UnbondModal;
