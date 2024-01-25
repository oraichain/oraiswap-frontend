import { WalletType as WalletCosmosType } from '@oraichain/oraidex-common/build/constant';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron-icon.svg';
import { cosmosNetworksWithIcon, tronNetworksWithIcon } from 'helper';

export type NetworkType = 'cosmos' | 'evm' | 'tron';
export type WalletType = WalletCosmosType | 'metamask' | 'tronLink';
export type WalletNetwork = {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  name: string;
  nameRegistry?: WalletType;
  isActive: boolean;
};

export type ChainWallet = {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  name: string;
  chainName: string;
};

export type WalletProvider = {
  networkType: NetworkType;
  networks: any[];
  wallets: WalletNetwork[];
};

export const cosmosWallets: WalletNetwork[] = [
  {
    icon: OwalletIcon,
    name: 'Owallet',
    nameRegistry: 'owallet',
    isActive: true
  },
  {
    icon: KeplrIcon,
    name: 'Keplr',
    nameRegistry: 'keplr',
    isActive: true
  },
  {
    icon: MetamaskIcon,
    name: 'Metamask (Leap Snap)',
    nameRegistry: 'leapSnap',
    isActive: true
  }
];

export const tronWallets: WalletNetwork[] = [
  {
    icon: OwalletIcon,
    name: 'Owallet',
    nameRegistry: 'owallet',
    isActive: true
  },
  {
    icon: TronIcon,
    name: 'TronLink',
    nameRegistry: 'tronLink',
    isActive: true
  }
];

export const allWallets: WalletNetwork[] = [...cosmosWallets, ...tronWallets];

export const walletProvider: WalletProvider[] = [
  {
    networkType: 'cosmos',
    networks: cosmosNetworksWithIcon,
    wallets: cosmosWallets
  },
  // {
  // networkType: 'evm',
  //   networks: [
  //     {
  //       icon: EthIcon,
  //       name: '',
  //       chainName: 'ethereum'
  //     },
  //     {
  //       icon: BnbIcon,
  //       name: '',
  //       chainName: 'ethereum'
  //     },
  //     {
  //       icon: KwtIcon,
  //       name: '',
  //       chainName: 'ethereum'
  //     }
  //   ],
  //   wallets: [
  //     {
  //       icon: OwalletIcon,
  //       name: 'Owallet'
  //     },
  //     {
  //       icon: MetamaskIcon,
  //       name: 'Metamask'
  //     }
  //   ]
  // },
  {
    networkType: 'tron',
    networks: tronNetworksWithIcon,
    wallets: tronWallets
  }
];
