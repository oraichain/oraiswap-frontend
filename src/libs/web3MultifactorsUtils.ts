import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/amino';
import { toBech32 } from '@cosmjs/encoding';
import { AccountData, decodeTxRaw, DirectSecp256k1Wallet, OfflineDirectSigner, Registry } from '@cosmjs/proto-signing';
import initBLS from '@oraichain/blsdkg';
import { NetworkChainId } from '@oraichain/oraidex-common';
import { OraiServiceProvider } from '@oraichain/service-provider-orai';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos } from 'config/chainInfos';
import { network } from 'config/networks';
import { SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { onlySocialKey } from 'okey';
import { getCosmWasmClient as getCosmWasmClientOrigin } from './cosmjs';
import { ConfirmSignStatus, UiHandlerStatus } from 'reducer/type';
import { wasmTypes } from '@cosmjs/cosmwasm-stargate';
import { defaultRegistryTypes as defaultStargateTypes } from '@cosmjs/stargate';

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
    console.error(error);
  }
};

export const triggerLogin = async (chainId: string = 'Oraichain', uiHandler?: UIHandler) => {
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
    const cosmWasmClient = await privateKeySigner.getCosmWasmClient({ chainId });
    if (cosmWasmClient?.client) window.client = cosmWasmClient.client;

    return privateKeySigner;
  } catch (error) {
    console.log({ error });
  }
};

export function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export enum ActionSSO {
  SSO_EXECUTE = 'sso-oraidex-execute',
  SSO_EXECUTE_MULTIPLE = 'sso-oraidex-execute-multiple'
}

// UIModel
export interface UIHandler {
  open: (data: any) => void;
  process: (signDoc: any) => Promise<any>;
  close: () => void;
}

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
    return new PrivateKeySigner(privateKeyBuffer, signer, accountData, UIHandler);
  }

  decodeMsg = (msg: Any) => {
    try {
      const decodeMsg = this.registry.decode(msg);

      if (decodeMsg.msg) {
        const msgBody = Buffer.from(decodeMsg.msg).toString();
        console.log('msgBody', msgBody);
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
      const msgs = txBody.messages;
      const fmtMsg = msgs.map((msg) => {
        return this.decodeMsg(msg);
      });

      if (this.UIHandler) {
        const data = await this.UIHandler.process(fmtMsg);

        if (data === ConfirmSignStatus.approved) {
          this.UIHandler.close();

          const result = await this.signer.signDirect(signerAddress, signDoc);
          return result;
        }
      } else {
        throw new Error('Wallet was not setup');
      }
    } catch (error) {
      console.log('Error sign', error);
    }
  }
}
