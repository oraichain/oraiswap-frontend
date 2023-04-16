import { Keplr as keplr } from '@keplr-wallet/types';
import { Network } from 'bip32';
import { PoolResponse } from 'libs/contracts/OraiswapPair.types';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';
import Keplr from '../libs/keplr';
import Metamask from '../libs/metamask';
import { TronWeb as _TronWeb } from './tronweb';
import { Networks as _Networks } from 'libs/ethereum-multicall/enums';

declare global {
  type AmountDetails = { [denom: string]: string };
  type IBCInfoMsg = {
    sourcePort: string;
    sourceChannel: string;
    amount: string;
    denom: string;
    sender: string;
    receiver: string;
    timeoutTimestamp: number;
  };
  type PairDetails = {
    [key: string]: PoolResponse;
  };
  type PairAmountInfo = {
    token1Amount: string;
    token2Amount: string;
    tokenUsd: number;
  };
  type LpPoolDetails = {
    [key: string]: {
      balance: string;
    };
  };
  type MetaMaskEthereumProvider = AbstractProvider & {
    chainId: string;
    isMetaMask?: boolean;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    off(eventName: string | symbol, listener: (...args: any[]) => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
  };

  type ExecuteOptions = {
    gas?: number;
    fees?: number;
    funds?: Funds;
    memo?: string;
  };

  type ExecuteKeplrOptions = {
    accountNumber: Long | null;
    sequence: number;
    gas: number;
    fees: number;
    mode?: BroadCastMode;
  };

  type SignedData = {
    signature: string;
    publicKey: string;
  };

  type ContractAddress = {
    marketplace: string | undefined;
    ow721: string | undefined;
    lock?: string | undefined;
    auction: string | undefined;
  };

  type StatusCode = {
    SUCCESS: number;
    NOT_FOUND: number;
    GENERIC_ERROR: number;
  };

  interface FileData {
    name: string;
    data: Buffer;
  }

  interface PoolInfo {
    offerPoolAmount: bigint;
    askPoolAmount: bigint;
  }

  interface ChildKeyData {
    privateKey: Buffer;
    chainCode: Buffer;
    network: Network;
  }

  interface TronLink {
    ready: Bool; //Initialize to false, true after user authorization
    request: ({ method }: { method: 'tron_requestAccounts' }) => Promise<{ code: number; message: string }>; // The method of tuning plugins for dapp website
    sunWeb: sunWeb;
    tronWeb: tronWeb;
  }

  declare class Wallet {
    getChildKey(path?: string): Promise<ChildKeyData>;
    send(message: any);
    deploy(file: FileData);
  }
  interface Window {
    MSStream: String;
    Keystation: any;
    Wallet: Wallet;
    Keplr: Keplr;
    web3: Web3;
    tronWeb: TronWeb;
    tronLink: TronLink;
    ethereum: MetaMaskEthereumProvider;
    ethereumX: MetaMaskEthereumProvider;
    Metamask: Metamask;
    ReactNativeWebView?: {
      postMessage(msg: string): void;
    };
    keplr: keplr;
    browser: Browser;
    queryIfDatasetMinted({ tokenId: string }): Promise<boolean>;
  }

  declare const APP_SETTINGS: Record<string, any>;
  type keplrType = keplr;
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SITE_TITLE: string;
      REACT_APP_SITE_DESC: string;

      // config for relayer
      REACT_APP_ATOM_ORAICHAIN_CHANNELS: string;
      REACT_APP_OSMOSIS_ORAICHAIN_CHANNELS: string;
      REACT_APP_ORAIB_ORAICHAIN_CHANNELS: string;
      REACT_APP_ORAIB_ORAICHAIN_CHANNELS_OLD: string;

      // config for ibc denom
      REACT_APP_ATOM_ORAICHAIN_DENOM: string;
      REACT_APP_OSMOSIS_ORAICHAIN_DENOM: string;
      REACT_APP_AIRIBSC_ORAICHAIN_DENOM: string;
      REACT_APP_USDTBSC_ORAICHAIN_DENOM: string;
      REACT_APP_KWTBSC_ORAICHAIN_DENOM: string;
      REACT_APP_MILKYBSC_ORAICHAIN_DENOM: string;
      REACT_APP_KWT_SUB_NETWORK_DENOM: string;

      // config for oraichain token
      REACT_APP_AIRI_CONTRACT: string;
      REACT_APP_ORAIX_CONTRACT: string;
      REACT_APP_USDT_CONTRACT: string;

      // config for oraichain contract
      REACT_APP_FACTORY_CONTRACT: string;
      REACT_APP_FACTORY_V2_CONTRACT: string;
      REACT_APP_ROUTER_V2_CONTRACT: string;
      REACT_APP_ORACLE_CONTRACT: string;
      REACT_APP_GRAVITY_BSC_CONTRACT: string;
      REACT_APP_GRAVITY_ETH_CONTRACT: string;
      REACT_APP_GRAVITY_TRON_CONTRACT: string;
      REACT_APP_STAKING_CONTRACT: string;
      REACT_APP_REWARDER_CONTRACT: string;
      REACT_APP_CONVERTER_CONTRACT: string;
      REACT_APP_SENTRY_ENVIRONMENT: string;
      REACT_APP_KWT_CONTRACT: string;
      REACT_APP_MILKY_CONTRACT: string;
      REACT_APP_SCORAI_CONTRACT: string;
      REACT_APP_TRX_CONTRACT: string;

      // config for ibc wasm contract (cw20-ics20)
      REACT_APP_IBC_WASM_CONTRACT: string;
      REACT_APP_MULTICALL_CONTRACT: string;
    }
  }

  // re-declare as global
  declare const Networks = _Networks;
  declare const TronWeb = _TronWeb;
  type ReactChildren = React.ReactElement | React.ReactElement[] | React.ReactNode | React.ReactNode[];
}

export { };
