import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/amino';
import { wasmTypes } from '@cosmjs/cosmwasm-stargate';
import { toBech32 } from '@cosmjs/encoding';
import { AccountData, DirectSecp256k1Wallet, OfflineDirectSigner, Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes as defaultStargateTypes } from '@cosmjs/stargate';
import initBLS from '@oraichain/blsdkg';
import { NetworkChainId } from '@oraichain/oraidex-common';
import { OraiServiceProvider } from '@oraichain/service-provider-orai';
import { chainInfos } from 'config/chainInfos';
import { network } from 'config/networks';
import { SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { onlySocialKey } from 'okey';
import { ConfirmPassStatus, ConfirmSignStatus } from 'reducer/type';
import { getCosmWasmClient as getCosmWasmClientOrigin } from './cosmjs';
import CryptoJS from 'crypto-js';
import { getHashKeySSOFromStorage } from 'helper';

export const CONFIG_SOCIAL_KEY = {
  typeOfLogin: 'google' as const,
  clientId: '88022207528-isvvj6icicp9lkgl6ogcpj5eb729iao8.apps.googleusercontent.com',
  verifier: 'tkey-google'
};

export const initSSO = async () => {
  // Initialization of Service Provider
  try {
    await initBLS('/blsdkg_bg.wasm');
    await (onlySocialKey.serviceProvider as OraiServiceProvider).init();
  } catch (error) {
    console.error('init sso error:', error);
  }
};

export const reinitializeSigner = async (chainId: string | 'orai', uiHandler?: UIHandler) => {
  try {
    const hashKey = getHashKeySSOFromStorage();
    const { privateKey, passphrase } = decryptData(hashKey, PP_CACHE_KEY);

    const chain = chainInfos.find((c) => c.chainId === chainId);
    const prefix = chain?.bech32Config?.bech32PrefixAccAddr || 'orai';

    const privateKeySigner = await PrivateKeySigner.createFromPrivateKey(privateKey, prefix, uiHandler);
    window.PrivateKeySigner = privateKeySigner;

    return privateKeySigner;
  } catch (error) {
    console.log('error', error);
  }
};

export const triggerLogin = async (
  chainId: string = 'Oraichain',
  passphraseHandler: PassphraseUIHandler,
  uiHandler?: UIHandler
) => {
  if (!onlySocialKey) {
    return;
  }
  try {
    const loginResponse = await (onlySocialKey.serviceProvider as OraiServiceProvider).triggerLogin(CONFIG_SOCIAL_KEY);
    const privateKey = loginResponse?.privateKey;
    const chain = chainInfos.find((c) => c.chainId === chainId);
    const prefix = chain?.bech32Config?.bech32PrefixAccAddr || 'orai';

    const privateKeySigner = await PrivateKeySigner.createFromPrivateKey(privateKey, prefix, uiHandler);

    window.PrivateKeySigner = privateKeySigner;

    const { passphrase, confirmed } = ((await passphraseHandler.process()) as any) || {};

    if (passphrase && confirmed === ConfirmPassStatus.approved) {
      const hashKey = encryptData(passphrase, privateKey, PP_CACHE_KEY);

      const cosmWasmClient = await privateKeySigner.getCosmWasmClient({ chainId });
      if (cosmWasmClient?.client) window.client = cosmWasmClient.client;

      return { privateKeySigner, hashKey };
    }
  } catch (error) {
    console.log({ error });
  }
};

// UIModel
export interface UIHandler {
  open: (data: any) => void;
  process: (signDoc: any) => Promise<any>;
  close: () => void;
}

// UIModel
export interface PassphraseUIHandler {
  open: () => void;
  process: () => Promise<any>;
  close: () => void;
}

export function storageAvailable(type: 'sessionStorage' | 'localStorage'): boolean {
  let storageExists = false;
  let storageLength = 0;
  let storage: Storage;
  try {
    storage = window[type];
    storageExists = true;
    storageLength = storage.length;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error: unknown) {
    const _error = error as DOMException;
    return !!(
      _error &&
      // everything except Firefox
      (_error.code === 22 ||
        // Firefox
        _error.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        _error.name === 'QuotaExceededError' ||
        // Firefox
        _error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storageExists &&
      storageLength !== 0
    );
  }
}

export const PP_CACHE_KEY = 'Web3Auth-oraidex-pp';

// Switch Wallet Keplr Owallet
export const getWeb3MultifactorStorageKey = (key = PP_CACHE_KEY) => {
  return sessionStorage.getItem(key);
};

export const setWeb3MultifactorStorageKey = (key = PP_CACHE_KEY, value) => {
  return sessionStorage.setItem(key, value);
};

export const removeWeb3MultifactorStorageKey = (key = PP_CACHE_KEY) => {
  return sessionStorage.removeItem(key);
};

export const encryptData = (passphrase: string, privateKey: string, secretKey: string): string => {
  const data = JSON.stringify({ passphrase, privateKey });
  const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encrypted;
};

export const decryptData = (hashKey: string, secretKey: string): { passphrase: string; privateKey: string } | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(hashKey, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export class PrivateKeySigner implements OfflineDirectSigner {
  private UIHandler: UIHandler;
  public pubkey: Uint8Array;
  private privKey: Uint8Array;
  private signer: OfflineDirectSigner;
  private registry: Registry;

  protected constructor(
    privKey: Uint8Array,
    signer: OfflineDirectSigner,
    accountData: AccountData,
    UIHandler?: UIHandler
  ) {
    this.UIHandler = UIHandler;
    this.signer = signer;
    this.pubkey = accountData.pubkey;
    this.privKey = privKey;
    this.registry = new Registry([...defaultStargateTypes, ...wasmTypes]);
  }

  static async createFromPrivateKey(privateKey: string | Buffer | Uint8Array, prefix: string, UIHandler?: UIHandler) {
    let privateKeyBuffer;
    privateKeyBuffer = privateKey;
    if (typeof privateKey === 'string') {
      privateKeyBuffer = Buffer.from(privateKey, 'hex');
    }

    const signer = await DirectSecp256k1Wallet.fromKey(privateKeyBuffer, prefix);
    const accountData = (await signer.getAccounts())[0];
    const privSigner = new PrivateKeySigner(privateKeyBuffer, signer, accountData, UIHandler);

    return privSigner;
  }

  setUiHandler = (UIHandler: UIHandler) => {
    this.UIHandler = UIHandler;
  };

  decodeMsg = (msg: Any) => {
    try {
      const decodeMsg = this.registry.decode(msg);

      if (decodeMsg.msg) {
        const msgBody = Buffer.from(decodeMsg.msg).toString();
        return {
          ...decodeMsg,
          msg: JSON.parse(msgBody)
        };
      }
      return decodeMsg;
    } catch (error) {
      console.log('error', error);
    }
  };

  getOfflineSigner = async (chainId?: string) => {
    if (!chainId) {
      return this;
    }

    const chain = chainInfos.find((c) => c.chainId === chainId);
    this.signer = await DirectSecp256k1Wallet.fromKey(this.privKey, chain?.bech32Config?.bech32PrefixAccAddr || 'orai');
    return this;
  };

  getCosmWasmClient = async ({ chainId }) => {
    try {
      const chain = chainInfos.find((c) => c.chainId === chainId);
      this.signer = await DirectSecp256k1Wallet.fromKey(
        this.privKey,
        chain?.bech32Config?.bech32PrefixAccAddr || 'orai'
      );
      const cosmWasmClient = await getCosmWasmClientOrigin({ signer: this, chainId: network.chainId });
      return cosmWasmClient;
    } catch (error) {
      console.error('error getCosmwasmClient: ', error);
    }
  };

  async getKeplrAddr(chainId?: NetworkChainId): Promise<string | undefined> {
    chainId = chainId ?? network.chainId;
    try {
      const curNetwork = chainInfos.find((chain) => chain.chainId === chainId);
      const address = window.PrivateKeySigner.getWalletAddress(curNetwork.bech32Config?.bech32PrefixAccAddr || 'orai');
      return address;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }

  getWalletAddress(prefix: string = 'orai') {
    return toBech32(prefix, rawSecp256k1PubkeyToRawAddress(this.pubkey));
  }

  getAccounts() {
    return this.signer.getAccounts();
  }

  async signDirect(signerAddress: string, signDoc: SignDoc) {
    try {
      const bodyBytes = signDoc.bodyBytes;
      // const txBody = this.registry.decodeTxBody(bodyBytes);
      const txBody = TxBody.decode(bodyBytes);
      const msgs = txBody.messages; // typeUrl, value
      const fmtMsg = msgs.map((msg) => {
        return this.decodeMsg(msg);
      });

      if (this.UIHandler) {
        const data = await this.UIHandler.process(fmtMsg);

        if (data === ConfirmSignStatus.approved) {
          const result = await this.signer.signDirect(signerAddress, signDoc);
          this.UIHandler.close();
          return result;
        }

        this.UIHandler?.close();
        throw new Error('Transaction was rejected');
      } else {
        this.UIHandler?.close();
        throw new Error('Wallet was not setup');
      }
    } catch (error) {
      this.UIHandler?.close();
      console.log('Error sign', error);
    }
  }
}