import React, { useEffect, useState } from 'react';
import * as encoding from '@walletconnect/encoding';
import { BigNumber, utils } from 'ethers';
import { TypedDataField } from '@ethersproject/abstract-signer';
import { Transaction } from '@ethereumjs/tx';
import Blockchain from './components/Blockchain';
// import Banner from "./../components/Banner";
// import Blockchain from "./../components/Blockchain";
// import Column from "./../components/Column";
// import Header from "./../components/Header";
// import Modal from "./components/Modal";
import { DEFAULT_MAIN_CHAINS, DEFAULT_TEST_CHAINS } from './constant';
import {
  AccountAction,
  eip712,
  formatTestTransaction,
  getLocalStorageTestnetFlag,
  hashPersonalMessage,
  hashTypedDataMessage,
  setLocaleStorageTestnetFlag,
  verifySignature
} from './helpers';
// import RequestModal from "./../modals/RequestModal";
// import PingModal from "./../modals/PingModal";
// import {
//   SAccounts,
//   SAccountsContainer,
//   SButtonContainer,
//   SContent,
//   SLanding,
//   SLayout,
//   SToggleContainer
// } from './../components/app';
import { useWalletConnectClient } from './contexts/ClientContext';
import { RELAYER_SDK_VERSION as version } from '@walletconnect/core';
import RequestModal from './modals/RequestModal';
import PingModal from './modals/PingModal';

interface IFormattedRpcResponse {
  method: string;
  address: string;
  valid: boolean;
  result: string;
}

