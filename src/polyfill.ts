//@ts-nocheck
import { NetworkChainId } from 'config/chainInfos';
import { network } from 'config/networks';
import { collectWallet } from 'libs/cosmjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';
import { isMobile } from '@walletconnect/browser-utils';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import _BigInt from 'big-integer';
import { chainInfos } from 'config/chainInfos';
import Keplr from 'libs/keplr';
import Metamask from 'libs/metamask';
import { switchWallet } from 'helper';

// inject global
window.TronWeb = require('tronweb');
window.Networks = require('libs/ethereum-multicall/enums').Networks;

// enable Keplr
window.Keplr = new Keplr();
window.Metamask = new Metamask();

window.React = require('react');
window.Buffer = require('buffer').Buffer;
window.process = require('process/browser');

if (typeof BigInt === 'undefined') {
  (window as any)._BigInt = _BigInt;

  class MyBigInt {
    value: bigint;
    constructor(value: MyBigInt | number | string) {
      if (value instanceof MyBigInt) {
        return value;
      } else {
        if (typeof value === 'string' && value.startsWith('0x')) {
          this.value = _BigInt(value.substring(2), 16);
        } else {
          this.value = _BigInt(value);
        }
      }
      // Proxy method calls to _BigInt if possible
      return new Proxy(this, {
        get(obj, field) {
          if (field in obj) return obj[field];
          if (typeof obj.value !== 'bigint' && field in obj.value) return obj.value[field].bind(obj.value);
          return undefined;
        }
      });
    }

    valueOf() {
      return this.value.valueOf();
    }

    equals(b) {
      if (typeof this.value === 'bigint') {
        return this.value === b.value;
      } else if (b instanceof MyBigInt) {
        return this.value.equals(_BigInt(b.value));
      } else {
        return this.value.equals(_BigInt(b));
      }
    }

    toString() {
      return this.value.toString();
    }

    _toUint8ArrayNative(littleEndian = false, elements = 8) {
      const arr = new ArrayBuffer(elements);
      const view = new DataView(arr);
      view.setBigUint64(0, this.value, littleEndian);
      return new Uint8Array(arr);
    }

    _toUint8Array(littleEndian = false, elements = 8) {
      const arr = new ArrayBuffer(elements);
      const uint8arr = new Uint8Array(arr);
      const intarr = this.value.toArray(2 ** 8).value;
      if (littleEndian) uint8arr.set(intarr.reverse(), 0);
      else uint8arr.set(intarr, elements - intarr.length);
      return uint8arr;
    }

    toUint8Array(littleEndian = false, elements = 8) {
      if (typeof this.value === 'bigint') {
        return this._toUint8ArrayNative(littleEndian, elements);
      } else {
        return this._toUint8Array(littleEndian, elements);
      }
    }

    /**
     * Get MyBigInt from a uint8 array in specified endianess.
     * Uses native MyBigInt if the environment supports it and detectSupport is true.
     *
     * @param {Uint8Array} uint8arr
     * @param {boolean} littleEndian use little endian byte order, default is false
     * @param {boolean} detectSupport auto-detect support for native MyBigInt, default is true
     */
    static fromUint8Array(uint8arr: Uint8Array, littleEndian: boolean = false, detectSupport: boolean = true) {
      if (supportsNative && detectSupport) {
        const view = new DataView(uint8arr.buffer);
        return new MyBigInt(view.getBigUint64(0, littleEndian));
      }
      let array;
      if (littleEndian) {
        array = Array.from(uint8arr).reverse();
      } else {
        array = Array.from(uint8arr);
      }
      return new MyBigInt(_BigInt.fromArray(array, 2 ** 8));
    }
  }

  var _old = MyBigInt;
  MyBigInt = function (...args) {
    return new _old(...args);
  };

  (window as any).BigInt = MyBigInt;
}

export const initEthereum = async () => {
  // support only https
  if (isMobile() && !window.ethereum && window.location.protocol === 'https:') {
    const bscChain = chainInfos.find((c) => c.chainId === '0x38');
    const provider = new WalletConnectProvider({
      chainId: Networks.bsc,
      storageId: 'metamask',
      qrcode: true,
      rpc: { [Networks.bsc]: bscChain.rpc },
      qrcodeModalOptions: {
        mobileLinks: ['metamask']
      }
    });
    await provider.enable();
    (window.ethereum as any) = provider;
  }
};

export const initClient = async () => {
  let wallet: OfflineAminoSigner | OfflineDirectSigner;
  try {
    await switchWallet();
    const keplr = await window.Keplr.getKeplr();

    // suggest our chain
    if (keplr) {
      // always trigger suggest chain when users enter the webpage
      for (const networkId of [network.chainId, 'oraibridge-subnet-2', 'kawaii_6886-1'] as NetworkChainId[]) {
        try {
          await window.Keplr.suggestChain(networkId);
        } catch (error) {
          console.log({ error });
        }
      }
      wallet = await collectWallet(network.chainId);
    }
  } catch (ex) {
    console.log(ex);
  }

  // finally assign it
  window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
    prefix: network.prefix,
    gasPrice: GasPrice.fromString(`0.002${network.denom}`)
  });
};
