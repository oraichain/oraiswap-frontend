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
import classNames from 'classnames';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './ModalChooseWallet.module.scss';
import { WalletByNetwork } from './WalletByNetwork';
import { keplrCheck, owalletCheck } from 'helper';
export type Wallet = {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  name: string;
  nameRegistry?: string;
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

const version = window?.keplr?.version;
const isCheckKeplr = !!version && keplrCheck('keplr');
const isCheckOwallet = !!version && owalletCheck('owallet');
const isMetamask = !!window?.ethereum?.isMetaMask;

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
        nameRegistry: 'owallet-extension',
        isActive: isCheckOwallet
      },
      {
        icon: KeplrIcon,
        name: 'Keplr',
        nameRegistry: 'keplr-extension',
        isActive: isCheckKeplr
      },
      {
        icon: MetamaskIcon,
        name: 'Metamask (Leap Snap)',
        nameRegistry: 'leap-metamask-cosmos-snap',
        isActive: isMetamask
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

  const renderListWalletByNetwork = () => {
    return walletProvider.map((item, index) => {
      return <WalletByNetwork key={index} walletProvider={item} />;
    });
  };

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
