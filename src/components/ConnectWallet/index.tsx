import { FC, useState } from 'react';
import cn from 'classnames/bind';

import { Button } from 'components/Button';
import TooltipContainer from 'components/ConnectWallet/TooltipContainer';
import useConfigReducer from 'hooks/useConfigReducer';

import styles from './index.module.scss';
import MyWallets from './MyWallet';
import QRGeneratorModal, { QRGeneratorInfo } from './QRGenerator';
import Connected from './Connected';
import ChooseWalletModal from './ChooseWallet';

const cx = cn.bind(styles);

interface ModalProps {}

const ConnectWallet: FC<ModalProps> = ({}) => {
  const [theme] = useConfigReducer('theme');
  const [isShowConnectWallet, setIsShowConnectWallet] = useState(false);
  const [isShowMyWallet, setIsShowMyWallet] = useState(false);
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  const [QRUrlInfo, setQRUrlInfo] = useState<QRGeneratorInfo>({ url: '', icon: null, name: '', address: '' });

  return (
    <div className={cx('connect-wallet-container', theme)}>
      {isShowConnectWallet ? (
        <Button type="primary" onClick={() => setIsShowChooseWallet(true)}>
          Connect Wallet
        </Button>
      ) : (
        <TooltipContainer
          placement="bottom-end"
          visible={isShowMyWallet}
          setVisible={setIsShowMyWallet}
          content={
            <MyWallets
              handleAddWallet={() => {
                setIsShowChooseWallet(true);
                setIsShowMyWallet(false);
              }}
              setQRUrlInfo={setQRUrlInfo}
              setIsShowMyWallet={setIsShowMyWallet}
            />
          }
        >
          <Connected setIsShowMyWallet={() => setIsShowMyWallet(true)} />
        </TooltipContainer>
      )}

      {isShowChooseWallet ? <ChooseWalletModal close={() => setIsShowChooseWallet(false)} /> : null}

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
