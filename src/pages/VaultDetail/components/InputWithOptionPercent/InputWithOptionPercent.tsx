import { CW20_DECIMALS, TokenInfo, toAmount, toDisplay, CoinIcon } from '@oraichain/oraidex-common';
import classNames from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './InputWithOptionPercent.module.scss';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';

const cx = classNames.bind(styles);

export const InputWithOptionPercent: FC<{
  setAmountFromPercent: (value: bigint) => void;
  onValueChange?: (value: any) => void;
  onChange?: (e: any) => void;
  totalAmount: bigint;
  percentList?: number[];
  value: bigint | null;
  token?: TokenInfo;
  hasPath?: boolean;
  isFocus?: boolean;
  prefixText?: string;
  TokenIcon?: CoinIcon;
}> = ({
  setAmountFromPercent,
  onValueChange,
  onChange,
  value,
  token,
  totalAmount,
  percentList = [25, 50, 75, 100],
  hasPath = false,
  isFocus = true,
  prefixText = 'Balance: ',
  TokenIcon
}) => {
  const [chosenOption, setChosenOption] = useState(-1);
  const [theme] = useConfigReducer('theme');
  const [inputValue, setInputValue] = useState<number | string>('');

  const onChangePercent = (percent: number) => {
    const HUNDRED_PERCENT_IN_CW20_DECIMALS = 100000000;
    setAmountFromPercent((toAmount(percent, CW20_DECIMALS) * totalAmount) / BigInt(HUNDRED_PERCENT_IN_CW20_DECIMALS));
  };

  return (
    <div className={cx('supply', theme, { 'has-path': hasPath })} key={token?.denom}>
      <div className={cx('balance')}>
        <div className={cx('amount', theme)}>
          <TokenBalance
            balance={{
              amount: totalAmount || BigInt(0),
              denom: token?.symbol || token?.name || '',
              decimals: token?.decimals
            }}
            prefix={prefixText}
            decimalScale={6}
          />
        </div>
      </div>

      <div className={cx('input')}>
        <div className={styles.strategy}>
          <div className={styles.strategyLogo}>
            <UsdtIcon width={32} height={32} />
          </div>
          <div className={`${styles.strategyName} ${styles[theme]}`}>
            <div className={styles.strategyNameTitle}>USDT</div>
            <div className={styles.strategyNameValue}>Tether</div>
          </div>
        </div>
        <div className={cx('input-amount')}>
          <NumberFormat
            className={cx('amount', theme)}
            thousandSeparator
            decimalScale={6}
            placeholder={'0'}
            value={value === null ? '' : toDisplay(value, token?.decimals)}
            allowNegative={false}
            onChange={(e) => {
              onChange && onChange(e);
              setChosenOption(-1);
            }}
            onValueChange={(value) => {
              onValueChange && onValueChange(value);
            }}
            isAllowed={(values) => {
              const { floatValue } = values;
              // allow !floatValue to let user can clear their input
              return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
            }}
          />
        </div>
      </div>
      <div className={cx('options')}>
        {percentList.map((option, idx) => (
          <div
            className={cx('item', theme, {
              isChosen: isFocus && chosenOption === idx
            })}
            key={idx}
            onClick={() => {
              setAmountFromPercent((BigInt(option) * totalAmount) / BigInt(100));
              setChosenOption(idx);
              setInputValue('');
            }}
          >
            {option}%
          </div>
        ))}
        <div
          className={cx('item', theme, 'border', {
            isChosen: isFocus && chosenOption === 4
          })}
          onClick={() => setChosenOption(4)}
        >
          <input
            placeholder="0.00"
            type={'number'}
            value={inputValue}
            className={cx('input', theme)}
            onChange={(event) => {
              onChangePercent(+event.target.value);
              setInputValue(event.target.value);
            }}
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
};
