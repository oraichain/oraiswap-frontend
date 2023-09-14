import { useState } from 'react';
import styles from './TabsTxs.module.scss';
import ArrowImg from 'assets/icons/arrow_new.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import NetworkImg from 'assets/icons/network.svg';
import cn from 'classnames/bind';
import { TYPE } from '../helpers';
import { networks } from 'helper';
import CheckImg from 'assets/icons/check.svg';

const cx = cn.bind(styles);

export const TabsTxs: React.FC<{ type: string; setType: (type: string) => void }> = ({ type, setType }) => {
  const [isNetwork, setIsNetwork] = useState<boolean>(false);
  const [theme] = useConfigReducer('theme');
  const [networkFilter, setNetworkFilter] = useState<string>('');
  return (
    <div className={cx('tabsTxs')}>
      <div className={cx('left')}>
        <div className={cx('label', `${type === TYPE.ASSETS ? 'active' : ''}`)} onClick={() => setType(TYPE.ASSETS)}>
          Assets
        </div>
        <div className={cx('label', `${type === TYPE.HISTORY ? 'active' : ''}`)} onClick={() => setType(TYPE.HISTORY)}>
          History
        </div>
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
            <span className={cx(`detail`)}>All Networks</span>
          </div>
          <img src={theme === 'light' ? ArrowImg : ArrowImg} alt="arrow" />
        </div>
        <div>
          {isNetwork && (
            <div
              className={cx('details')}
              style={{
                position: 'absolute'
              }}
            >
              <div>
                <div className={cx('network')}>Select network</div>
              </div>
              <div>
                <div className={cx('options')}>
                  {networks?.map((item: any, i) => {
                    return (
                      <div
                        className={cx('item')}
                        key={i}
                        onClick={() => {
                          setNetworkFilter(item.chainName);
                          setIsNetwork(false);
                        }}
                      >
                        {theme === 'light' ? (
                          item.IconLight ? (
                            <item.IconLight className={cx('logo')} />
                          ) : (
                            <item.Icon className={cx('logo')} />
                          )
                        ) : (
                          <item.Icon className={cx('logo')} />
                        )}
                        <div className={cx('grow')}>
                          <div>{item.chainName}</div>
                        </div>
                        <div>{networkFilter === item.chainName && <img src={CheckImg} alt="check" />}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
