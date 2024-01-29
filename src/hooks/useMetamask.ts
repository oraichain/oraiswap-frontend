import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';

const loadAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) return;
  if (isMobile()) await window.Metamask.switchNetwork(Networks.bsc);
  // passe cointype 60 for ethereum or let it use default param
  const accounts = await window.ethereumDapp.request({
    method: 'eth_accounts',
    params: [60]
  });
  return accounts;
};

export function useEagerConnect() {
  const loadTokenAmounts = useLoadTokens();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');

  const connect = async (accounts?: string[]) => {
    accounts = accounts ?? (await loadAccounts());
    if (accounts || accounts?.length > 0) {
      const metamaskAddress = await window.Metamask.getEthAddress();
      loadTokenAmounts({ metamaskAddress });
      setMetamaskAddress(metamaskAddress);
    } else {
      setMetamaskAddress(undefined);
    }
  };

  return connect;
}

export function useInactiveConnect() {
  const connect = useEagerConnect();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on) {
      ethereum.on('connect', connect);
      ethereum.on('accountsChanged', connect);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', connect);
          ethereum.removeListener('accountsChanged', connect);
        }
      };
    }
  }, []);
  return connect;
}
