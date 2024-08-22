import useConfigReducer from 'hooks/useConfigReducer';
import useWalletReducer from 'hooks/useWalletReducer';
import { SSO_URL, isJSON, popupCenter } from 'libs/web3MultifactorsUtils';
import { useEffect } from 'react';

const useSSO = (callbackLoginSSO) => {
  const [oraiAddress, setOraiAddress] = useConfigReducer('address');
  const [evmAddress, setEvmAddress] = useConfigReducer('metamaskAddress');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const [walletByNetworks, setWalletByNetwork] = useWalletReducer('walletsByNetwork');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        (event) => {
          if (event.origin !== SSO_URL) return;
          console.log('event-login', event);
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
                callbackLoginSSO();
              }
            }
          }
        },
        false
      );
    }
    return window.removeEventListener('message', () => {});
  }, []);

  const login = (cb?: () => void) => {
    popupCenter({
      url: `${SSO_URL}/google-signin`,
      title: 'Login Google',
      w: 380,
      h: 550,
      callbackClosePopup: cb
    });
  };

  return {
    loginSSO: login
  };
};

export default useSSO;
