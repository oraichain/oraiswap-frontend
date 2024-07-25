import styles from './index.module.scss';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as AddIcon } from 'assets/icons/Add.svg';
import OraixIcon from 'assets/icons/oraix.svg';
import UsdtIcon from 'assets/icons/tether.svg';
import { ReactComponent as BootsIconDark } from 'assets/icons/boost-icon-dark.svg';
import { ReactComponent as BootsIcon } from 'assets/icons/boost-icon.svg';
import { Button } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import useTheme from 'hooks/useTheme';
import { useState } from 'react';
import { formatNumberKMB } from 'helper/format';
import PositionItem from '../PositionItem';

const PoolV3Detail = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [list, setList] = useState<any[]>([...Array(2)]);
  const IconBoots = theme === 'light' ? BootsIcon : BootsIconDark;

  return (
    <div className={classNames(styles.poolDetail, 'small_container')}>
      <div className={styles.header}>
        <div className={styles.name}>
          <div className={styles.back} onClick={() => navigate('/pools-v3')}>
            <BackIcon />
          </div>
          <div className={styles.info}>
            <div className={classNames(styles.icons, styles[theme])}>
              <img src={OraixIcon} alt="base-tk" />
              <img src={UsdtIcon} alt="quote-tk" />
            </div>
            <span>ORAIX / USDT</span>
          </div>
          <div className={styles.fee}>
            <span className={styles.item}>Fee: 0.003%</span>
            <span className={styles.item}>0.03% Spread</span>
          </div>
        </div>

        <div className={styles.addPosition}>
          <Button
            onClick={() => {
              navigate('/new-position/ORAIX/USDT/0.01');
            }}
            type="primary-sm"
          >
            <div>
              <AddIcon />
              &nbsp;
            </div>
            Add Position
          </Button>
        </div>
      </div>
      <div className={styles.detail}>
        <div className={styles.infos}>
          <div className={styles.tvl}>
            <div className={styles.box}>
              <p>Liquidity</p>
              <h1>{formatDisplayUsdt(223343908)}</h1>
              <span className={classNames(styles.percent, { [styles.positive]: true })}>
                {true ? '+' : '-'}
                {numberWithCommas(2.07767, undefined, { maximumFractionDigits: 2 })}%
              </span>
            </div>
            <div className={styles.box}>
              <p>Volume (24H)</p>
              <h1>{formatDisplayUsdt(14334398)}</h1>
              <span className={classNames(styles.percent, { [styles.positive]: false })}>
                {false ? '+' : '-'}
                {numberWithCommas(2.07767, undefined, { maximumFractionDigits: 2 })}%
              </span>
            </div>
          </div>

          <div className={classNames(styles.box, styles.alloc)}>
            <p>Liquidity Allocation</p>
            <div className={styles.tokensAlloc}>
              <div className={styles.base} style={{ width: '60%' }}></div>
              <div className={styles.quote} style={{ width: '40%' }}></div>
            </div>
            <div className={styles.tokens}>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                <img src={OraixIcon} alt="base-tk" />
                <span>{'ORAIX'}</span>
                <span className={styles.value}>{formatNumberKMB(1223242342, false)}</span>
              </div>
              <div className={classNames(styles.tokenItem, styles[theme])}>
                <img src={UsdtIcon} alt="quote-tk" />
                <span>{'USDT'}</span>
                <span className={styles.value}>{formatNumberKMB(89034232324, false)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.reward}>
          <div className={styles.title}>Reward</div>
          <div className={styles.desc}>
            <div className={styles.item}>
              <span>Incentive</span>
              <p>ORAI</p>
            </div>
            <div className={styles.item}>
              <span>Swap Fee</span>
              <p>11.91%</p>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>
                ORAI Boost&nbsp;
                <IconBoots />
              </span>
              <p>22.91%</p>
            </div>
            <div className={styles.item}>
              <span>Total APR</span>
              <p className={styles.total}>34.82%</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.positions}>
        <h1>Your Liquidity Positions</h1>
        <div className={styles.list}>
          {list.map((item, index) => {
            return (
              <div className={styles.positionWrapper} key={`pos-${index}`}>
                <PositionItem item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PoolV3Detail;
