import { isMobile } from '@walletconnect/browser-utils';
import { ethers } from 'ethers';
import useConfigReducer from 'hooks/useConfigReducer';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLoadTokens from './useLoadTokens';

const loadAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) return;
  if (isMobile()) await window.Metamask.switchNetwork(Networks.bsc);
  // passe cointype 60 for ethereum or let it use default param
  const accounts = await window.ethereum.request({
    method: 'eth_accounts',
    params: [60]
  });
  return accounts;
};

export function useEagerConnect() {
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const loadTokenAmounts = useLoadTokens();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');

  const connect = async (accounts?: string[]) => {
    accounts = accounts ?? (await loadAccounts());
    if (accounts?.length > 0) {
      const metamaskAddress = ethers.utils.getAddress(accounts[0]);
      loadTokenAmounts({ metamaskAddress });
      setMetamaskAddress(metamaskAddress);
    }
  };

  useEffect(() => {
    connect();
  }, [chainInfo, pathname]);

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
