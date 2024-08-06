import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TonChainId = 'ton';

export enum TonNetwork {
  Mainnet = 'mainnet',
  Testnet = 'testnet'
}

export const TonInteractionContract = {
  [TonNetwork.Mainnet]: {
    lightClient: 'EQDt5RAUICxUeHaNicwspH8obI__z3X0UHy6vv1xhpi3AbfT',
    whitelist: 'EQATDM6mfPZjPDMD9TVa6D9dlbmAKY5w6xOJiTXJ9Nqj_dsu',
    bridgeAdapter: 'EQArWlaBgdGClwJrAkQjQP_8zxIK_bdgbH-6qdl4f5JEfo3r'
  },
  [TonNetwork.Testnet]: {
    lightClient: '',
    whitelist: 'EQD2xPIqdeggqtP3q852Y-7yD-RRHi12Zy7M4iUx4-7q0E1',
    bridgeAdapter: 'EQDZfQX89gMo3HAiW1tSK9visb2gouUvDCt6PODo3qkXKeox'
  }
};

export const TON_SCAN = 'https://tonviewer.com';
export const MANIFEST_URL = `${window.location?.origin}/manifest.json`;

export const TonProvider = (props: React.PropsWithChildren<{}>) => {
  return <TonConnectUIProvider manifestUrl={MANIFEST_URL}>{props.children}</TonConnectUIProvider>;
};
