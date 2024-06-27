import { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import { getWalletByNetworkFromStorage } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseBannerIcon } from 'assets/icons/close.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning_icon.svg';
import Lottie from 'lottie-react';
import PoolV3Lottie from 'assets/lottie/poolv3-beta.json';
import classNames from 'classnames';

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

const PoolV3 = () => {
  const iframeRef = useRef(null);
  const [address] = useConfigReducer('address');
  const [openBanner, setOpenBanner] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    const handleLoad = () => {
      callFunctionInIframe();
    };

    if (iframe) iframe.addEventListener('load', handleLoad);
    return () => {
      if (iframe) iframe.removeEventListener('load', handleLoad);
    };
  }, [address]);

  const callFunctionInIframe = () => {
    const walletType = getWalletByNetworkFromStorage();

    postMessagePoolV3(
      !walletType?.cosmos ? 'disconnect' : 'connect',
      isMobile() ? 'owallet' : walletType?.cosmos,
      address
    );
  };

  return (
    <div className={classNames(styles.poolV3)}>
      {openBanner && (
        <div className={styles.banner}>
          <div className={styles.text}>
            {/* <WarningIcon />{' '} */}

            <span className={styles.lottie}>
              <Lottie animationData={PoolV3Lottie} autoPlay={true} loop />
            </span>
            <span>
              {' '}
              <strong>This version is flagged as community open beta.</strong> Please be mindful with issues & feedback
              to us.
            </span>
          </div>
          <div className={styles.closeBanner} onClick={() => setOpenBanner(false)}>
            <CloseBannerIcon />
          </div>
        </div>
      )}
      <iframe
        className={classNames({ [styles.inactiveMargin]: openBanner })}
        ref={iframeRef}
        key={address}
        id={'iframe-v3'}
        src={'/v3'}
        title="pool-v3"
        frameBorder={0}
      />
    </div>
  );
};

export default PoolV3;
