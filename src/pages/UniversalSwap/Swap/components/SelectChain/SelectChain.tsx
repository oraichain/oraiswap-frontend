import { CoinIcon, TokenItemType, CustomChainInfo } from '@oraichain/oraidex-common';
import { TokenInfo } from 'types/token';
import styles from './SelectChain.module.scss';
import SearchInput from 'components/SearchInput';
import cn from 'classnames/bind';
import { chainIcons } from 'config/chainInfos';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as IconoirCancel } from 'assets/icons/iconoir_cancel.svg';
import { networks } from 'helper';
import NetworkImg from 'assets/icons/network.svg';
import CheckImg from 'assets/icons/check.svg';
import { getTotalUsd } from 'libs/utils';
import { tokenMap } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { Themes } from 'context/theme-context';
import { formatDisplayUsdt } from 'pages/Pools/helpers';

const cx = cn.bind(styles);
interface InputSwapProps {
  isSelectToken: boolean;
  selectChain: string;
  setSelectChain?: any;
  setIsSelectToken?: React.Dispatch<React.SetStateAction<boolean>>;
  amounts: AmountDetails;
  theme: Themes;
  prices: CoinGeckoPrices<string>;
  filterChainId?: string[];
}

export default function SelectChain({
  isSelectToken,
  setIsSelectToken,
  setSelectChain,
  amounts,
  prices,
  theme,
  filterChainId = []
}: InputSwapProps) {
  // const isAllowChainId = (chainId) => ['kawaii_6886-1', 'bitcoin', 'noble-1', 'Neutaro-1'].includes(chainId);
  const isAllowChainId = (chainId) => ['kawaii_6886-1', 'bitcoin'].includes(chainId);
  const totalUsd = networks.reduce((acc, cur) => {
    if (isAllowChainId(cur.chainId)) return acc;
    const subAmounts = Object.fromEntries(
      Object.entries(amounts).filter(([denom]) => tokenMap[denom] && tokenMap[denom].chainId === cur.chainId)
    );
    const totalUsd = getTotalUsd(subAmounts, prices);
    return acc + totalUsd;
  }, 0);
  return (
    <>
      {/* <div className={cx('selectChainWrap', isSelectToken ? 'active' : '')}> */}
      {/* {isSelectToken && <div className={styles.selectChainOverlay} onClick={() => setIsSelectToken(false)}></div>} */}
      <div className={`${styles.selectChain} ${isSelectToken ? styles.active : ''}`}>
        <div className={styles.selectChainHeader}>
          <div />
          <div className={styles.selectChainHeaderTitle}>Select network</div>
          <div className={styles.selectChainHeaderClose} onClick={() => setIsSelectToken(false)}>
            <IconoirCancel />
          </div>
        </div>

        <div className={styles.selectChainItemAll}>
          <div className={styles.selectChainItemLeft}>
            <img className={styles.selectChainItemLogo} src={NetworkImg} alt="network" />
            <div className={styles.selectChainItemTitle}>
              <div>{'All networks'}</div>
            </div>
          </div>
          <div className={styles.selectChainItemValue}>{formatDisplayUsdt(totalUsd)}</div>
        </div>

        <div className={styles.selectChainList}>
          <div className={styles.selectChainItems}>
            {networks
              .filter(
                (net) => !isAllowChainId(net.chainId) && (!filterChainId.length || filterChainId.includes(net.chainId))
              )
              .map((item) => {
                const networkIcon = chainIcons.find((chainIcon) => chainIcon.chainId === item.chainId);
                const key = item.chainId.toString();
                const title = item.chainName;
                const subAmounts = Object.fromEntries(
                  Object.entries(amounts).filter(
                    ([denom]) => tokenMap[denom] && tokenMap[denom].chainId === item.chainId
                  )
                );
                const totalUsd = getTotalUsd(subAmounts, prices);
                const balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
                return (
                  <div
                    key={key}
                    className={styles.selectChainItem}
                    onClick={() => {
                      setSelectChain(item.chainId);
                      setIsSelectToken(false);
                    }}
                  >
                    <div className={styles.selectChainItemLeft}>
                      {theme === 'light' ? (
                        <networkIcon.IconLight className={styles.selectChainItemLogo} />
                      ) : (
                        <networkIcon.Icon className={styles.selectChainItemLogo} />
                      )}
                      <div className={styles.selectChainItemTitle}>
                        <div>{title}</div>
                      </div>
                    </div>
                    <div className={styles.selectChainItemValue}>{balance}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