export const WalletConnectMobile = () => {
  const [isTestnet, setIsTestnet] = useState(getLocalStorageTestnetFlag());
  const [isRpcRequestPending, setIsRpcRequestPending] = useState(false);
  const [rpcResult, setRpcResult] = useState<IFormattedRpcResponse | null>();

  const [modal, setModal] = useState('');

  const closeModal = () => setModal('');
  const openPingModal = () => setModal('ping');
  const openRequestModal = () => setModal('request');

  // Initialize the WalletConnect client.
  const {
    client,
    session,
    disconnect,
    chain,
    accounts,
    balances,
    chainData,
    isFetchingBalances,
    isInitializing,
    connect,
    web3Provider
  } = useWalletConnectClient();

  //   useEffect(() => {
  //     client && connect(DEFAULT_MAIN_CHAINS[0]);
  //   }, [client]);

  console.log({ accounts, balances });

  const verifyEip155MessageSignature = (message: string, signature: string, address: string) =>
    utils.verifyMessage(message, signature).toLowerCase() === address.toLowerCase();

  const ping = async () => {
    if (typeof client === 'undefined') {
      throw new Error('WalletConnect Client is not initialized');
    }

    if (typeof session === 'undefined') {
      throw new Error('Session is not connected');
    }

    try {
      setIsRpcRequestPending(true);
      await client.ping({ topic: session.topic });
      setRpcResult({
        address: '',
        method: 'ping',
        valid: true,
        result: 'success'
      });
    } catch (error) {
      console.error('RPC request failed:', error);
    } finally {
      setIsRpcRequestPending(false);
    }
  };

  const onPing = async () => {
    openPingModal();
    await ping();
  };

  const testSendTransaction: () => Promise<IFormattedRpcResponse> = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }

    const { chainId } = await web3Provider.getNetwork();
    const [address] = await web3Provider.listAccounts();
    const balance = await web3Provider.getBalance(address);

    const tx = await formatTestTransaction('eip155:' + chainId + ':' + address);

    if (balance.lt(BigNumber.from(tx.gasPrice).mul(tx.gasLimit))) {
      return {
        method: 'eth_sendTransaction',
        address,
        valid: false,
        result: 'Insufficient funds for intrinsic transaction cost'
      };
    }

    const txHash = await web3Provider.send('eth_sendTransaction', [tx]);

    return {
      method: 'eth_sendTransaction',
      address,
      valid: true,
      result: txHash
    };
  };

  const testSignTransaction: () => Promise<IFormattedRpcResponse> = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }

    const { chainId } = await web3Provider.getNetwork();
    const [address] = await web3Provider.listAccounts();

    const tx = await formatTestTransaction('eip155:' + chainId + ':' + address);
    const signedTx = await web3Provider.send('eth_signTransaction', [tx]);
    const valid = Transaction.fromSerializedTx(signedTx as any).verifySignature();

    return {
      method: 'eth_signTransaction',
      address,
      valid,
      result: signedTx
    };
  };

  const testSignMessage: () => Promise<IFormattedRpcResponse> = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }

    const msg = 'hello world';
    const hexMsg = encoding.utf8ToHex(msg, true);
    const [address] = await web3Provider.listAccounts();
    const signature = await web3Provider.send('personal_sign', [hexMsg, address]);
    const hashMsg = hashPersonalMessage(msg);
    const valid = await verifySignature(address, signature, hashMsg, web3Provider);
    return {
      method: 'personal_sign',
      address,
      valid,
      result: signature
    };
  };

  const testEthSign: () => Promise<IFormattedRpcResponse> = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }
    const msg = 'hello world';
    const hexMsg = encoding.utf8ToHex(msg, true);
    const [address] = await web3Provider.listAccounts();
    const signature = await web3Provider.send('eth_sign', [address, hexMsg]);
    const valid = verifyEip155MessageSignature(msg, signature, address);
    return {
      method: 'eth_sign (standard)',
      address,
      valid,
      result: signature
    };
  };

  const testSignTypedData: () => Promise<IFormattedRpcResponse> = async () => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }

    const message = JSON.stringify(eip712.example);

    const [address] = await web3Provider.listAccounts();

    // eth_signTypedData params
    const params = [address, message];

    // send message
    const signature = await web3Provider.send('eth_signTypedData', params);

    const hashedTypedData = hashTypedDataMessage(message);
    const valid = await verifySignature(address, signature, hashedTypedData, web3Provider);
    return {
      method: 'eth_signTypedData',
      address,
      valid,
      result: signature
    };
  };

  const getEthereumActions = (): AccountAction[] => {
    const wrapRpcRequest = (rpcRequest: () => Promise<IFormattedRpcResponse>) => async () => {
      openRequestModal();
      try {
        setIsRpcRequestPending(true);
        const result = await rpcRequest();
        setRpcResult(result);
      } catch (error) {
        console.error('RPC request failed:', error);
        setRpcResult(null);
      } finally {
        setIsRpcRequestPending(false);
      }
    };

    return [
      { method: 'eth_sendTransaction', callback: wrapRpcRequest(testSendTransaction) },
      { method: 'eth_signTransaction', callback: wrapRpcRequest(testSignTransaction) },
      { method: 'personal_sign', callback: wrapRpcRequest(testSignMessage) },
      { method: 'eth_sign (standard)', callback: wrapRpcRequest(testEthSign) },
      { method: 'eth_signTypedData', callback: wrapRpcRequest(testSignTypedData) }
    ];
  };

  const getBlockchainActions = (chainId: string) => {
    const [namespace] = chainId.split(':');
    switch (namespace) {
      case 'eip155':
        return getEthereumActions();
      case 'cosmos':
        return [];
      default:
        break;
    }
  };

  // Toggle between displaying testnet or mainnet chains as selection options.
  const toggleTestnets = () => {
    const nextIsTestnetState = !isTestnet;
    setIsTestnet(nextIsTestnetState);
    setLocaleStorageTestnetFlag(nextIsTestnetState);
  };

  //   // Renders the appropriate model for the given request that is currently in-flight.
  const renderModal = () => {
    switch (modal) {
      case 'request':
        return <RequestModal pending={isRpcRequestPending} result={rpcResult} />;
      case 'ping':
        return <PingModal pending={isRpcRequestPending} result={rpcResult} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    const chainOptions = DEFAULT_MAIN_CHAINS;
    return !accounts.length && !Object.keys(balances).length ? (
      <div style={{ marginTop: 100 }}>
        <h6>Select an Ethereum chain:</h6>
        {chainOptions.map((chainId) => (
          <Blockchain key={chainId} chainId={chainId} chainData={chainData} onClick={connect} />
        ))}
      </div>
    ) : (
      <div style={{ marginTop: 100 }}>
        <h3>Account</h3>
        <div>
          {accounts.map((account) => {
            return (
              <Blockchain
                key={account}
                active={true}
                chainData={chainData}
                fetching={isFetchingBalances}
                address={account}
                chainId={chain}
                balances={balances}
                actions={getBlockchainActions(chain)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      asdfasdf
      <div maxWidth={1000} spanHeight>
        <div ping={onPing} disconnect={disconnect} session={session} />
        <div>{isInitializing ? 'Loading...' : renderContent()}</div>
      </div>
      {/* <Modal show={!!modal} closeModal={closeModal}> */}
      {renderModal()}
      {/* </Modal> */}
    </div>
  );
};
