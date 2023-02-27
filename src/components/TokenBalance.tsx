import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { toDisplay } from 'libs/utils';

type BalanceProp = {
  amount: string | number;
  decimals?: number;
  denom?: string;
};

type Props = {
  balance: BalanceProp | number;
  className?: string;
} & NumberFormatProps;

const parseBalance = (balance: BalanceProp): number => {
  if (!balance.decimals) return Number(balance.amount);
  return toDisplay(balance.amount, balance.decimals);
};

const TokenBalance: React.FC<Props> = ({ balance, className, ...props }) => {
  const balanceProp: BalanceProp =
    typeof balance === 'number'
      ? { amount: balance }
      : balance ?? { amount: 0 };
  const amount = parseBalance(balanceProp);

  return (
    <NumberFormat
      className={className}
      value={amount}
      displayType={'text'}
      thousandSeparator={true}
      decimalScale={0}
      {...(!balanceProp.denom
        ? { prefix: '$' }
        : { suffix: ` ${balanceProp.denom.toUpperCase()}` })}
      {...props}
    />
  );
};

export default TokenBalance;
