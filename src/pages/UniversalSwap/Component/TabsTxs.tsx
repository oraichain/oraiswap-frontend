import { useRef, useState } from 'react';
import styles from './TabsTxs.module.scss';
import ArrowImg from 'assets/icons/arrow_new.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import NetworkImg from 'assets/icons/network.svg';
import cn from 'classnames/bind';
import { TYPE } from '../helpers';
import { networks } from 'helper';
import CheckImg from 'assets/icons/check.svg';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { CoinIcon } from 'config/chainInfos';

const cx = cn.bind(styles);
const Item: React.FC<{
  theme: string;
  item: {
    IconLight?: CoinIcon;
    Icon?: CoinIcon;
    chainName: string;
  };
  icons?: React.ReactElement;
  isCheck: boolean;
  onClick: () => void;
  isAllNetwork?: string;
}> = ({ onClick, item, theme, isCheck, icons, isAllNetwork }) => {
  return (
    <div className={cx('item', `${isAllNetwork}`)} onClick={onClick}>
      {icons ? (
        icons
      ) : theme === 'light' ? (
        item.IconLight ? (
          <item.IconLight className={cx('logo')} />
        ) : (
          <item.Icon className={cx('logo')} />
        )
      ) : (
        <item.Icon className={cx('logo')} />
      )}

      <div className={cx('grow')}>
        <div>{item?.chainName}</div>
      </div>
      <div className={cx('check-icon')}>{isCheck && <img src={CheckImg} alt="check" />}</div>
    </div>
  );
};

const TabsNetwork: React.FC<{
  theme: string;
  setIsNetwork: (isNetwork: boolean) => void;
  networkFilter: string;
  setNetworkFilter: (networkFilter: string) => void;
}> = ({ networkFilter, setIsNetwork, setNetworkFilter, theme }) => {
  return (
    <div className={cx('network')}>
      <div>
        <div className={cx('title')}>Select network</div>
      </div>
      <div className={cx('options', 'border')}>
        <Item
          onClick={() => {
            setNetworkFilter('All networks');
            setIsNetwork(false);
          }}
          icons={<img className={cx('logo')} src={theme === 'light' ? NetworkImg : NetworkImg} alt="network" />}
          item={{ chainName: 'All networks' }}
          theme={theme}
          isCheck={networkFilter === 'All networks'}
          isAllNetwork={'all'}
        />
      </div>
      <div className={cx('options')}>
        {networks?.map((item) => {
          return (
            <div key={item.chainName}>
              <Item
                onClick={() => {
                  setNetworkFilter(item.chainName);
                  setIsNetwork(false);
                }}
                item={item}
                theme={theme}
                isCheck={networkFilter === item.chainName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TabsTxs: React.FC<{ type: string; setType: (type: string) => void }> = ({ type, setType }) => {
  const [isNetwork, setIsNetwork] = useState<boolean>(false);
  const [theme] = useConfigReducer('theme');
  const [networkFilter, setNetworkFilter] = useState<string>('All networks');
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setIsNetwork(false);
  });
  return (
    <div className={cx('tabsTxs')} ref={ref}>
      <div className={cx('left')}>
        {Object.values(TYPE).map((types) => {
          return (
            <div
              key={types}
              className={cx('label', `${type === types ? 'active' : ''}`)}
              onClick={() => setType(types)}
            >
              {types}
            </div>
          );
        })}
      </div>
      <div>
        <div
          className={cx('right')}
          onClick={() => {
            setIsNetwork(!isNetwork);
          }}
        >
          <img src={theme === 'light' ? NetworkImg : NetworkImg} alt="network" />
          <div className={cx('all-network')}>
            <span className={cx(`detail`)}>{networkFilter ? networkFilter : 'All Networks'}</span>
          </div>
          <img src={theme === 'light' ? ArrowImg : ArrowImg} alt="arrow" />
        </div>
        {isNetwork && (
          <TabsNetwork
            networkFilter={networkFilter}
            theme={theme}
            setIsNetwork={setIsNetwork}
            setNetworkFilter={setNetworkFilter}
          />
        )}
      </div>
    </div>
  );
};
