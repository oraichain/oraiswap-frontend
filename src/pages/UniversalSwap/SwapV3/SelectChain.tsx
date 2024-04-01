import { CoinIcon, TokenItemType } from '@oraichain/oraidex-common';
import { TokenInfo } from 'types/token';
import styles from './SelectChain.module.scss';
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

export default function SelectChain({ isSelectToken, setIsSelectToken }: InputSwapProps) {
  return (
    <>
      <div className={cx('selectChainWrap')}>
        <div className={styles.selectToken}>
          <div className={styles.selectTokenHeader}>
            <div />
            <div className={styles.selectTokenHeaderTitle}>Select network</div>
            <div className={styles.selectTokenHeaderClose} onClick={() => setIsSelectToken(false)}>
              <IconoirCancel />
            </div>
          </div>
          <div className={styles.selectTokenSearch}></div>
        </div>
      </div>
    </>
  );
}
