import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as InjIcon } from 'assets/icons/inj.svg';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import { ReactComponent as NobleIcon } from 'assets/icons/noble.svg';
import { ReactComponent as NobleLightIcon } from 'assets/icons/noble_light.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as OsmoLightIcon } from 'assets/icons/osmosis_light.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron-icon.svg';
import { ReactComponent as TronNetworkIcon } from 'assets/icons/tron.svg';
import classNames from 'classnames';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './ChooseWallet.module.scss';
import { WalletByNetwork } from './WalletByNetwork';
export type Wallet = {
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  name: string;
};
export type WalletProvider = {
  type?: string;
  networks: Wallet[];
  wallets: Wallet[];
};
const walletProvider: WalletProvider[] = [
  {
    type: 'cosmos',
    networks: [
      {
        icon: OraiLightIcon,
        name: ''
      },
      {
        icon: AtomIcon,
        name: ''
      },
      {
        icon: OsmoLightIcon,
        name: ''
      },
      {
        icon: InjIcon,
        name: ''
      },
      {
        icon: NobleLightIcon,
        name: ''
      },
      {
        icon: KwtIcon,
        name: ''
      }
    ],
    wallets: [
      {
        icon: OwalletIcon,
        name: 'Owallet'
      },
      {
        icon: KeplrIcon,
        name: 'Keplr'
      },
      {
        icon: MetamaskIcon,
        name: 'Metamask (Leap Snap)'
      }
    ]
  },
  {
    networks: [
      {
        icon: EthIcon,
        name: ''
      },
      {
        icon: BnbIcon,
        name: ''
      },
      {
        icon: KwtIcon,
        name: ''
      }
    ],
    wallets: [
      {
        icon: OwalletIcon,
        name: 'Owallet'
      },
      {
        icon: MetamaskIcon,
        name: 'Metamask'
      }
    ]
  },
  {
    networks: [
      {
        icon: TronNetworkIcon,
        name: ''
      }
    ],
    wallets: [
      {
        icon: OwalletIcon,
        name: 'Owallet'
      },
      {
        icon: TronIcon,
        name: 'TronLink'
      }
    ]
  }
];

export const ChooseWalletModal: React.FC<{
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
      className={classNames(styles.choose_wallet_modal_container, styles[theme])}
    >
      <div className={styles.choose_wallet_modal_wrapper}>
        <div className={styles.header}>
          <div>Connect to OraiDEX</div>
          <div onClick={close} className={styles.close_icon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.listWalletNetworkWrapper}>{renderListWalletByNetwork()}</div>
      </div>
    </Modal>
  );
};
