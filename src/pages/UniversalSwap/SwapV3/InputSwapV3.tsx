import styles from './InputSwap.module.scss';
import cn from 'classnames/bind';
import NumberFormat from 'react-number-format';
import TokenBalance from 'components/TokenBalance';
import ArrowImg from 'assets/icons/arrow_new.svg';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { TokenInfo } from 'types/token';
import { CoinGeckoId, CoinIcon, TokenItemType } from '@oraichain/oraidex-common';

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
  originalToken
}: InputSwapProps) {
  return (
    <>
      <div className={cx('input-swap-box')}>
        <div className={cx('box-select')} onClick={() => setIsSelectFrom(true)}>
          <div className={cx('left')}>
            <div className={cx('icon')}>
              {Icon && <Icon className={cx('logo')} />}
            </div>
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
          onValueChange={({ floatValue }) => {
            onChangeAmount && onChangeAmount(floatValue);
          }}
        />
      </div>
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
        <div>≈ ${!amount ? 0 : (prices?.[originalToken?.coinGeckoId] * amount).toFixed(6)}</div>
      </div>
      {!!tokenFee && (
        <div className={cx('input-swap-fee')}>
          <div>Fee: {tokenFee}%</div>
        </div>
      )}
    </>
  );
}
