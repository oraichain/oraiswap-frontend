import { WalletType as WalletCosmosType } from '@oraichain/oraidex-common/build/constant';
import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as InjIcon } from 'assets/icons/inj.svg';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import { ReactComponent as NobleLightIcon } from 'assets/icons/noble_light.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as OsmoLightIcon } from 'assets/icons/osmosis_light.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';

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
  networks: ChainWallet[];
  wallets: WalletNetwork[];
};

export const walletProvider: WalletProvider[] = [
  {
    networkType: 'cosmos',
    networks: [
      {
        icon: OraiLightIcon,
        name: '',
        chainName: 'oraichain'
      },
      {
        icon: AtomIcon,
        name: '',
        chainName: 'cosmoshub'
      },
      {
        icon: OsmoLightIcon,
        name: '',
        chainName: 'osmosis'
      },
      {
        icon: InjIcon,
        name: '',
        chainName: 'injective'
      },
      {
        icon: NobleLightIcon,
        name: '',
        chainName: 'noble'
      },
      {
        icon: KwtIcon,
        name: '',
        chainName: 'kawaiiverse'
      }
    ],
    wallets: [
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
    ]
  }
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
  // {
  // networkType: 'tron',
  //   networks: [
  //     {
  //       icon: TronNetworkIcon,
  //       name: '',
  //       chainName: 'tron'
  //     }
  //   ],
  //   wallets: [
  //     {
  //       icon: OwalletIcon,
  //       name: 'Owallet'
  //     },
  //     {
  //       icon: TronIcon,
  //       name: 'TronLink'
  //     }
  //   ]
  // }
];
