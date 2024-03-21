import classNames from 'classnames';

import TokenItem, { TokenItemProps } from './index';
import { ReactComponent as DepositBtcLight } from 'assets/images/deposit_btc.svg';
import { ReactComponent as DepositBtcDark } from 'assets/images/btc-deposit-dark.svg';
import { Button } from 'components/Button';
import { useContext } from 'react';
import { ThemeContext } from 'context/theme-context';

import styles from './tokenItem.module.scss';
import { NomicContext } from 'context/nomic-context';

export const TokenItemBtc: React.FC<TokenItemProps> = ({ onDepositBtc, ...props }) => {
  const { theme } = useContext(ThemeContext);
  const isLightTheme = theme == 'light';
  const nomic = useContext(NomicContext);
  return (
    <>
      <TokenItem {...props} />
      <div className={styles.tokenItemsBtc}>
        <div className={styles.tokenItems}>
          <div>{isLightTheme ? <DepositBtcLight /> : <DepositBtcDark />}</div>
          <div className={styles.context}>
            <p className={styles.transferBTC}>Transfer BTC to Oraichain</p>
            <p className={styles.depositFromCex}>Deposit from CEX (Binance, Coinbase, KuCoin,...)</p>
          </div>
        </div>
        <div>
          <Button disabled={!nomic.depositAddress?.bitcoinAddress} onClick={() => onDepositBtc()} type="primary">
            Deposit
          </Button>
        </div>
      </div>
    </>
  );
};
