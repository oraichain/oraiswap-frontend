import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import ImgPairPath from 'assets/images/pair_path.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import { FC } from 'react';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './AddLiquidityModal.module.scss';

import { useAddLiquidity } from 'pages/Pools/hooks/useAddLiquidity';
import InputWithOptionPercent from '../InputWithOptionPercent';

const cx = cn.bind(styles);

export const AddLiquidityModal: FC<ModalProps> = ({ isOpen, close, onLiquidityChange, pairDenoms }) => {
  const [theme] = useConfigReducer('theme');

  const {
    token1,
    token2,
    baseAmount,
    quoteAmount,
    recentInput,
    actionAllLoading,
    actionLoading,
    isToken1AllowanceToPairLoading,
    isToken2AllowanceToPairLoading,
    token1Balance,
    token2Balance,
    lpTokenInfoData,
    pairInfoData,
    estimatedShare,
    toAmount,
    onChangeAmount1,
    onChangeAmount2,
    handleAddLiquidity,
    handleDepositAndStakeAll
  } = useAddLiquidity(pairDenoms, onLiquidityChange);

  const Token1Icon = theme === 'light' ? token1?.IconLight || token1?.Icon : token1?.Icon;
  const Token2Icon = theme === 'light' ? token2?.IconLight || token2?.Icon : token2?.Icon;

  return (
    <Modal isOpen={isOpen} close={close} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Deposit</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className={cx('pair-path')}>
          <img src={ImgPairPath} alt="pair_path" width={'100%'} height={'100%'} />
        </div>

        <InputWithOptionPercent
          TokenIcon={Token1Icon}
          onChange={(e: any) => {
            onChangeAmount1(toAmount(Number(e.target.value.replaceAll(',', '')), token2.decimals));
          }}
          value={baseAmount}
          token={token1}
          setAmountFromPercent={onChangeAmount1}
          totalAmount={token1Balance}
          isFocus={recentInput === 1}
          hasPath
          showIcon
        />

        <InputWithOptionPercent
          TokenIcon={Token2Icon}
          value={quoteAmount}
          onChange={(e: any) => {
            onChangeAmount2(toAmount(Number(e.target.value.replaceAll(',', '')), token2.decimals));
          }}
          token={token2}
          setAmountFromPercent={onChangeAmount2}
          totalAmount={token2Balance}
          isFocus={recentInput === 2}
          hasPath
          showIcon
        />
        <div className={cx('detail')}>
          <div className={cx('row', theme)}>
            <div className={cx('row-title')}>
              <span>Receive</span>
            </div>
            <div className={cx('row-amount')}>
              <TokenBalance
                balance={{
                  amount: estimatedShare.toString() || '0',
                  decimals: lpTokenInfoData?.decimals
                }}
                suffix=" LP"
                decimalScale={6}
              />
            </div>
          </div>
        </div>
        {(() => {
          let disableMsg: string;
          if (baseAmount <= 0 || quoteAmount <= 0) disableMsg = 'Enter an amount';
          if (baseAmount > token1Balance) disableMsg = `Insufficient ${token1?.name} balance`;
          else if (quoteAmount > token2Balance) disableMsg = `Insufficient ${token2?.name} balance`;

          const disabled =
            actionLoading ||
            actionAllLoading ||
            !token1 ||
            !token2 ||
            !pairInfoData ||
            isToken1AllowanceToPairLoading ||
            isToken2AllowanceToPairLoading ||
            !!disableMsg;
          return (
            <div className={cx('btn-confirm')}>
              {disableMsg ? (
                <Button onClick={() => handleAddLiquidity(baseAmount, quoteAmount)} type="primary" disabled={disabled}>
                  {actionLoading && <Loader width={30} height={30} />}
                  {disableMsg || 'Confirm'}
                </Button>
              ) : (
                <div className={cx('btn-group')}>
                  <Button
                    onClick={() => handleAddLiquidity(baseAmount, quoteAmount)}
                    type="secondary"
                    disabled={disabled}
                  >
                    {actionLoading && <Loader width={22} height={22} />}
                    {'Deposit'}
                  </Button>
                  <Button
                    onClick={() => handleDepositAndStakeAll(baseAmount, quoteAmount)}
                    type="primary"
                    disabled={disabled}
                  >
                    {actionAllLoading && <Loader width={22} height={22} />}
                    {'Deposit & Stake All'}
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
