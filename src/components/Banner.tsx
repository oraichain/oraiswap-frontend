import React, { FC } from 'react';
import MainnetImg from 'assets/images/mainnet.png';
import Under from 'assets/images/undermaintenance.jpeg';
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
      // onRequestClose={() => setOpen(false)}
    >
      {/* <div className={styles.closeBanner}>
        <span onClick={() => setOpen(false)}>
          <CloseIcon color={'#ffffff'} width={20} height={20} />
        </span>
      </div> */}
      <img
        className={`${styles.imagesBanner}`}
        src={Under}
      ></img>
      <div>
        <span>To prepare for v0.41.0 Upgrade, services on Oraichain network will be temporarily suspended until our next official announcement.</span>
        <p>Time (estimated): From 2022-11-20 23:59 to 2022-11-20 09:00 (UTC)</p>
      </div>
    </ReactModal>
  );
};

export default Banner;
