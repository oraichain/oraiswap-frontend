import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { tronToEthAddress } from 'helper';

export function useTronEventListener() {
  const [, setTronAddress] = useConfigReducer('tronAddress');

  useEffect(() => {
    window.dispatchEvent(new Event('tronLink#initialized'));
    // Example
    // Suggested reception method
    if (window.tronLink) {
      handleTronLink();
    } else {
      window.addEventListener('tronLink#initialized', handleTronLink, {
        once: true,
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
      if (tronWeb.defaultAddress.base58)
        setTronAddress(tronWeb.defaultAddress.base58);

      window.addEventListener('message', function (e) {
        if (e.data.message && e.data.message.action == "setAccount") {
          console.log("setAccount event", e.data.message)
          console.log("current address:", e.data.message.data.address)
          setTronAddress(e.data.message.data.address);
        }

        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support 
        if (e.data.message && e.data.message.action == "disconnect") {
          console.log("disconnect event", e.data.message.isTronLink)
          setTronAddress(undefined);
        }

      })
      // Access the decentralized web!
    } else {
      console.log('Please install TronLink-Extension!');
    }
  }
}
