import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import useConfigReducer from 'hooks/useConfigReducer';
import { useGetPositions } from 'pages/Pool-V3/hooks/useGetPosition';
import { useRef, useState } from 'react';
import SlippageSetting from '../SettingSlippage';
import ZapOutForm from '../ZapOutForm';
import styles from './index.module.scss';

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

const ZapOut = ({ position, incentives }: { position: any; incentives: { [key: string]: number } }) => {
  const [walletAddress] = useConfigReducer('address');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const refContent = useRef();
  const { refetchPositions } = useGetPositions(walletAddress);

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.createNewPool}>
      <div className={styles.btnAdd}>
        <Button type="third-sm" onClick={() => setShowModal(true)}>
          Remove Position
        </Button>
      </div>

      <div
        onClick={() => setShowModal(false)}
        className={classNames(styles.overlay, { [styles.activeOverlay]: showModal })}
      ></div>
      <div className={classNames(styles.modalWrapper, { [styles.activeModal]: showModal })}>
        <div className={styles.contentWrapper} ref={refContent}>
          <div className={styles.header}>
            <div>Remove Position</div>
            <div className={styles.headerActions}>
              <div className={styles.setting}>
                <SettingIcon onClick={() => setIsOpen(true)} />
                <SlippageSetting isOpen={isOpen} setIsOpen={setIsOpen} setSlippage={setSlippage} slippage={slippage} />
              </div>
              <div onClick={() => onCloseModal()}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <ZapOutForm
            showModal={showModal}
            onCloseModal={async () => {
              setShowModal(false);
              await refetchPositions();
            }}
            slippage={1}
            tokenFrom={position.tokenX}
            tokenTo={position.tokenY}
            position={position}
            incentives={incentives}
          />
        </div>
      </div>
    </div>
  );
};

export default ZapOut;
