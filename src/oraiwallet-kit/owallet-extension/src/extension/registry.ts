import { Wallet } from '@cosmos-kit/core';
import { ICON } from '../constant';

export const owalletExtensionInfo: Wallet = {
  name: 'owallet-extension',
  prettyName: 'Owallet',
  logo: ICON,
  mode: 'extension',
  // In the Keplr Mobile in-app browser, Keplr is available in window.keplr,
  // similar to the extension on a desktop browser. For this reason, we must
  // check what mode the window.keplr client is in once it's available.
  mobileDisabled: () =>
    !(
      typeof document !== 'undefined' &&
      document.readyState === 'complete' &&
      // @ts-ignore
      window.owallet &&
      // @ts-ignore
      window.owallet.mode === 'mobile-web'
    ),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chromewebstore.google.com/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga?pli=1',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
    },
    {
      link: 'https://www.keplr.app/download',
    },
  ],
};
