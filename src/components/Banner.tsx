import React, { FC } from 'react';
import MainnetImg from 'assets/images/mainnet.png';
import ReactModal from 'react-modal';
import styles from './Banner.module.scss';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';

const Banner: FC<{}> = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <ReactModal
      className={`${styles.modalBanner}`}
      overlayClassName={`${styles.overlayBanner}`}
      isOpen={open}
      onRequestClose={() => setOpen(false)}
    >
      <div className={styles.closeBanner}>
        <span onClick={() => setOpen(false)}>
          <CloseIcon color={'#ffffff'} width={20} height={20} />
        </span>
      </div>
      <img
        width={'100%'}
        style={{
          borderRadius: 16,
          border: '0.5px solid gray',
        }}
        height={'100%'}
        src={MainnetImg}
      ></img>
      <div className={styles.contentBanner}>
        <span
          onClick={() =>
            window.open(
              'https://blog.orai.io/road-to-1-000-000-delegated-orai-on-oraichain-mainnet-2-0-8da7600a9055',
              'blogOrai',
              'noopener'
            )
          }
        >
          500 ORAI TO BE SHARED!
        </span>
      </div>
    </ReactModal>
  );
};

export default Banner;
