import React from "react";
import logo from "../images/logo.png";
import Container from "../components/Container";
import styles from "./Header.module.scss";
import MESSAGE from "lang/MESSAGE.json";
import DarkImage from 'images/dark.svg';
import LightImage from 'images/light.svg';
import ConnectWallet from "components/ConnectWallet";
import { useTheme, Theme } from './ThemeContext';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const src = theme !== Theme.Dark ? DarkImage : LightImage;
  const handleTheme = async () => {
    setTheme(theme !== Theme.Dark ? Theme.Dark : Theme.Light)
  };
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <section className={styles.wrapper}>
          <a className={styles.logo} href="https://swap.orai.io">
            <img src={logo} alt="oraiswap" />
          </a>
          <span>{MESSAGE.Header.OraiBridge}</span>
          <div className={styles.link}>
            <a className={styles.nft} href="/">
              <span>{MESSAGE.Header.NftBridge}</span>
            </a>
            <a className={styles.sup} href="/">
              <span>{MESSAGE.Header.Support}</span>
            </a>
          </div>
        </section>
        <section className={styles.support}>
          <div className={styles.connect}>
            <ConnectWallet text={MESSAGE.Form.Button.ConnectWallet} />
            <img className={styles.mode} onClick={handleTheme} height={44} src={src} alt="" />
          </div>
        </section>
      </Container>
    </header>
  );
};

export default Header;
