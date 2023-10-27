import { CoinIcon, CustomChainInfo } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_new.svg';
import CheckImg from 'assets/icons/check.svg';
import NetworkImg from 'assets/icons/network.svg';
import cn from 'classnames/bind';
import { networks } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NetworkFilter, TYPE_TAB_HISTORY, initNetworkFilter } from '../helpers';
import styles from './TabsTxs.module.scss';

const cx = cn.bind(styles);
const ItemNetwork: React.FC<{
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
  setNetworkFilter: (networkFilter: NetworkFilter) => void;
}> = ({ networkFilter, setIsNetwork, setNetworkFilter, theme }) => {
  return (
    <div className={cx('network')}>
      <div>
        <div className={cx('title')}>Select network</div>
      </div>
      <div className={cx('options', 'border')}>
        <ItemNetwork
          onClick={() => {
            setNetworkFilter(initNetworkFilter);
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
        {networks?.map((item: CustomChainInfo) => {
          return (
            <div key={item.chainName}>
              <ItemNetwork
                onClick={() => {
                  setNetworkFilter({
                    label: item.chainName,
                    value: item.chainId,
                    Icon: item.Icon,
                    IconLight: item.IconLight || item.Icon
                  });
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

export const TabsTxs: React.FC<{
  networkFilter: NetworkFilter;
  setNetworkFilter: (networkFilter: NetworkFilter) => void;
}> = ({ setNetworkFilter, networkFilter }) => {
  const [isNetwork, setIsNetwork] = useState<boolean>(false);
  const [theme] = useConfigReducer('theme');
  const ref = useRef(null);
  const navigate = useNavigate();

  useOnClickOutside(ref, () => {
    setIsNetwork(false);
  });

  const [searchParams] = useSearchParams();
  let tab = searchParams.get('type');

  return (
    <div className={cx('tabsTxs')} ref={ref}>
      <div className={cx('left')}>
        {Object.values(TYPE_TAB_HISTORY).map((type) => {
          return (
            <div
              key={type}
              className={cx(
                'label',
                `${tab === type ? 'active' : ''}`,
                `${!tab && type === TYPE_TAB_HISTORY.ASSETS ? 'active' : ''}`
              )}
              onClick={() => {
                navigate(`/universalswap?type=${type}`);
              }}
            >
              {type}
            </div>
          );
        })}
      </div>
      {tab !== TYPE_TAB_HISTORY.HISTORY && (
        <div>
          <div
            className={cx('right')}
            onClick={() => {
              setIsNetwork(!isNetwork);
            }}
          >
            {networkFilter.value ? (
              theme === 'light' ? (
                (networkFilter.IconLight && <networkFilter.IconLight className={cx('logo')} />) || (
                  <networkFilter.IconLight className={cx('logo')} />
                )
              ) : (
                networkFilter.Icon && <networkFilter.Icon className={cx('logo')} />
              )
            ) : (
              <img src={theme === 'light' ? NetworkImg : NetworkImg} alt="network" />
            )}
            <div className={cx('all-network')}>
              <span className={cx(`detail`)}>{networkFilter.label ? networkFilter.label : 'All Networks'}</span>
            </div>
            <img src={theme === 'light' ? ArrowImg : ArrowImg} alt="arrow" />
          </div>
          {isNetwork && (
            <TabsNetwork
              networkFilter={networkFilter.label}
              theme={theme}
              setIsNetwork={setIsNetwork}
              setNetworkFilter={setNetworkFilter}
            />
          )}
        </div>
      )}
    </div>
  );
};
