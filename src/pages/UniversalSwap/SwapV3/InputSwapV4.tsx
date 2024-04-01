import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import cn from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { TokenInfo } from 'types/token';
import styles from './InputSwapV4.module.scss';

const cx = cn.bind(styles);

interface InputSwapProps {
  Icon: CoinIcon;
  IconNetwork: CoinIcon;
  setIsSelectToken: (value: boolean) => void;
  setIsSelectChain: (value: boolean) => void;
  token: TokenItemType;
  amount: number;
  tokenFee: number;
  onChangeAmount?: (amount: number | undefined) => void;
  balance: string | bigint;
  disable?: boolean;
  originalToken?: TokenInfo;
  setCoe?: React.Dispatch<React.SetStateAction<number>>;
  usdPrice: string;
  type?: string;
}

export default function InputSwapV4({
  Icon,
  IconNetwork,
  setIsSelectToken,
  setIsSelectChain,
  token,
  amount,
  onChangeAmount,
  tokenFee,
  balance,
  disable,
  originalToken,
  setCoe,
  usdPrice,
  type
}: InputSwapProps) {
  return (
    <>
      <div className={cx('input-swap-balance')}>
        <div className={cx('select-chain')}>
          <span>{type} </span>
          <div className={cx('left')} onClick={() => setIsSelectChain(true)}>
            <div className={cx('icon')}>{IconNetwork && <IconNetwork className={cx('logo')} />}</div>
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.org}</div>
            </div>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <div className={cx('show-balance')}>
          <TokenBalance
            balance={{
              amount: balance,
              decimals: originalToken?.decimals,
              denom: originalToken?.symbol || token?.name || ''
            }}
            prefix="Balance: "
            decimalScale={6}
          />

          {/* {type === 'from' && <div className={cx('percent')}>50%</div>}
          {type === 'from' && <div className={cx('percent')}>100%</div>} */}
        </div>
      </div>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectToken(true)}>
          <div className={cx('left')}>
            <div className={cx('icon')}>{Icon && <Icon className={cx('logo')} />}</div>
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
            </div>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
        <div className={cx('box-input')}>
          <div className={cx('input')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              className={cx('amount')}
              decimalScale={6}
              disabled={disable}
              type="text"
              value={amount}
              onChange={() => {
                setCoe(0);
              }}
              isAllowed={(values) => {
                const { floatValue } = values;
                // allow !floatValue to let user can clear their input
                return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
              }}
              onValueChange={({ floatValue }) => {
                onChangeAmount && onChangeAmount(floatValue);
              }}
            />
          </div>
          <div className={cx('usd')}>≈ ${amount ? Number(usdPrice) || 0 : 0}</div>
        </div>
      </div>
      {!!tokenFee && (
        <div className={cx('input-swap-fee')}>
          <div>Fee: {tokenFee}%</div>
        </div>
      )}
    </>
  );
}
