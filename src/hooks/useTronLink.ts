import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';
import { getWalletByNetworkFromStorage } from 'helper';

export function useTronEventListener() {
  const [, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const mobileMode = isMobile();

  useEffect(() => {
    if (mobileMode) return;
    window.dispatchEvent(new Event('tronLink#initialized'));
    // Suggested reception method
    if (window.tronLink) {
      handleTronLink();
    } else {
      window.addEventListener('tronLink#initialized', handleTronLink, {
        once: true
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have TronLink installed.
      setTimeout(handleTronLink, 3000); // 3 seconds
    }
  }, [mobileMode]);

  function checkEventSetAccount(e: MessageEvent<any>) {
    return e?.data?.message && e.data.message.action === 'setAccount';
  }

  async function handleTronLink() {
    window.addEventListener('message', async function (e) {
      const walletByNetworks = await getWalletByNetworkFromStorage();
      if (walletByNetworks?.tron === 'tronLink') {
        if (checkEventSetAccount(e)) {
          if (window.tronLink) {
            window.tronLinkDapp = window.tronLink;
            await window.tronLink.request({ method: 'tron_requestAccounts' });
          }

          if (!window.tronWeb) return;
          window.tronWebDapp = window.tronWeb;
          const { base58 } = window.tronWeb.defaultAddress;
          if (base58) {
            setTronAddress(base58);
            loadTokenAmounts({ tronAddress: base58 });
          }
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e?.data?.message && e.data.message.action === 'disconnect') {
          console.log('disconnect event', e.data.message.isTronLink);
          setTronAddress(undefined);
        }
      }
    });
  }
}
