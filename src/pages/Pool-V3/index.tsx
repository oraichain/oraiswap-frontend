import classNames from 'classnames';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PoolList from './components/PoolList';
import PositionList from './components/PositionList';
import styles from './index.module.scss';

export const postMessagePoolV3 = (
  statusWallet: 'connect' | 'disconnect',
  walletType?: string,
  address?: string,
  allowUrl?: string
) => {
  const iframe = document.getElementById('iframe-v3');
  //@ts-ignore
  iframe.contentWindow.postMessage({ walletType, address, statusWallet: statusWallet }, allowUrl ?? '*');
};

export enum PoolV3PageType {
  POOL = 'pools',
  POSITION = 'positions',
  SWAP = 'swap'
}

const PageContent = {
  [PoolV3PageType.POOL]: PoolList,
  [PoolV3PageType.POSITION]: PositionList
  // [PoolV3PageType.SWAP]: PositionList
};

const PoolV3 = () => {
  const { type } = useParams<{ type: PoolV3PageType }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (![PoolV3PageType.POOL, PoolV3PageType.POSITION].includes(type)) {
      navigate(`/pools-v3/${PoolV3PageType.POOL}`);
    }
  }, [type]);

  const Content = PageContent[type || PoolV3PageType.POOL];

  return (
    <div className={classNames(styles.poolV3)}>
      <div className={styles.header}>header</div>

      <div className={styles.content}>{Content && <Content />}</div>
    </div>
  );
};

export default PoolV3;
