import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { Button } from 'components/Button';
import TokenBalance from 'components/TokenBalance';
import { useState } from 'react';
import InputBalance from '../InputBalance';
import InputRange from '../InputRange';
import styles from './index.module.scss';

const Bidding = ({ isEnd }: { isEnd: boolean }) => {
  const [range, setRange] = useState(1);
  const [amount, setAmount] = useState(0);

  return (
    <div className={styles.bidding}>
      <div className={styles.title}>Co-Harvest #{1}</div>
      <div className={styles.content}>
        <InputBalance amount={amount} onChangeAmount={setAmount} />
        <div className={styles.interest}>
          <div className={styles.interestTitle}>Interest</div>
          <InputRange className={styles.range} value={range} onChange={(value) => setRange(value)} />
          <div className={styles.explain}>Get {range}% interest on your bid</div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.bidValue}>
          <span>Bid value</span>
          <TokenBalance balance={25495.32} className={styles.usd} />
        </div>

        <div className={styles.return}>
          <span>Potential return</span>
          <div className={styles.value}>
            <TokenBalance balance={25495.32} className={styles.usdReturn} />
            <div className={styles.balance}>
              <UsdcIcon />
              <TokenBalance
                balance={{
                  amount: '25495320000',
                  denom: 'USDC',
                  decimals: 6
                }}
                className={styles.token}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <Button type="primary" onClick={() => {}} icon={null} disabled={isEnd}>
          Place a bid
        </Button>
      </div>
    </div>
  );
};

export default Bidding;
