import ShowImg from 'assets/icons/show.svg';
import HideImg from 'assets/icons/hidden.svg';
import CheckImg from 'assets/icons/check.svg';
import ArrowImg from 'assets/icons/arrow_new.svg';
import styles from './HeaderTab.module.scss';
import cn from 'classnames/bind';
import { useState } from 'react';

const cx = cn.bind(styles);

const arr = ['ORAI/USDT', 'USDT/ORAI', 'ORAI/USD', 'USD/ORAI'];

export const PoolSelect = ({ setIsOpen, setPool, pool }) => {
  return (
    <div className={cx('items')}>
      <ul>
        {arr.map((item) => {
          return (
            <li
              key={item}
              onClick={async (e) => {
                e.stopPropagation();
                setPool(item);
                setIsOpen(false);
              }}
            >
              <span>{item}</span>
              {pool === item && <img src={CheckImg} alt="check" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const HeaderTab = ({ setHideChart, hideChart, balance = 0.0001, percent = '+5.55' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pool, setPool] = useState('ORAI/USDT');
  return (
    <div className={cx('headerTabs')}>
      <div>
        <div className={cx('top')} onClick={() => setIsOpen(!isOpen)}>
          <span>{pool}</span>
          <img src={ArrowImg} alt="arrow" />
        </div>
        {isOpen && <PoolSelect setIsOpen={setIsOpen} pool={pool} setPool={setPool} />}
        <div className={cx('bottom')}>
          <span className={cx('balance')}>{balance}</span>
          <span className={cx('percent')}>{percent}</span>
        </div>
      </div>
      <div>
        <div>
          <img
            className={cx('eyes')}
            src={hideChart ? ShowImg : HideImg}
            alt="eyes"
            onClick={() => setHideChart(!hideChart)}
          />
        </div>
      </div>
    </div>
  );
};
