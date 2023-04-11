import { isMobile } from '@walletconnect/browser-utils';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import useConfigReducer from 'hooks/useConfigReducer';
import { Networks } from 'libs/ethereum-multicall/enums';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLoadTokens from './useLoadTokens';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56]
});

export function useEagerConnect(isInactive: boolean, isInterval: boolean) {
  const web3React = useWeb3React();
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const loadTokenAmounts = useLoadTokens();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');

  useEffect(() => {
    if (isInterval) return;
    connectEvm();
  }, [pathname, isInterval]);

  const connectEvm = () => {
    if (!window.ethereum) return;
    // currently support bsc and eth
    if (![Networks.bsc, Networks.mainnet].includes(Number(window.ethereum.chainId))) return;
    if (!web3React.account && !isInactive && (pathname === '/' || pathname === '/bridge')) {
      console.log('activate');
      web3React.activate(injected);
    }
  };

  useEffect(() => {
    if (!window.ethereum || isInactive) return;
    (async function () {
      if (isMobile()) await window.Metamask.switchNetwork(Networks.bsc);
      // passe cointype 60 for ethereum or let it use default param
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
        params: [60]
      });
      const metamaskAddress = web3React.account || accounts?.[0];
      console.log('metamaskAddress', metamaskAddress);
      loadTokenAmounts({ metamaskAddress });
      setMetamaskAddress(metamaskAddress);
    })();
  }, [web3React.account, chainInfo, pathname]);
}

export function useInactiveListener() {
  const { active, error, activate, deactivate, library } = useWeb3React();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const loadTokenAmounts = useLoadTokens();
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on) {
      ethereum.on('connect', handleConnect);
      // ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      // ethereum.on('networkChanged', handleNetworkChanged);
      // ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (ethereum.removeListener) {
          // ethereum.removeListener('connect', handleConnect);
          // ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          // ethereum.removeListener('networkChanged', handleNetworkChanged);
          // ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [active, error, activate]);

  const handleConnect = () => {
    activate(injected);
  };
  // const handleChainChanged = (chainId) => {
  //   activate(injected);
  // };
  const handleAccountsChanged = (accounts: any[]) => {
    if (accounts.length > 0) {
      const metamaskAddress = accounts[0];
      console.log('metamaskAddress', metamaskAddress);
      loadTokenAmounts({ metamaskAddress });
      setMetamaskAddress(metamaskAddress);
    }
  };
  // const handleNetworkChanged = (networkId) => {
  //   activate(injected);
  // };
  // const handleDisconnect = () => {
  //   if (library?.provider?.isMetamask) {
  //     deactivate();
  //   }
  // };
}
