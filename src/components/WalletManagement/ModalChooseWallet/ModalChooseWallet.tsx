import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as InjIcon } from 'assets/icons/inj.svg';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import { ReactComponent as NobleLightIcon } from 'assets/icons/noble_light.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as OsmoLightIcon } from 'assets/icons/osmosis_light.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron-icon.svg';
import { ReactComponent as TronNetworkIcon } from 'assets/icons/tron.svg';
import { WalletType } from '@oraichain/oraidex-common/build/constant';

import classNames from 'classnames';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './ModalChooseWallet.module.scss';
import { WalletByNetwork } from './WalletByNetwork';
import { isUnlockMetamask, keplrCheck } from 'helper';
import { useEffect, useState } from 'react';
export type Wallet = {
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

export type NetworkType = 'cosmos' | 'evm' | 'tron';
export type WalletProvider = {
  networkType: NetworkType;
  networks: ChainWallet[];
  wallets: Wallet[];
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

export const ModalChooseWallet: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const [theme] = useConfigReducer('theme');

  const [walletProviderWithStatus, setWalletProviderWithStatus] = useState<WalletProvider[]>(walletProvider);

  const renderListWalletByNetwork = () => {
    return walletProviderWithStatus.map((item, index) => {
      return <WalletByNetwork key={index} walletProvider={item} />;
    });
  };

  // @ts-ignore
  const isCheckOwallet = window.owallet?.isOwallet;
  const version = window?.keplr?.version;
  const isCheckKeplr = !!version && keplrCheck('keplr');
  const isMetamask = window?.ethereum?.isMetaMask;

  // update wallet provider with status is active or not
  useEffect(() => {
    async function updateWalletProvider() {
      const isMetamaskUnlock = await isUnlockMetamask();
      const updatedWalletProvider = walletProviderWithStatus.map((item) => {
        const updatedWallets = item.wallets.map((wallet) => {
          let isActive = true;
          switch (wallet.nameRegistry) {
            case 'keplr':
              isActive = isCheckKeplr;
              break;
            case 'owallet':
              isActive = isCheckOwallet;
              break;
            case 'leapSnap':
              isActive = isMetamask && isMetamaskUnlock;
              break;
          }
          return { ...wallet, isActive };
        });
        return {
          ...item,
          wallets: updatedWallets
        };
      });
      setWalletProviderWithStatus(updatedWalletProvider);
    }
    updateWalletProvider();
  }, [isCheckOwallet, isCheckKeplr, isMetamask]);

  return (
    <Modal
      isOpen={true}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={classNames(styles.chooseWalletModalContainer, `${styles[theme]}`)}
    >
      <div className={styles.chooseWalletModalWrapper}>
        <div className={styles.header}>
          <div>Connect to OraiDEX</div>
          <div onClick={close} className={styles.closeIcon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.listWalletNetworkWrapper}>{renderListWalletByNetwork()}</div>
      </div>
    </Modal>
  );
};
