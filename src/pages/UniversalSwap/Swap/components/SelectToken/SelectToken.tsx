import { CoinIcon, TokenItemType, CustomChainInfo, truncDecimals, toDisplay } from '@oraichain/oraidex-common';
import { TokenInfo } from 'types/token';
import styles from './SelectToken.module.scss';
import SearchInput from 'components/SearchInput';
import cn from 'classnames/bind';
import { chainIcons, flattenTokensWithIcon } from 'config/chainInfos';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as IconoirCancel } from 'assets/icons/iconoir_cancel.svg';
import { ReactComponent as NoResultLight } from 'assets/images/no-result.svg';
import { ReactComponent as NoResultDark } from 'assets/images/no-result-dark.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning_icon.svg';

import { getUsd, toSumDisplay } from 'libs/utils';
import { getSubAmountDetails } from 'rest/api';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import React, { useState, useEffect } from 'react';
import { Themes } from 'context/theme-context';
import classNames from 'classnames';

const cx = cn.bind(styles);
interface InputSwapProps {
  isSelectToken: boolean;
  setIsSelectToken?: React.Dispatch<React.SetStateAction<boolean>>;
  items?: TokenItemType[] | CustomChainInfo[] | any;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  handleChangeToken?: (token: TokenItemType) => void;
  theme: Themes;
  selectChain: string;
}

interface GetIconInterface {
  type: 'token' | 'network';
  chainId?: string;
  coinGeckoId?: string;
  isLightTheme: boolean;
  width?: number;
  height?: number;
}

const getIcon = ({ isLightTheme, type, chainId, coinGeckoId, width, height }: GetIconInterface) => {
  if (type === 'token') {
    const tokenIcon = flattenTokensWithIcon.find((tokenWithIcon) => tokenWithIcon.coinGeckoId === coinGeckoId);
    return isLightTheme ? (
      <tokenIcon.IconLight className={cx('logo')} width={width} height={height} />
    ) : (
      <tokenIcon.Icon className={cx('logo')} width={width} height={height} />
    );
  } else {
    const networkIcon = chainIcons.find((chain) => chain.chainId === chainId);
    return isLightTheme ? (
      <networkIcon.IconLight className={cx('logo')} width={width} height={height} />
    ) : (
      <networkIcon.Icon className={cx('logo')} width={width} height={height} />
    );
  }
};

export default function SelectToken({
  setIsSelectToken,
  isSelectToken,
  items,
  amounts,
  prices,
  handleChangeToken,
  theme,
  selectChain
}: InputSwapProps) {
  const [textChain, setTextChain] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const isLightTheme = theme === 'light';
  useEffect(() => {
    if (selectChain && selectChain !== textChain) setTextChain(selectChain);
  }, [selectChain]);

  const listItems = items.filter(
    (item) =>
      (textChain ? item.chainId === textChain : true) &&
      (textSearch ? item.name.toLowerCase().includes(textSearch.toLowerCase()) : true)
  );

  const unsupportedTokens = [].filter(
    (item) =>
      (textChain ? item.chainId === textChain : true) &&
      (textSearch ? item.name.toLowerCase().includes(textSearch.toLowerCase()) : true)
  );

  return (
    <>
      {/* {isSelectToken && <div className={styles.selectTokenOverlay} onClick={() => setIsSelectToken(false)}></div>} */}
      <div className={`${styles.selectToken} ${isSelectToken ? styles.active : ''}`}>
        <div className={styles.selectTokenHeader}>
          <div />
          <div className={styles.selectTokenHeaderTitle}>Select a token</div>
          <div className={styles.selectTokenHeaderClose} onClick={() => setIsSelectToken(false)}>
            <IconoirCancel />
          </div>
        </div>
        <div className={styles.selectTokenSearch}>
          <SearchInput
            placeholder="Find token by name or address"
            className={styles.selectTokenSearchInput}
            onSearch={(text) => {
              setTextSearch(text);
            }}
            theme={theme}
          />
        </div>
        <div className={styles.selectTokenAll}>
          <div className={styles.selectTokenTitle}>Select token</div>
          <div className={styles.selectTokenList}>
            {!listItems.length && (
              <div className={styles.selectTokenListNoResult}>
                {isLightTheme ? <NoResultLight /> : <NoResultDark />}
              </div>
            )}

            {listItems
              .map((token) => {
                const tokenIcon = getIcon({
                  isLightTheme,
                  type: 'token',
                  coinGeckoId: token.coinGeckoId,
                  width: 30,
                  height: 30
                });

                const networkIcon = getIcon({
                  isLightTheme,
                  type: 'network',
                  chainId: token.chainId,
                  width: 16,
                  height: 16
                });
                const key = token.denom;
                let sumAmountDetails: AmountDetails = {};
                // by default, we only display the amount that matches the token denom
                sumAmountDetails[token.denom] = amounts?.[token.denom];
                let sumAmount: number = toSumDisplay(sumAmountDetails);
                // if there are sub-denoms, we get sub amounts & calculate sum display of both sub & main amount
                if (token.evmDenoms) {
                  const subAmounts = getSubAmountDetails(amounts, token);
                  sumAmountDetails = { ...sumAmountDetails, ...subAmounts };
                  sumAmount = toSumDisplay(sumAmountDetails);
                }
                // const usd = getUsd(BigInt(sumAmount), token, prices);
                const balance = sumAmount > 0 ? sumAmount.toFixed(truncDecimals) : '0';
                const usd =
                  sumAmount > 0 && token && prices[token.coinGeckoId] ? sumAmount * prices[token.coinGeckoId] : '0';

                return {
                  ...token,
                  tokenIcon,
                  networkIcon,
                  key,
                  balance,
                  usd
                };
              })
              .sort((a, b) => {
                return Number(b.usd) - Number(a.usd);
              })
              .map(({ key, tokenIcon, networkIcon, balance, usd, ...token }) => {
                return (
                  <div
                    key={key}
                    className={styles.selectTokenItem}
                    onClick={() => handleChangeToken(token as TokenItemType)}
                  >
                    <div className={styles.selectTokenItemLeft}>
                      <div>
                        <div className={styles.selectTokenItemLeftImg}>
                          {tokenIcon}
                          <div className={styles.selectTokenItemLeftImgChain}>{networkIcon}</div>
                        </div>
                      </div>
                      <div>
                        <div className={styles.selectTokenItemTokenName}>{token.name}</div>
                        <div className={styles.selectTokenItemTokenOrg}>{token.org}</div>
                      </div>
                    </div>
                    <div className={styles.selectTokenItemRight}>
                      <div className={styles.selectTokenItemTokenBalance}>{balance} </div>
                      <div className={styles.selectTokenItemTokenUsd}>{formatDisplayUsdt(usd)}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
