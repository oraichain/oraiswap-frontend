import type { JsonObject } from '@cosmjs/cosmwasm-stargate';
import type { Coin } from '@cosmjs/proto-signing';
import type { StdFee } from '@cosmjs/stargate';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { network } from 'config/networks';

import { OraiServiceProvider } from '@oraichain/service-provider-orai';
import { onlySocialKey } from 'okey';

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

    console.log(loginResponse);
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

export const getPublicKeySSO = () => {};

export const ssoExecute = async (input: InputExecuteSSO, action: ActionSSO) => {
  const message = Buffer.from(JSON.stringify(input)).toString('base64');
  const url = `${SSO_URL}/execute?input=${message}&action=${action}&callbackUrl=${SSO_CALLBACK}`;

  return new Promise((resolve, reject) => {
    const popup = popupCenter({
      url,
      title: '',
      w: 380,
      h: 550
    });

    let error, result;
    const handleMessage = (event: MessageEvent) => {
      if (typeof window !== 'undefined') {
        if (event.origin !== SSO_URL) {
          return;
        }
        console.log('handleMessage', event?.data);

        const data = JSON.parse(event?.data || '');

        if (data.action !== ActionSSO.SSO_EXECUTE) return;
        if (data.status !== 'success') {
          console.log('err execute: ', data.response);
          error = data.response;
          reject(error);
        } else {
          result = data.response;
          console.log('result', result);
          resolve(result);
        }

        window.removeEventListener('message', handleMessage);

        if (popup) {
          popup.close();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const interval = setInterval(() => {
      if (popup.closed) {
        if (!result) {
          clearInterval(interval);
          window.removeEventListener('message', handleMessage);
        }
        if (!error) {
          reject(new Error('Transaction Rejected!'));
        }
      }
    }, 500);
  });
};

export const ssoExecuteMultiple = async (input: { fee?: StdFee; data: ExecuteInstruction[] }, action: ActionSSO) => {
  const message = Buffer.from(JSON.stringify(input)).toString('base64');
  const url = `${SSO_URL}/execute-multiple?chainId=${
    network?.chainId || 'Oraichain'
  }&input=${message}&action=${action}&callbackUrl=${SSO_CALLBACK}`;

  return new Promise((resolve, reject) => {
    const popup = popupCenter({
      url,
      title: '',
      w: 380,
      h: 550
    });

    let error, result;
    const handleMessage = (event: MessageEvent) => {
      if (typeof window !== 'undefined') {
        if (event.origin !== SSO_URL) {
          return;
        }
        console.log('handleMessage', event?.data);

        const data = JSON.parse(event?.data || '');

        if (data.action !== ActionSSO.SSO_EXECUTE_MULTIPLE) return;
        if (data.status !== 'success') {
          console.log('err execute: ', data.response);
          error = data.response;
          reject(error);
        } else {
          result = data.response;
          console.log('result', result);
          resolve(result);
        }

        window.removeEventListener('message', handleMessage);

        if (popup) {
          popup.close();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const interval = setInterval(() => {
      if (popup.closed) {
        if (!result) {
          clearInterval(interval);
          window.removeEventListener('message', handleMessage);
        }
        if (!error) {
          reject(new Error('Transaction Rejected!'));
        }
      }
    }, 500);
  });
};
