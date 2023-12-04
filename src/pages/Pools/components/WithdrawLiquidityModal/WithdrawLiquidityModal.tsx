import { toAmount } from '@oraichain/oraidex-common/build/helper';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import { useWithdrawLP } from 'pages/Pools/hooks/useWithdrawLP';
import { FC } from 'react';
import { PoolModalProps } from 'types/pool';
import InputWithOptionPercent from '../InputWithOptionPercent';
import styles from './WithdrawLiquidityModal.module.scss';

const cx = cn.bind(styles);

export const WithdrawLiquidityModal: FC<PoolModalProps> = ({
  isOpen,
  close,
  open,
  onLiquidityChange,
  myLpUsdt,
  myLpBalance
}) => {
  const [theme] = useConfigReducer('theme');
  const {
    actionLoading,
    token1,
    token2,
    pairInfoData,
    lpTokenBalance,
    lpTokenInfoData,
    lp1BurnAmount,
    lp2BurnAmount,
    lpAmountBurnUsdt,
    lpAmountBurn,
    setLpAmountBurn,
    handleWithdrawLiquidity
  } = useWithdrawLP({
    myLpBalance,
    myLpUsdt,
    onLiquidityChange
  });

  const Token1Icon = theme === 'light' ? token1?.IconLight || token1?.Icon : token1?.Icon;
  const Token2Icon = theme === 'light' ? token2?.IconLight || token2?.Icon : token2?.Icon;

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Withdraw LP</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>

        <InputWithOptionPercent
          onValueChange={({ floatValue }) => {
            if (floatValue === undefined) setLpAmountBurn(null);
            else setLpAmountBurn(toAmount(floatValue, lpTokenInfoData?.decimals));
          }}
          value={lpAmountBurn}
          token={lpTokenInfoData}
          setAmountFromPercent={setLpAmountBurn}
          totalAmount={lpTokenBalance}
          prefixText="Token Balance: "
          amountInUsdt={lpAmountBurnUsdt}
        />

        <div className={cx('detail')}>
          {/* <div className={cx('arrow-down', theme)}>
            <div className={cx('inner-arrow', theme)}>
              <ArrowDownIcon />
            </div>
          </div> */}
          <div className={cx('row', theme)}>
            <div className={cx('row-title')}>
              <span>Receive</span>
            </div>
            <div className={cx('row-amount')}>
              <div className={cx('token')}>
                {Token1Icon && <Token1Icon className={cx('logo')} />}
                <div className={cx('title', theme)}>
                  <div>{token1?.name}</div>
                  <div className={cx('des')}>Oraichain</div>
                </div>
              </div>
              <div className={cx('input-amount')}>
                <TokenBalance
                  balance={{
                    amount: lp1BurnAmount,
                    decimals: token1?.decimals
                  }}
                  decimalScale={6}
                />
              </div>
            </div>
            <div className={cx('row-amount')}>
              <div className={cx('token')}>
                {Token2Icon && <Token2Icon className={cx('logo')} />}
                <div className={cx('title', theme)}>
                  <div>{token2?.name}</div>
                  <div className={cx('des')}>Oraichain</div>
                </div>
              </div>
              <div className={cx('input-amount')}>
                <TokenBalance
                  balance={{
                    amount: lp2BurnAmount,
                    decimals: token2?.decimals
                  }}
                  decimalScale={6}
                />
              </div>
            </div>
          </div>
        </div>
        {(() => {
          let disableMsg: string;
          if (lpAmountBurn <= 0) disableMsg = 'Enter an amount';
          if (lpAmountBurn > lpTokenBalance) disableMsg = `Insufficient LP token balance`;

          const disabled = actionLoading || !lpTokenInfoData || !pairInfoData || !!disableMsg;
          return (
            <div className={cx('btn-confirm')}>
              <Button
                onClick={() => handleWithdrawLiquidity(lpAmountBurn.toString())}
                type="primary"
                disabled={disabled}
              >
                {actionLoading && <Loader width={22} height={22} />}
                {disableMsg || 'Confirm'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
