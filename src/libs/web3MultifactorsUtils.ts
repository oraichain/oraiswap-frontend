import type { JsonObject } from '@cosmjs/cosmwasm-stargate';
import {
  AccountData,
  DirectSecp256k1Wallet,
  DirectSignResponse,
  OfflineDirectSigner,
  type Coin
} from '@cosmjs/proto-signing';
import { toBech32 } from '@cosmjs/encoding';
import { displayToast, TToastType } from 'components/Toasts/Toast';

import { OraiServiceProvider } from '@oraichain/service-provider-orai';
import { onlySocialKey } from 'okey';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export const SSO_URL = 'https://sso.orai.io';
// export const SSO_CALLBACK = 'https://oraidex.io';
// export const SSO_URL = 'http://localhost:3003';
export const SSO_CALLBACK = 'http://localhost:3000';

export const initSSO = async () => {
  // Initialization of Service Provider
  try {
    // initBLS();
    await (onlySocialKey.serviceProvider as OraiServiceProvider).init();
  } catch (error) {
    console.error(error);
  }
};

export const triggerLogin = async () => {
  if (!onlySocialKey) {
    return;
  }
  try {
    const loginResponse = await (onlySocialKey.serviceProvider as OraiServiceProvider).triggerLogin({
      typeOfLogin: 'google',
      clientId: '88022207528-isvvj6icicp9lkgl6ogcpj5eb729iao8.apps.googleusercontent.com',
      verifier: 'tkey-google'
    });

    const offlineSigner = await DirectSecp256k1Wallet.fromKey(Buffer.from(loginResponse?.privateKey, 'hex'), 'orai');
    const sender = await offlineSigner.getAccounts();
    console.log({ sender });
    console.log(offlineSigner);
    offlineSigner;
    console.log({ loginResponse });

    return loginResponse;
  } catch (error) {
    console.log({ error });
  }
};

export const popupCenter = ({
  url,
  title,
  w,
  h,
  callbackClosePopup,
  callbackPopupBlock
}: {
  url: string;
  title: string;
  w: number;
  h: number;
  callbackClosePopup?: () => void;
  callbackPopupBlock?: () => void;
}) => {
  // eslint-disable-next-line no-restricted-globals
  const left = screen.width / 2 - w / 2;

  // eslint-disable-next-line no-restricted-globals
  const top = screen.height / 2 - h / 2;
  const newWin = window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
  );

  const timer = setInterval(function () {
    if (newWin.closed) {
      if (callbackClosePopup) callbackClosePopup();
      clearInterval(timer);
    }
  }, 1000);

  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    if (callbackPopupBlock) callbackPopupBlock();
    else
      displayToast(TToastType.TX_INFO, {
        message: 'Pop-up Blocker is enabled! Please add this site to your exception list.'
      });
  }

  return newWin;
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

export interface ExecuteInstruction {
  contractAddress: string;
  msg: JsonObject;
  funds?: readonly Coin[];
}
export interface InputExecuteSSO {
  chainId: string;
  contractAddress: string;
  params: any;
  fee?: any;
  funds?: readonly Coin[];
  gasAmount: Coin;
  gasLimits?: { exec: number };
  memo?: string;
}

// UIModel
export interface UIHandler {
  dispatch: (action: string, data?: any) => Promise<boolean>;
}

export class PrivateKeySigner implements OfflineDirectSigner {
  private UIHandler: UIHandler;
  public pubkey: Uint8Array;
  private signer: OfflineDirectSigner;
  protected constructor(signer: OfflineDirectSigner, accountData: AccountData, UIHandler?: UIHandler) {
    this.UIHandler = UIHandler;
    this.signer = signer;
    this.pubkey = accountData.pubkey;
  }

  async createFromPrivateKey(privateKey: string | Buffer | Uint8Array, UIHandler?: UIHandler) {
    let privateKeyBuffer;
    privateKeyBuffer = privateKey;
    if (typeof privateKey === 'string') {
      privateKeyBuffer = Buffer.from(privateKey, 'hex');
    }
    const signer = await DirectSecp256k1Wallet.fromKey(privateKeyBuffer);
    const accountData = (await signer.getAccounts())[0];
    return new PrivateKeySigner(signer, accountData, UIHandler);
  }

  getWalletAddress(prefix: string = 'orai') {
    return toBech32(prefix, this.pubkey);
  }

  getAccounts() {
    return this.signer.getAccounts();
  }

  async signDirect(signerAddress: string, signDoc: SignDoc) {
    let uiResponse = true;
    if (this.UIHandler) {
      uiResponse = await this.UIHandler.dispatch('open');
    }

    if (!uiResponse) {
      throw new Error('User rejected the transaction');
    }

    const result = await this.signer.signDirect(signerAddress, signDoc);

    if (this.UIHandler) {
      uiResponse = await this.UIHandler.dispatch('close', result);
    }

    return result;
  }
}
