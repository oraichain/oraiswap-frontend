import Content from 'layouts/Content';
import { FunctionComponent } from 'react';
import styles from './index.module.scss';

const Maintenance: FunctionComponent = () => {
  return (
    <Content otherBackground>
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          margin: 'auto 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          fontSize: 30
        }}
      >
        <div className={styles.maintenance}>
          <div className={styles.maintenance_content}>
            OraiBridge is upgrading to new version. Please use the Bridge later when it finalizes necessary processes.
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '5%', fontSize: 18 }}>
          OWallet app (
          <a style={{ color: 'green' }} href="https://apps.apple.com/app/owallet/id1626035069">
            iOS
          </a>
          /
          <a style={{ color: 'green' }} href="https://play.google.com/store/apps/details?id=com.io.owallet">
            Android
          </a>
          )
        </div>
      </div>
    </Content>
  );
};

export default Maintenance;
