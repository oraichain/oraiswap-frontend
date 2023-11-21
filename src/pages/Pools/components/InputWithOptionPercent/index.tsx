import { CW20_DECIMALS, toAmount, toDisplay } from '@oraichain/oraidex-common';
import classNames from 'classnames/bind';
import TokenBalance from 'components/TokenBalance';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { FC, memo, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './InputWithOptionPercent.module.scss';

const cx = classNames.bind(styles);

const InputWithOptionPercent: FC<{
  setAmountFromPercent: (value: bigint) => void;
  onValueChange?: (value: any) => void;
  onChange?: (e: any) => void;
  totalAmount: bigint;
  percentList?: number[];
  value: any;
  TokenIcon?: any;
  token?: any;
  apr?: number;
  showIcon?: boolean;
  hasPath?: boolean;
  isFocus?: boolean;
}> = ({
  setAmountFromPercent,
  onValueChange,
  onChange,
  value,
  TokenIcon,
  token,
  totalAmount,
  percentList = [25, 50, 75, 100],
  apr,
  showIcon = false,
  hasPath = false,
  isFocus = true
}) => {
  const { data: prices } = useCoinGeckoPrices();
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
              denom: token?.symbol,
              decimals: token?.decimals
            }}
            prefix="LP Token Balance: "
            decimalScale={6}
          />
        </div>
        {!!apr && <div className={cx('apr')}>Current APR: {apr}%</div>}
      </div>

      <div className={cx('input')}>
        {showIcon && (
          <div className={cx('token')}>
            {TokenIcon && <TokenIcon className={cx('logo')} />}
            <div className={cx('title', theme)}>
              <div>{token?.name}</div>
              <div className={cx('des')}>Oraichain</div>
            </div>
          </div>
        )}

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
          <div className={cx('amount-usd', theme)}>
            <TokenBalance balance={getUsd(value, token || {}, prices)} decimalScale={2} />
          </div>
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

export default memo(InputWithOptionPercent);
