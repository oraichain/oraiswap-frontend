import { useWeb3React } from '@web3-react/core';
import { FC, useEffect, useState, Fragment } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import useLocalStorage from 'libs/useLocalStorage';
import CenterEllipsis from './CenterEllipsis';
import classNames from 'classnames';
import styles from './ConnectWallet.module.scss';
import Button from 'components/Button';
import Icon from './Icon';
import MetamaskImage from 'images/icon--metamash.svg';
import OraichainImage from 'images/icon--oraichain.svg';
import WalletImage from 'images/icon--wallet.svg';
import Web3 from 'web3';
import Modal from './Modal';
import Card from './Card';
import LoginWallet from './LoginWallet';
import MESSAGE from "lang/MESSAGE.json";
export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 15]
});

const ConnectWallet: FC<{ text: string }> = ({ text }) => {
    const { account, active, error, activate, deactivate } = useWeb3React();
    const [isModal, setIsModal] = useState(false);
    const [address, setAddress] = useLocalStorage<string | undefined | null>(
        'metamask-address',
        account
    );

    async function modal() {
        setIsModal(!isModal);
    }

    async function disconnect() {
        try {
            deactivate();
            setAddress('');
        } catch (ex) {
            console.log(ex);
        }
    }

    async function connect() {
        try {
            await activate(injected);
            setAddress(await injected.getAccount());
            setIsModal(!isModal);
        } catch (ex) {
            console.log(ex);
        }
    }

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
            try {
                if (!active && address && !error) {
                    await activate(injected);
                    // reset provider
                    window.web3 = new Web3(await injected.getProvider());
                }
            } catch (err) {
                console.log(err);
            }
        };
        connectWalletOnPageLoad();
    }, []);

    return (
        <div className={classNames(styles.container)}>
            {address ? (
                <Button onClick={disconnect} className={classNames(styles.connected)}>
                    <Icon size={16} name="account_balance_wallet" />
                    <p className={classNames(styles.address)}>
                        <CenterEllipsis size={6} text={address} />
                    </p>
                    <Icon size={20} name="close" />
                </Button>
            ) : (
                <Fragment>
                    <Button className={classNames(styles.connect)} onClick={() => modal()}>
                        {text}
                    </Button>
                    {isModal && <Modal
                        className={styles['side__view--hide-on-desktop']}
                        isOpen={true}
                        isCloseBtn={true}
                        open={() => { }}
                        close={() => modal()}
                    >
                        <Card shadow={true}>
                            <LoginWallet src={OraichainImage} label={MESSAGE.Wallet.OraichainWallet} text={MESSAGE.Wallet.ConnectWeb} />
                            <LoginWallet src={MetamaskImage} label={MESSAGE.Wallet.Metamask} onClick={connect} text={MESSAGE.Wallet.ConnectBrowser} />
                            <LoginWallet src={WalletImage} label={MESSAGE.Wallet.WalletConnect} text={MESSAGE.Wallet.ConnectMobile} />
                        </Card>
                    </Modal>
                    }
                </Fragment>
            )}
        </div>
    );
};

export default ConnectWallet;
