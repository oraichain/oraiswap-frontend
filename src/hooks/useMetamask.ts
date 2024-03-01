import { isMobile } from '@walletconnect/browser-utils';
import { ethers } from 'ethers';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';
import { useLocation } from 'react-router-dom';

const loadAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) return;
  if (isMobile()) await window.Metamask.switchNetwork(Networks.bsc);
  // passe cointype 60 for ethereum or let it use default param
  let accounts = await window.ethereum.request({
    method: 'eth_accounts',
    params: [60]
  });
  if (accounts.length === 0) {
    accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: []
    });
  }
  return accounts;
};

export function useEagerConnect() {
  const loadTokenAmounts = useLoadTokens();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const mobileMode = isMobile();

  const connect = async (accounts?: string[]) => {
    accounts = accounts ?? (await loadAccounts());
    if (accounts?.length > 0) {
      const metamaskAddress = ethers.utils.getAddress(accounts[0]);
      loadTokenAmounts({ metamaskAddress });
      setMetamaskAddress(metamaskAddress);
    } else {
      setMetamaskAddress(undefined);
    }
  };

  useEffect(() => {
    // just auto connect metamask in mobile
    mobileMode && connect();
  }, [chainInfo, pathname, mobileMode]);

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
