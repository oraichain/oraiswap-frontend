import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { network } from 'config/networks';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import ConnectWalletModal from './ConnectWalletModal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { injected, useEagerConnect } from 'hooks/useMetamask';
import useGlobalState from 'hooks/useGlobalState';
import { BSC_CHAIN_ID } from 'config/constants';

const RequireAuthButton: React.FC<any> = ({
  address,
  setAddress,
  ...props
}) => {
  const [openConnectWalletModal, setOpenConnectWalletModal] = useState(false);
  const [isInactiveMetamask, setIsInactiveMetamask] = useState(false);
  const [metamaskAddress, setMetamaskAddress] =
    useGlobalState('metamaskAddress');
  const { activate, deactivate } = useWeb3React();

  useEagerConnect(isInactiveMetamask,false);
  const onClick = () => {
    setOpenConnectWalletModal(true);
  };

  const connectMetamask = async () => {
    try {
      setIsInactiveMetamask(false);

      // if chain id empty, we switch to default network which is BSC
      if (!window.ethereum.chainId) {
        await window.Metamask.switchNetwork(BSC_CHAIN_ID);
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

  const connectKeplr = async () => {
    if (!(await window.Keplr.getKeplr())) {
      return displayToast(
        TToastType.TX_INFO,
        {
          message: 'You must install Keplr to continue'
        },
        { toastId: 'install_keplr' }
      );
    }

    await window.Keplr.suggestChain(network.chainId);
    const address = await window.Keplr.getKeplrAddr();
    setAddress(address as string);
  };

  const disconnectKeplr = async () => {
    try {
      window.Keplr.disconnect();
      setAddress('');
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <React.Fragment>
      <Button {...props} onClick={onClick}>
        {props.children}
      </Button>
      {openConnectWalletModal && (
        <ConnectWalletModal
          connectMetamask={connectMetamask}
          connectKeplr={connectKeplr}
          disconnectMetamask={disconnectMetamask}
          disconnectKeplr={disconnectKeplr}
          address={address}
          metamaskAddress={metamaskAddress}
          isOpen={openConnectWalletModal}
          close={() => {
            setOpenConnectWalletModal(false);
          }}
          open={() => {
            setOpenConnectWalletModal(true);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default RequireAuthButton;
