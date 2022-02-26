import React from 'react';
import Container from '../components/Container';
import styles from './Footer.module.scss';
import { ReactComponent as Logo } from '../images/DelightLogo.svg';
import { network } from 'constants/networks';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <section className={styles.network}>{network.chainId}</section>

        <section className={styles.community}>
          <a href="https://delightlabs.io">
            <span>© 2022 Powered by Oraichain</span>
            {/* <Logo height={24} /> */}
          </a>
        </section>
      </Container>
    </footer>
  );
};

export default Footer;
