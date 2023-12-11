import { CoinGeckoId, CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import cn from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import NumberFormat from 'react-number-format';
import { TokenInfo } from 'types/token';
import styles from './InputSwap.module.scss';

const cx = cn.bind(styles);

interface InputSwapProps {
  Icon: CoinIcon;
  setIsSelectFrom: (value: boolean) => void;
  token: TokenItemType;
  amount: number;
  prices?: CoinGeckoPrices<CoinGeckoId>;
  tokenFee: number;
  onChangeAmount?: (amount: number | undefined) => void;
  balance: string | bigint;
  disable?: boolean;
  originalToken?: TokenInfo;
  setCoe?: React.Dispatch<React.SetStateAction<number>>;
  usdPrice: string;
}

export default function InputSwapV3({
  Icon,
  setIsSelectFrom,
  token,
  amount,
  onChangeAmount,
  tokenFee,
  balance,
  disable,
  prices,
  originalToken,
  setCoe,
  usdPrice
}: InputSwapProps) {
  return (
    <>
      <div className={cx('input-swap-balance')}>
        <div>
          <TokenBalance
            balance={{
              amount: balance,
              decimals: originalToken?.decimals,
              denom: originalToken?.symbol || token?.name || ''
            }}
            prefix="Balance: "
            decimalScale={6}
          />
        </div>
        <div>≈ ${!amount ? 0 : usdPrice}</div>
      </div>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectFrom(true)}>
          <div className={cx('left')}>
            <div className={cx('icon')}>{Icon && <Icon className={cx('logo')} />}</div>
            <div className={cx('section')}>
              <div className={cx('name')}>{token?.name}</div>
              <div className={cx('chain')}>{token?.org}</div>
            </div>
          </div>
          <div className={cx('right')}>
            <img src={ArrowImg} alt="arrow" />
          </div>
        </div>
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
      {!!tokenFee && (
        <div className={cx('input-swap-fee')}>
          <div>Fee: {tokenFee}%</div>
        </div>
      )}
    </>
  );
}
