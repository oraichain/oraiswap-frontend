import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { chainInfos } from 'config/chainInfos';
import { getWalletByNetworkFromStorage } from 'helper';
import Keplr from 'libs/keplr';
import Metamask from 'libs/metamask';
import Bitcoin from 'libs/bitcoin';
import tronweb from 'tronweb';
import { Networks } from '@oraichain/ethereum-multicall';
import { Buffer } from 'buffer';

// polyfill

// @ts-ignore
Tendermint37Client.detectVersion = () => {};

// @ts-ignore
Tendermint37Client.prototype.status = function () {
  const chainInfo = chainInfos.find((chain) => chain.networkType === 'cosmos' && chain.rpc === this.client.url);
  return {
    nodeInfo: {
      network: chainInfo.chainId,
      version: ''
    }
  };
};

// inject global
// @ts-ignore
window.TronWeb = tronweb;
// @ts-ignore
window.Networks = Networks;

// enable Keplr
const walletType = getWalletByNetworkFromStorage();
window.Keplr = new Keplr(walletType?.cosmos);

window.ethereumDapp = window.ethereum;

window.Bitcoin = new Bitcoin();
window.Metamask = new Metamask(window.tronWeb);

window.Buffer = Buffer;

// window.process = require('process/browser');

// extend formatToJson
Intl.DateTimeFormat.prototype.formatToJson = function (date: Date) {
  const _this = this as Intl.DateTimeFormat;
  return Object.fromEntries(
    _this
      .formatToParts(date)
      .filter((item) => item.type !== 'literal')
      .map((item) => [item.type, item.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
};

// polyfill abort timeout for some old browser not support.
if (!('timeout' in AbortSignal)) {
  // @ts-ignore
  AbortSignal.timeout = function (delay: number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), delay);
    // Allow Node.js processes to exit early if only the timeout is running
    timeoutId?.unref?.();
    return controller.signal;
  };
}
