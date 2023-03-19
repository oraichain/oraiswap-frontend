import { isMobile } from '@walletconnect/browser-utils';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { BSC_CHAIN_ID, ETHEREUM_CHAIN_ID } from 'config/constants';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tronToEthAddress } from 'helper';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56]
});

export function useEagerConnect(isInactive, isInterval) {
  const web3React = useWeb3React();
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');

  useEffect(() => {
    if (isInterval) return;
    connectEvm();
    connectTronEvm();
  }, [pathname, isInterval]);

  const connectEvm = () => {
    if (!window.ethereum) return;
    if (![BSC_CHAIN_ID, ETHEREUM_CHAIN_ID].includes(Number(window.ethereum.chainId))) return;
    if (!web3React.account && !isInactive && (pathname === '/' || pathname === '/bridge')) {
      console.log('activate');
      web3React.activate(injected);
    }
  };

  const connectTronEvm = () => {
    if (!window.tronWeb) return;
    // TODO: How to process tronweb wallets connected from tronlink? Should we add another tronAddress field?
    if (!window.ethereum)
      setMetamaskAddress(tronToEthAddress(window.tronWeb.defaultAddress.base58));
  }

  useEffect(() => {
    if (!window.ethereum || isInactive) return;
    (async function () {
      if (isMobile()) await window.Metamask.switchNetwork(BSC_CHAIN_ID);
      // passe cointype 60 for ethereum or let it use default param
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
        params: [60]
      });

      setMetamaskAddress(web3React.account || accounts?.[0]);
    })();
  }, [web3React.account, chainInfo, pathname]);
}

export function useInactiveListener() {
  const { active, error, activate, deactivate, library } = useWeb3React();
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');

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
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setMetamaskAddress(accounts[0]);
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
