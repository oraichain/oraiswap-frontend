import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import { TokenInfo } from 'types/token';
import styles from './SelectToken.module.scss';
import SearchInput from 'components/SearchInput';
import cn from 'classnames/bind';
import { chainIcons } from 'config/chainInfos';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as IconoirCancel } from 'assets/icons/iconoir_cancel.svg';

const cx = cn.bind(styles);
interface InputSwapProps {
  isSelectToken: boolean;
  setIsSelectToken?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelectToken({ setIsSelectToken, isSelectToken }: InputSwapProps) {
  return (
    <>
      <div className={cx('selectTokenWrap')}>
        <div className={styles.selectToken}>
          <div className={styles.selectTokenHeader}>
            <div />
            <div className={styles.selectTokenHeaderTitle}>Select a token</div>
            <div className={styles.selectTokenHeaderClose} onClick={() => setIsSelectToken(false)}>
              <IconoirCancel />
            </div>
          </div>
          <div className={styles.selectTokenSearch}>
            <SearchInput placeholder="Find token by name or address" onSearch={(text) => {}} theme={'light'} />
          </div>
          <div className={styles.selectTokenNetwork}>
            <div className={styles.selectTokenNetworkTitle}>Network</div>
            <div className={styles.selectTokenNetworkList}>
              <div className={styles.selectTokenNetworkItem}>All</div>
              {chainIcons.map((e, i) => {
                return (
                  i < 5 && <div className={styles.selectTokenNetworkItem}>{<e.Icon width={18} height={18} />}</div>
                );
              })}
              <div className={styles.selectTokenNetworkItem}>5+</div>
            </div>
          </div>
          <div className={styles.selectTokenAll}>
            <div className={styles.selectTokenTitle}>Select token</div>
            <div className={styles.selectTokenList}>
              {[1, 2, 3].map((e) => {
                return (
                  <div className={styles.selectTokenItem}>
                    <div className={styles.selectTokenItemLeft}>
                      <div>
                        <div className={styles.selectTokenItemLeftImg}>
                          <OraiIcon width={26} height={26} />
                          <div className={styles.selectTokenItemLeftImgChain}>
                            <OraiIcon width={14} height={14} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>ORAI</div>
                        <div>Oraichain</div>
                      </div>
                    </div>
                    <div className={styles.selectTokenItemRight}>
                      <div>923.09 </div>
                      <div>$9,947.81</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
