import { Button } from 'components/Button';
import useConfigReducer from 'hooks/useConfigReducer';
import useWalletReducer from 'hooks/useWalletReducer';
import { isJSON, popupCenter, SSO_URL } from 'libs/web3MultifactorsUtils';
import { useEffect } from 'react';
import styles from './index.module.scss';

const SSO = () => {
  const [oraiAddress, setOraiAddress] = useConfigReducer('address');
  const [evmAddress, setEvmAddress] = useConfigReducer('metamaskAddress');
  const [walletByNetworks, setWalletByNetwork] = useWalletReducer('walletsByNetwork');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        (event) => {
          console.log('event-login', event);
          if (event.origin !== SSO_URL) return;

          if (event.data) {
            if (isJSON(event.data)) {
              const msg = JSON.parse(event.data);
              if (msg?.response?.accessTokenSso && msg.response.user && msg.status === 'success') {
                const { walletAddressOrai } = msg.response || {};

                setOraiAddress(walletAddressOrai);
                setCosmosAddress({
                  Oraichain: walletAddressOrai
                });
                setWalletByNetwork({
                  ...walletByNetworks,
                  cosmos: 'sso'
                });
              }
            }
          }
        },
        false
      );
    }
    return window.removeEventListener('message', () => {});
  }, []);

  const login = () => {
    popupCenter({
      url: `${SSO_URL}/google-signin`,
      title: 'Login Google',
      w: 380,
      h: 550
    });
  };

  return (
    <div className={styles.sso}>
      <Button type="third" onClick={() => login()}>
        Login SSO
      </Button>
    </div>
  );
};

export default SSO;
