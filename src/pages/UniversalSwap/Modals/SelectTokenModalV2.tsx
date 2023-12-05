import cn from 'classnames/bind';
import SearchInput from 'components/SearchInput';
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
import {
  TokenItemType,
  CustomChainInfo,
  getSubAmountDetails,
  truncDecimals,
  tokenMap
} from '@oraichain/oraidex-common';
import { chainIcons, flattenTokensWithIcon } from 'config/chainInfos';

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
  searchTokenName?: string;
}

interface GetIconInterface {
  type: string;
  chainId?: string;
  coinGeckoId?: string;
  isLightTheme: boolean;
}

const getIcon = ({ isLightTheme, type, chainId, coinGeckoId }: GetIconInterface) => {
  let tokenOrNetworkIcon;
  if (type === 'token') {
    tokenOrNetworkIcon = flattenTokensWithIcon.find((tokenWithIcon) => tokenWithIcon.coinGeckoId === coinGeckoId);
  } else {
    tokenOrNetworkIcon = chainIcons.find((chain) => chain.chainId === chainId);
  }
  return isLightTheme ? (
    <tokenOrNetworkIcon.IconLight className={cx('logo')} />
  ) : (
    <tokenOrNetworkIcon.Icon className={cx('logo')} />
  );
};

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
  const isLightTheme = theme === 'light';
  let itemIcon;

  const networkBalance = networks.map((item) => {
    const network = item as CustomChainInfo;
    itemIcon = getIcon({ isLightTheme, type: 'network', chainId: item.chainId, coinGeckoId: '' });
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
      ItemIcon: itemIcon,
      balance,
      title,
      key
    };
  });

  const networksMap = {};
  let itemsFilter = (
    searchTokenName || networkFilter
      ? items.filter((item: TokenItemType) => {
        if (searchTokenName && networkFilter)
          return item.name.toLowerCase().includes(searchTokenName.toLowerCase()) && item.org === networkFilter;
        if (searchTokenName) return item.name.toLowerCase().includes(searchTokenName.toLowerCase());
        return item.org === networkFilter;
      })
      : items
  ).map((item: TokenItemType | CustomChainInfo) => {
    let key: string, title: string, balance: string, org: string;
    let itemIcon;
    if (type === 'token') {
      const token = item as TokenItemType;
      itemIcon = getIcon({ isLightTheme, type: 'token', coinGeckoId: token.coinGeckoId });
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
      itemIcon = getIcon({ isLightTheme, type: 'network', chainId: item.chainId });
      title = network.chainName;
      org = network.chainName;
      const subAmounts = Object.fromEntries(
        Object.entries(amounts).filter(([denom]) => tokenMap[denom] && tokenMap[denom].chainId === network.chainId)
      );
      const totalUsd = getTotalUsd(subAmounts, prices);
      balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
    }
    if (networksMap[item.chainId] === undefined) networksMap[item.chainId] = [];
    networksMap[item.chainId].push({ balance, key, title, chainId: item.chainId, org, itemIcon });

    return null;
  });

  itemsFilter = [];

  for (const key in networksMap) {
    if (Object.prototype.hasOwnProperty.call(networksMap, key)) {
      const prices = networksMap[key].sort((a, b) => b.balance - a.balance);
      itemsFilter.push(prices);
    }
  }

  itemsFilter = itemsFilter.reverse().flat();

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
            src={BackImg}
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
          <img src={NetworkImg} alt="network" />
          <div className={cx('all-network')}>
            <span className={cx(`${isNetwork ? 'detail' : ''}`)}>
              {networkFilter && !isNetwork ? networkFilter : 'All Networks'}
            </span>
            {isNetwork && <span className={cx('balance')}>${totalBalance?.toFixed(2)}</span>}
          </div>
          {!isNetwork && <img src={ArrowImg} alt="arrow" />}
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
                {item.ItemIcon}
                <div className={cx('grow')}>
                  <div>{item.title}</div>
                  <div className={cx('org')}>{item.balance}</div>
                </div>
                <div>{networkFilter === item.chainName && <img src={CheckImg} alt="check" />}</div>
              </div>
            );
          })}
        {!isNetwork &&
          itemsFilter.map((item) => (
            <div
              className={cx('item')}
              key={item.key}
              onClick={() => {
                setToken(item.key);
                setSearchTokenName('');
                close();
              }}
            >
              {item.itemIcon}
              <div className={cx('grow')}>
                <div>{item.title}</div>
                <div className={cx('org')}>{item.org}</div>
              </div>
              <div>{item.balance}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
