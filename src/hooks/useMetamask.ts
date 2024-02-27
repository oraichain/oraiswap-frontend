import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

const loadAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) return;
  if (isMobile()) await window.Metamask.switchNetwork(Networks.bsc);
  // passe cointype 60 for ethereum or let it use default param
  let accounts = await window.ethereumDapp.request({
    method: 'eth_accounts',
    params: [60]
  });

  if (accounts.length === 0) {
    accounts = await window.ethereumDapp.request({
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
    try {
      accounts = accounts ?? (await loadAccounts());
      if (accounts && accounts?.length > 0) {
        const metamaskAddress = ethers.utils.getAddress(accounts[0]);
        loadTokenAmounts({ metamaskAddress });
        setMetamaskAddress(metamaskAddress);
      } else {
        setMetamaskAddress(undefined);
        throw new Error('Connect metamask failed!');
      }
    } catch (error) {
      console.log({ errorConnectMetmask: error });
      throw new Error(error?.message ?? JSON.stringify(error));
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
    const { ethereumDapp } = window;
    if (ethereumDapp && ethereumDapp.on) {
      ethereumDapp.on('connect', connect);
      ethereumDapp.on('accountsChanged', connect);
      return () => {
        if (ethereumDapp.removeListener) {
          ethereumDapp.removeListener('connect', connect);
          ethereumDapp.removeListener('accountsChanged', connect);
        }
      };
    }
  }, []);
  return connect;
}
