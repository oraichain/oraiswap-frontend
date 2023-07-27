import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { displayInstallWallet } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { useInactiveConnect } from 'hooks/useMetamask';
import { collectWallet } from 'libs/cosmjs';
import Keplr from 'libs/keplr';
import Metamask from 'libs/metamask';
import React, { useState } from 'react';
import ConnectWallet from './ConnectWallet';

const RequireAuthButton: React.FC<any> = () => {
  const [, setIsInactiveMetamask] = useState(false);
  const [address, setAddress] = useConfigReducer('address');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const loadTokenAmounts = useLoadTokens();
  const connect = useInactiveConnect();

  const connectMetamask = async () => {
    try {
      setIsInactiveMetamask(false);

      // if chain id empty, we switch to default network which is BSC
      if (!window.ethereum.chainId) {
        await window.Metamask.switchNetwork(Networks.bsc);
      }
      await connect();
    } catch (ex) {
      console.log('error in connecting metamask: ', ex);
    }
  };

  const disconnectMetamask = async () => {
    try {
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
        // TODO: Check owallet mobile
        let tronAddress: string;
        if (isMobile()) {
          const addressTronMobile = await window.tronLink.request({
            method: 'tron_requestAccounts'
          });
          //@ts-ignore
          tronAddress = addressTronMobile?.base58;
        } else {
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
          tronAddress = window.tronWeb.defaultAddress.base58;
        }
        loadTokenAmounts({ tronAddress });
        setTronAddress(tronAddress);
      }
    } catch (ex) {
      console.log('error in connecting tron link: ', ex);
      displayToast(TToastType.TRONLINK_FAILED, { message: JSON.stringify(ex) });
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

  const connectKeplr = async (type) => {
    window.Keplr = new Keplr(type);
    localStorage.setItem('typeWallet', type);
    if (!(await window.Keplr.getKeplr())) {
      return displayInstallWallet();
    }
    const wallet = await collectWallet(network.chainId);
    window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
      prefix: network.prefix,
      gasPrice: GasPrice.fromString(`0.002${network.denom}`)
    });
    await window.Keplr.suggestChain(network.chainId);
    const oraiAddress = await window.Keplr.getKeplrAddr();
    console.log('oraiAddress', oraiAddress);
    loadTokenAmounts({ oraiAddress });
    setAddress(oraiAddress);
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
