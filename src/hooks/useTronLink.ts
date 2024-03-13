import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';

export function useTronEventListener() {
  const [, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const mobileMode = isMobile();

  useEffect(() => {
    // not auto connect Tron in browser
    if (!mobileMode) return;
    window.dispatchEvent(new Event('tronLink#initialized'));
    // Example
    // Suggested reception method
    if (window.tronLinkDapp) {
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

  async function handleTronLink() {
    const { tronLinkDapp, tronWebDapp } = window;
    if (tronLinkDapp && tronWebDapp) {
      // @ts-ignore
      const addressTronMobile = await tronLinkDapp.request({
        method: 'tron_requestAccounts'
      });
      // TODO: Check owallet mobile
      if (!tronWebDapp?.defaultAddress?.base58 || isMobile()) {
        //@ts-ignore
        const tronAddress = addressTronMobile?.base58;
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
        return;
      }

      console.log('tronLink & tronWeb successfully detected!');
      if (tronWebDapp.defaultAddress?.base58) {
        const tronAddress = tronWebDapp.defaultAddress.base58;
        console.log('tronAddress', tronAddress);
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
      }

      window.addEventListener('message', function (e) {
        if (e?.data?.message && e.data.message.action == 'setAccount') {
          const tronAddress = e.data.message?.data?.address;
          console.log('tronAddress', tronAddress);
          loadTokenAmounts({ tronAddress });
          setTronAddress(tronAddress);
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support
        if (e?.data?.message && e.data.message.action == 'disconnect') {
          console.log('disconnect event', e.data.message.isTronLink);
          setTronAddress(undefined);
        }
      });
      // Access the decentralized web!
    } else {
      console.log('Please install TronLink-Extension!');
    }
  }
}
