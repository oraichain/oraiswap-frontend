import classNames from 'classnames';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import { TokenItemType, truncDecimals } from '@oraichain/oraidex-common';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import useTheme from 'hooks/useTheme';
import TokenForm from '../TokenForm';
import { useState } from 'react';

const CreatePosition = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tokenFrom, setTokenFrom] = useState<TokenItemType>();
  const [tokenTo, setTokenTo] = useState<TokenItemType>();
  const [fee, setFee] = useState<number>(0.01);
  const [toAmount, setToAmount] = useState();
  const [fromAmount, setFromAmount] = useState();

  return (
    <div className={classNames('small_container', styles.createPosition)}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <h1>Add new liquidity position</h1>
          <div className={styles.setting}>
            <SettingIcon />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <TokenForm
              tokenFrom={tokenFrom}
              handleChangeTokenFrom={(tk) => setTokenFrom(tk)}
              tokenTo={tokenTo}
              handleChangeTokenTo={(tk) => setTokenTo(tk)}
              setFee={setFee}
              setToAmount={setToAmount}
              setFromAmount={setFromAmount}
              fromAmount={fromAmount}
              toAmount={toAmount}
              fee={fee}
            />
          </div>
          <div className={styles.item}>PRICE section</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosition;
