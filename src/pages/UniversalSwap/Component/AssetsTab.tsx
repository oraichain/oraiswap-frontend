import WalletIcon from 'assets/icons/wallet-v3.svg';
import StakeIcon from 'assets/icons/stake.svg';
import styles from './AssetsTab.module.scss';
import cn from 'classnames/bind';
import { TableHeaderProps, Table } from 'components/Table';
import { AssetInfoResponse } from 'types/swap';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getTotalUsd, getUsd, toSumDisplay, toTotalDisplay } from 'libs/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { isMobile } from '@walletconnect/browser-utils';
import {
  CW20_DECIMALS,
  CoinIcon,
  TokenItemType,
  getSubAmountDetails,
  toAmount,
  toDisplay,
  tokenMap
} from '@oraichain/oraidex-common';
import { FC, useState } from 'react';
import { isSupportedNoPoolSwapEvm } from '@oraichain/oraidex-universal-swap';
import { useGetMyStake } from 'pages/Pools/hookV3';
import useConfigReducer from 'hooks/useConfigReducer';
import ToggleSwitch from 'components/ToggleSwitch';
import { tokensIcon } from 'config/chainInfos';
import { flattenTokens } from 'config/bridgeTokens';
import { formatDisplayUsdt, numberWithCommas, toFixedIfNecessary } from 'pages/Pools/helpers';

const cx = cn.bind(styles);

export const AssetsTab: FC<{ networkFilter: string }> = ({ networkFilter }) => {
  const { data: prices } = useCoinGeckoPrices();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [address] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useState(true);
  const sizePadding = isMobile() ? '12px' : '24px';
  const { totalStaked } = useGetMyStake({
    stakerAddress: address
  });
  let totalUsd: number = getTotalUsd(amounts, prices);
  if (networkFilter) {
    const subAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId === networkFilter)
    );
    totalUsd = getTotalUsd(subAmounts, prices);
  }

  let listAsset: {
    src?: CoinIcon;
    label?: string;
    balance?: number | string;
  }[] = [
      {
        src: WalletIcon,
        label: 'Total balance',
        balance: formatDisplayUsdt(totalUsd)
      }
    ];

  if (!networkFilter || networkFilter === 'Oraichain') {
    listAsset = [
      ...listAsset,
      {
        src: StakeIcon,
        label: 'Total staked',
        balance: formatDisplayUsdt(toDisplay(BigInt(Math.trunc(totalStaked)), CW20_DECIMALS))
      }
    ];
  }

  const data = flattenTokens
    .filter((token: TokenItemType) => {
      // not display because it is evm map and no bridge to option, also no smart contract and is ibc native
      if (!token.bridgeTo && !token.contractAddress) return false;
      if (hideOtherSmallAmount && !toTotalDisplay(amounts, token)) {
        return false;
      }
      if (isSupportedNoPoolSwapEvm(token.coinGeckoId)) return false;
      if (!networkFilter) return true;
      return token.chainId === networkFilter;
    })
    .sort((a, b) => {
      return toTotalDisplay(amounts, b) * prices[b.coinGeckoId] - toTotalDisplay(amounts, a) * prices[a.coinGeckoId];
    })
    .map((t: TokenItemType) => {
      let amount = BigInt(amounts[t.denom] ?? 0);
      let usd = getUsd(amount, t, prices);
      let subAmounts: AmountDetails;
      if (t.contractAddress && t.evmDenoms) {
        subAmounts = getSubAmountDetails(amounts, t);
        const subAmount = toAmount(toSumDisplay(subAmounts), t.decimals);
        amount += subAmount;
        usd += getUsd(subAmount, t, prices);
      }
      const value = toDisplay(amount.toString(), t.decimals) * prices[t.coinGeckoId] || 0;
      const tokenIcon = tokensIcon.find(token => token.coinGeckoId === t.coinGeckoId);
      return {
        asset: t.name,
        chain: t.org,
        icon: tokenIcon?.Icon,
        iconLight: tokenIcon?.IconLight,
        price: prices[t.coinGeckoId] || 0,
        balance: toDisplay(amount.toString(), t.decimals),
        denom: t.denom,
        value: value,
        coeff: 0,
        coeffType: 'increase'
      };
    });

  const headers: TableHeaderProps<AssetInfoResponse> = {
    assets: {
      name: 'ASSET',
      accessor: data => (
        <div className={styles.assets}>
          <div className={styles.left}>
            {theme === 'light' ? (
              <data.iconLight className={styles.tokenIcon} />
            ) : (
              <data.icon className={styles.tokenIcon} />
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.assetName}>{data.asset}</div>
            <div className={styles.assetChain}>{data.chain}</div>
          </div>
        </div>
      ),
      width: '30%',
      align: 'left',
      padding: `0px 0px 0px ${sizePadding}`
    },
    price: {
      name: 'PRICE',
      width: '23%',
      accessor: data => <div className={styles.price}>${Number(data.price.toFixed(6))}</div>,
      align: 'left'
    },
    balance: {
      name: 'BALANCE',
      width: '23%',
      align: 'left',
      accessor: data => (
        <div className={cx('balance', `${!data.balance && 'balance-low'}`)}>
          {numberWithCommas(toFixedIfNecessary(data.balance.toString(), isMobile() ? 3 : 6))}{' '}
          <span className={cx('balance-assets')}>{data.asset}</span>
        </div>
      )
    },
    value: {
      name: 'VALUE',
      width: '24%',
      align: 'left',
      padding: '0px 8px 0px 0px',
      accessor: data => {
        return (
          <div className={styles.valuesColumn}>
            <div>
              <div className={styles.value}>{formatDisplayUsdt(data.value)}</div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className={cx('assetsTab')}>
      <div className={cx('info')}>
        {listAsset.map((e, i) => {
          return (
            <div key={i} className={cx('total-info')}>
              <div className={cx('icon')}>
                <img className={cx('wallet')} src={e.src} alt="wallet" />
              </div>
              <div className={cx('balance')}>
                <div className={cx('label')}>{e.label}</div>
                <div className={cx('value')}>{e.balance}</div>
              </div>
            </div>
          );
        })}
        <div className={cx('switch')}>
          <ToggleSwitch
            small={true}
            id="small-balances"
            checked={hideOtherSmallAmount}
            onChange={() => setHideOtherSmallAmount(!hideOtherSmallAmount)}
          />
          <label htmlFor="small-balances">Hide small balances!</label>
        </div>
      </div>
      <div>
        <Table
          headers={headers}
          // @ts-ignore
          data={data}
          stylesColumn={{
            padding: '16px 0'
          }}
        />
      </div>
    </div>
  );
};
