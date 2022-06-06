import { BSC_RPC, ORAI } from 'config/constants';
// import { WalletConnect } from '@web3-react/walletconnect';
import { BSC_CHAIN_ID } from 'config/constants';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { isMobile } from '@walletconnect/browser-utils';
// import EthereumProvider from 'components/connect-wallet/EthereumProvider';

export const initEthereum = async () => {
  if (isMobile() || !window.ethereum) {
    const chainId = parseInt(BSC_CHAIN_ID, 16);
    const provider = new WalletConnectProvider({
      chainId,
      storageId: 'metamask',
      qrcode: true,
      rpc: { [chainId]: BSC_RPC },
      qrcodeModalOptions: {
        mobileLinks: ['metamask']
      }
    });
    await provider.enable();
    (window.ethereum as any) = provider;
  }
};
