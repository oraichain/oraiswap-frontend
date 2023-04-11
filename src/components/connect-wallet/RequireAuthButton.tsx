import { useWeb3React } from '@web3-react/core';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { Contract } from 'config/contracts';
import { network } from 'config/networks';
import { displayInstallWallet } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { injected, useEagerConnect } from 'hooks/useMetamask';
import { Networks } from 'libs/ethereum-multicall/enums';
import Metamask from 'libs/metamask';
import React, { useState } from 'react';
import ConnectWallet from './ConnectWallet';

const RequireAuthButton: React.FC<any> = ({ address, setAddress }) => {
  const [isInactiveMetamask, setIsInactiveMetamask] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const { activate, deactivate } = useWeb3React();
  const loadTokenAmounts = useLoadTokens();

  useEagerConnect(isInactiveMetamask, false);

  const connectMetamask = async () => {
    try {
      setIsInactiveMetamask(false);

      // if chain id empty, we switch to default network which is BSC
      if (!window.ethereum.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }
      await activate(injected, (ex) => {
        console.log('error: ', ex);
        displayToast(TToastType.METAMASK_FAILED, { message: ex.message });
      });
    } catch (ex) {
      console.log('error in connecting metamask: ', ex);
    }
  };

  const disconnectMetamask = async () => {
    try {
      deactivate();
      setIsInactiveMetamask(true);
      setMetamaskAddress(undefined);
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectTronLink = async () => {
    try {
      // if not requestAccounts before
      if (Metamask.checkTron()) {
        if (!window.tronWeb.defaultAddress?.base58) {
          const { code, message = 'Tronlink is not ready' } = await window.tronLink.request({
            method: 'tron_requestAccounts'
          });
          // throw error when not connected
          if (code !== 200) {
            displayToast(TToastType.TRONLINK_FAILED, { message });
            return;
          }
        }
        const tronAddress = window.tronWeb.defaultAddress.base58;
        console.log('tronAddress', tronAddress);
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
      }
    } catch (ex) {
      console.log('error in connecting tron link: ', ex);
    }
  };

  const disconnectTronLink = async () => {
    try {
      setTronAddress(undefined);
      // remove account storage tron owallet
      localStorage.removeItem('tronWeb.defaultAddress');
    } catch (ex) {
      console.log(ex);
    }
  };

  const connectKeplr = async () => {
    if (!(await window.Keplr.getKeplr())) {
      return displayInstallWallet();
    }

    await window.Keplr.suggestChain(network.chainId);
    const oraiAddress = await window.Keplr.getKeplrAddr();
    console.log('oraiAddress', oraiAddress);
    loadTokenAmounts({ oraiAddress });
    Contract.sender = oraiAddress;
    setAddress(oraiAddress);
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      Contract.sender = '';
      setAddress('');
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <ConnectWallet
      connectMetamask={connectMetamask}
      connectKeplr={connectKeplr}
      disconnectMetamask={disconnectMetamask}
      disconnectKeplr={disconnectKeplr}
      connectTronLink={connectTronLink}
      disconnectTronLink={disconnectTronLink}
      address={address}
      metamaskAddress={metamaskAddress}
      tronAddress={tronAddress}
    />
  );
};

export default RequireAuthButton;
