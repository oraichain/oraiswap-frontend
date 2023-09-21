import { FC, useState } from 'react';
import cn from 'classnames/bind';

import { Button } from 'components/Button';
import TooltipContainer from 'components/ConnectWallet/TooltipContainer';
import useConfigReducer from 'hooks/useConfigReducer';

import styles from './index.module.scss';
import MyWallets from './MyWallet';
import QRGeneratorModal, { QRGeneratorInfo } from './QRGenerator';

const cx = cn.bind(styles);

interface ModalProps {
}

const ConnectWallet: FC<ModalProps> = ({ }) => {
    const [theme] = useConfigReducer('theme');
    const [isShowConnectWallet, setIsShowConnectWallet] = useState(false);
    const [QRUrlInfo, setQRUrlInfo] = useState<QRGeneratorInfo>({ url: '', icon: null, name: '', address: '' });

    return (
        <div className={cx('connect-wallet-container', theme)}>
            <TooltipContainer
                placement="bottom-end"
                visible={isShowConnectWallet}
                setVisible={setIsShowConnectWallet}
                content={
                    <MyWallets
                        setQRUrlInfo={setQRUrlInfo}
                        setIsShowConnectWallet={setIsShowConnectWallet}
                    />
                }
            >
                <Button
                    type='primary'
                    onClick={() => setIsShowConnectWallet(true)}
                >
                    Connect Wallet
                </Button>
            </TooltipContainer>

            {QRUrlInfo.url ? (
                <QRGeneratorModal
                    url={QRUrlInfo.url}
                    name={QRUrlInfo.name}
                    icon={QRUrlInfo.icon}
                    address={QRUrlInfo.address}
                    close={() => setQRUrlInfo({ ...QRUrlInfo, url: '' })}
                />
            ) : null}
        </div>
    );
};

export default ConnectWallet;
