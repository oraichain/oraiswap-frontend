import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { toDisplay } from 'libs/utils';

type BalanceProp = {
  amount: string | bigint;
  sourceDecimals?: number;
  decimals?: number;
  denom?: string;
};

type Props = {
  balance: BalanceProp | number;
  className?: string;
} & NumberFormatProps;

const parseBalance = (balance: BalanceProp): number => {
  if (!balance.decimals) return Number(balance.amount);
  if (balance.sourceDecimals) return toDisplay(balance.amount, balance.sourceDecimals, balance.decimals);
  return toDisplay(balance.amount, balance.decimals);
};

const TokenBalance: React.FC<Props> = ({ balance, className, ...props }) => {
  const amount = typeof balance === 'number' ? balance : parseBalance(balance ?? { amount: '0' });

  return (
    <NumberFormat
      className={className}
      value={amount}
      displayType={'text'}
      thousandSeparator={true}
      decimalScale={0}
      {...(typeof balance === 'number'
        ? { prefix: '$' }
        : {
            // fix display denom
            suffix: balance?.denom ? ` ${balance.denom.replace(/^u/, '').toUpperCase()}` : ''
          })}
      {...props}
    />
  );
};

export default TokenBalance;
