import React, { FC } from 'react';
import Under from 'assets/images/undermaintenance.jpeg';
import ReactModal from 'react-modal';
import styles from './Banner.module.scss';

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
      <img className={`${styles.imagesBanner}`} src={Under}></img>
      <div>
        <span>
          v0.41.0 Upgrade is being processed. Thank you for your patience.
        </span>
      </div>
    </ReactModal>
  );
};

export default Banner;
