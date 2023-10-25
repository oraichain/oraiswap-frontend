import cn from 'classnames/bind';
import SearchInput from 'components/SearchInput';
import { tokenMap } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { getTotalUsd, toSumDisplay } from 'libs/utils';
import { FC, useRef, useState } from 'react';
import styles from './SelectTokenModalV2.module.scss';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useConfigReducer from 'hooks/useConfigReducer';
import NetworkImg from 'assets/icons/network.svg';
import ArrowImg from 'assets/icons/arrow_new.svg';
import CheckImg from 'assets/icons/check.svg';
import BackImg from 'assets/icons/back.svg';
import { networks } from 'helper';
import { TokenItemType, CustomChainInfo, getSubAmountDetails, truncDecimals } from '@oraichain/oraidex-common';
import { oraichainTokenIcons } from 'config/chainInfos';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  close: () => void;
  isCloseBtn?: boolean;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  items?: TokenItemType[] | CustomChainInfo[] | any;
  setToken: (denom: string) => void;
  type?: 'token' | 'network';
  setSearchTokenName: (tokenName: string) => void;
  searchTokenName?: string
}

export const SelectTokenModalV2: FC<ModalProps> = ({
  type = 'token',
  close,
  items,
  setToken,
  prices,
  amounts,
  setSearchTokenName,
  searchTokenName
}) => {
  const ref = useRef(null);
  const [theme] = useConfigReducer('theme');
  const [isNetwork, setIsNetwork] = useState(false);
  const [networkFilter, setNetworkFilter] = useState('');
  let totalBalance = 0;

  const networkBalance = networks.map((item) => {
    const network = item as CustomChainInfo;
    const key = network.chainId.toString();
    const title = network.chainName;
    const subAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId === network.chainId)
    );
    const totalUsd = getTotalUsd(subAmounts, prices);
    const balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
    totalBalance += +totalUsd;
    return {
      ...item,
      balance,
      title,
      key
    };
  });

  const itemsFilter = searchTokenName || networkFilter ? items.filter((item) => {
    if (searchTokenName && networkFilter) return item.name.includes(searchTokenName) && item.org === networkFilter
    if (searchTokenName) return item.name.includes(searchTokenName)
    return item.org === networkFilter
  }) : items;

  useOnClickOutside(ref, () => {
    setSearchTokenName('');
    close();
  });

  return (
    <div ref={ref} className={cx('select')}>
      {!isNetwork ? (
        <div className={cx('title')}>
          <SearchInput
            isBorder
            placeholder="Search Token"
            defaultValue={searchTokenName}
            onSearch={(tokenName) => setSearchTokenName(tokenName.toUpperCase())}
          />
        </div>
      ) : (
        <div className={cx('details')}>
          <img
            src={theme === 'light' ? BackImg : BackImg}
            onClick={() => {
              isNetwork && setIsNetwork(false);
            }}
          />
          <div className={cx('network')}>Select network</div>
          <div />
        </div>
      )}
      <div className={cx('label')}>
        {!isNetwork && <div className={cx('left')}>Token List</div>}
        <div
          className={cx('right')}
          onClick={() => {
            if (isNetwork) {
              setNetworkFilter('');
            }
            setIsNetwork(!isNetwork);
          }}
        >
          <img src={theme === 'light' ? NetworkImg : NetworkImg} alt="network" />
          <div className={cx('all-network')}>
            <span className={cx(`${isNetwork ? 'detail' : ''}`)}>
              {networkFilter && !isNetwork ? networkFilter : 'All Networks'}
            </span>
            {isNetwork && <span className={cx('balance')}>${totalBalance?.toFixed(2)}</span>}
          </div>
          {!isNetwork && <img src={theme === 'light' ? ArrowImg : ArrowImg} alt="arrow" />}
        </div>
        {isNetwork && !networkFilter && <img src={CheckImg} alt="check" />}
      </div>
      <div className={cx('options')}>
        {isNetwork &&
          networkBalance?.map((item) => {
            return (
              <div
                className={cx('item')}
                key={item.key}
                onClick={() => {
                  setNetworkFilter(item.title);
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
                  <div>{item.title}</div>
                  <div className={cx('org')}>{item.balance}</div>
                </div>
                <div>{networkFilter === item.chainName && <img src={CheckImg} alt="check" />}</div>
              </div>
            );
          })}
        {!isNetwork &&
          itemsFilter.map((item: TokenItemType | CustomChainInfo) => {
            let key: string, title: string, balance: string, org: string;

            if (type === 'token') {
              const token = item as TokenItemType;
              key = token.denom;
              title = token.name;
              org = token.org;
              let sumAmountDetails: AmountDetails = {};
              // by default, we only display the amount that matches the token denom
              sumAmountDetails[token.denom] = amounts[token.denom];
              let sumAmount: number = toSumDisplay(sumAmountDetails);
              // if there are sub-denoms, we get sub amounts & calculate sum display of both sub & main amount
              if (token.evmDenoms) {
                const subAmounts = getSubAmountDetails(amounts, token);
                sumAmountDetails = { ...sumAmountDetails, ...subAmounts };
                sumAmount = toSumDisplay(sumAmountDetails);
              }
              balance = sumAmount > 0 ? sumAmount.toFixed(truncDecimals) : '0';
            } else {
              const network = item as CustomChainInfo;
              key = network.chainId.toString();
              title = network.chainName;
              org = network.chainName;
              const subAmounts = Object.fromEntries(
                Object.entries(amounts).filter(([denom]) => tokenMap[denom] && tokenMap[denom].chainId === network.chainId)
              );
              const totalUsd = getTotalUsd(subAmounts, prices);
              balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
            }

            // TODO: need handle list icon 
            const isLightTheme = theme === 'light';
            let itemIcon = isLightTheme ? (
              item.IconLight ? (
                <item.IconLight className={cx('logo')} />
              ) : (
                item.Icon && <item.Icon className={cx('logo')} />
              )
            ) : <item.Icon className={cx('logo')} />

            // TODO: hardcode list icon oraichain need fix after listing v3
            if (!item.Icon && item.chainId === 'Oraichain') {
              const tokenItem = item as TokenItemType;
              const itemTokenIcon = oraichainTokenIcons.find(oraichainToken => oraichainToken.denom === tokenItem.denom)
              itemIcon = isLightTheme ? <itemTokenIcon.IconLight className={cx('logo')} /> : <itemTokenIcon.Icon className={cx('logo')} />
            }
            return (
              <div
                className={cx('item')}
                key={key}
                onClick={() => {
                  setToken(key);
                  setSearchTokenName('');
                  close();
                }}
              >
                {itemIcon}
                <div className={cx('grow')}>
                  <div>{title}</div>
                  <div className={cx('org')}>{org}</div>
                </div>
                <div>{balance}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
