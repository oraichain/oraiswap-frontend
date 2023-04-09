import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';

export function useTronEventListener() {
  const [, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  useEffect(() => {
    window.dispatchEvent(new Event('tronLink#initialized'));
    // Example
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
  }, []);

  function handleTronLink() {
    const { tronLink, tronWeb } = window;
    if (tronLink && tronWeb) {
      console.log('tronLink & tronWeb successfully detected!');
      if (tronWeb?.defaultAddress?.base58) {
        const tronAddress = tronWeb.defaultAddress.base58;
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
