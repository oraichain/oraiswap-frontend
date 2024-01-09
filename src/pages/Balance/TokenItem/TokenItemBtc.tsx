import classNames from 'classnames';
import styles from './index.module.scss';

import TokenItem, { TokenItemProps } from './index';
import { ReactComponent as DepositBtcLight } from 'assets/images/deposit_btc.svg';
import { ReactComponent as DepositBtcDark } from 'assets/images/btc-deposit-dark.svg';
import { Button } from 'components/Button';
import { useContext } from 'react';
import { ThemeContext } from 'context/theme-context';

export const TokenItemBtc: React.FC<TokenItemProps> = ({ onDepositBtc, ...props }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <TokenItem {...props} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 16,
          background: theme === 'light' ? '#F7F7F7' : '#191b21',
          borderRadius: 12,
          marginTop: -15
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div>{theme === 'light' ? <DepositBtcLight /> : <DepositBtcDark />}</div>
          <div
            style={{
              paddingLeft: 16
            }}
          >
            <p
              style={{
                fontFamily: 'IBM Plex Sans',
                fontSize: 16,
                fontWeight: 600,
                color: theme === 'light' ? '#232521' : '#F7F7F7'
              }}
            >
              Transfer BTC to Oraichain
            </p>
            <p
              style={{
                fontFamily: 'IBM Plex Sans',
                color: theme === 'light' ? '#686A66' : '#979995'
              }}
            >
              Deposit from CEX (Binance, Coinbase, KuCoin,...)
            </p>
          </div>
        </div>
        <div>
          <Button onClick={() => onDepositBtc()} type="primary">
            Deposit
          </Button>
        </div>
      </div>
    </>
  );
};
