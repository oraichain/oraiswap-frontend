import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { getAddressByEIP191, getWalletByNetworkFromStorage } from 'helper';
import useWalletReducer from './useWalletReducer';

const loadAccounts = async (): Promise<string[]> => {
  if (!window.ethereumDapp) return;
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
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const [, setOraiAddress] = useConfigReducer('address');
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const mobileMode = isMobile();

  const connect = async (accounts?: string[], currentConnectingEvmWalletType?: string) => {
    try {
      accounts = Array.isArray(accounts) ? accounts : await loadAccounts();
      alert('acccountne: ' + accounts);
      if (accounts && accounts?.length > 0) {
        const metamaskAddress = ethers.utils.getAddress(accounts[0]);
        alert('metamaskAddress' + metamaskAddress);
        // current connecting evm wallet
        if (currentConnectingEvmWalletType) {
          loadTokenAmounts({ metamaskAddress });
          setMetamaskAddress(metamaskAddress);
          return;
        }

        const walletByNetworks = getWalletByNetworkFromStorage();

        if (walletByNetworks.cosmos === 'eip191') {
          const isSwitchEIP = true;
          const oraiAddress = await getAddressByEIP191(isSwitchEIP);
          setOraiAddress(oraiAddress);
          setCosmosAddress({
            Oraichain: oraiAddress
          });
          loadTokenAmounts({ oraiAddress });
        }

        if (walletByNetworks.evm === 'metamask') {
          loadTokenAmounts({ metamaskAddress });
          setMetamaskAddress(metamaskAddress);
        }
      } else {
        setMetamaskAddress(undefined);
      }
    } catch (error) {
      console.log({ errorConnectMetmask: error });
    }
  };

  useEffect(() => {
    // just auto connect metamask in mobile

    // TODO: re-check later, need to create common function to check condition auto-connect in mobile.
    mobileMode && walletByNetworks.evm !== 'metamask' && connect();
  }, [chainInfo, pathname, mobileMode]);

  return connect;
}

export function useInactiveConnect() {
  const connect = useEagerConnect();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum?.on) {
      ethereum.on('accountsChanged', connect);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', connect);
        }
      };
    }
  }, []);
  return connect;
}
