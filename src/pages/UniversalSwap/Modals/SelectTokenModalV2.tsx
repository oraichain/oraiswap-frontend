import cn from 'classnames/bind';
import SearchInput from 'components/SearchInput';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import { CustomChainInfo } from 'config/chainInfos';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { getTotalUsd, toSumDisplay } from 'libs/utils';
import { FC, useRef } from 'react';
import styles from './SelectTokenModalV2.module.scss';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useConfigReducer from 'hooks/useConfigReducer';
import { getSubAmountDetails, truncDecimals } from '@oraichain/oraidex-common';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  close: () => void;
  isCloseBtn?: boolean;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  items?: TokenItemType[] | CustomChainInfo[];
  setToken: (denom: string) => void;
  type?: 'token' | 'network';
  setSearchTokenName: (tokenName: string) => void;
}

export const SelectTokenModalV2: FC<ModalProps> = ({
  type = 'token',
  close,
  items,
  setToken,
  prices,
  amounts,
  setSearchTokenName
}) => {
  const ref = useRef(null);
  const [theme] = useConfigReducer('theme');

  useOnClickOutside(ref, () => {
    setSearchTokenName('');
    close();
  });

  return (
    <div ref={ref} className={cx('select')}>
      <div className={cx('title')}>
        <SearchInput
          isBorder
          placeholder="Search Token"
          onSearch={(tokenName) => setSearchTokenName(tokenName.toUpperCase())}
        />
      </div>
      <div className={cx('options')}>
        {items?.map((item: TokenItemType | CustomChainInfo) => {
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
              Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId === network.chainId)
            );
            const totalUsd = getTotalUsd(subAmounts, prices);
            balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
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
