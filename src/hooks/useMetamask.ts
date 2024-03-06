import { isMobile } from '@walletconnect/browser-utils';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect } from 'react';
import useLoadTokens from './useLoadTokens';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { getAddressByEIP191, getWalletByNetworkCosmosFromStorage } from 'helper';

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
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const [, setOraiAddress] = useConfigReducer('address');
  const { pathname } = useLocation();
  const [chainInfo] = useConfigReducer('chainInfo');
  const mobileMode = isMobile();

  const connect = async (accounts?: string[]) => {
    try {
      accounts = Array.isArray(accounts) ? accounts : await loadAccounts();
      if (accounts && accounts?.length > 0) {
        const walletType = getWalletByNetworkCosmosFromStorage();
        const metamaskAddress = ethers.utils.getAddress(accounts[0]);
        let oraiAddress = undefined;
        if (walletType === 'eip191') {
          const isSwitchEIP = true;
          oraiAddress = await getAddressByEIP191(isSwitchEIP);
        }
        if (oraiAddress) {
          setOraiAddress(oraiAddress);
          setCosmosAddress({
            Oraichain: oraiAddress
          });
          loadTokenAmounts({
            oraiAddress
          });
        }
        loadTokenAmounts({
          metamaskAddress
        });
        setMetamaskAddress(metamaskAddress);
      } else {
        setMetamaskAddress(undefined);
        console.error('Connect metamask failed!');
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
    const { ethereum } = window;
    let eventTemp = null;

    if (ethereum && ethereum.on) {
      // ethereum.on('connect', connect);
      ethereum.on('accountsChanged', (acc) => {
        if (acc !== eventTemp) {
          connect();
          eventTemp = acc;
        }
      });
      return () => {
        if (ethereum.removeListener) {
          // ethereum.removeListener('connect', connect);
          ethereum.removeListener('accountsChanged', connect);
        }
      };
    }
  }, []);
  return connect;
}
