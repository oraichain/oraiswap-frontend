import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as Dark } from 'assets/icons/dark.svg';
import { ReactComponent as Light } from 'assets/icons/light.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import classNames from 'classnames';
import { ThemeContext } from 'context/theme-context';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MenuV3.module.scss';
import ConnectWallet from 'components/ConnectWallet';
import useOnClickOutside from 'hooks/useOnClickOutside';

const Menu: React.FC = React.memo(() => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setLink(location.pathname);
  }, []);

  const renderLink = (to: string, title: string, onClick: any, externalLink = false) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item, { [styles.active]: link === to }, styles[theme], styles.spin)}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          <span className={classNames(styles[theme], styles.menu_item_text)}>{title}</span>
        </a>
      );
    return (
      <Link
        to={to}
        onClick={() => {
          setOpen(!open);
          onClick(to);
        }}
        className={classNames(styles.menu_item, { [styles.active]: link === to }, styles[theme], styles.spin)}
      >
        <span className={classNames(styles.menu_item_text, { [styles.active]: link === to }, styles[theme])}>
          {title}
        </span>
      </Link>
    );
  };

  const mobileMode = isMobile();
  const ToggleIcon = open ? CloseIcon : MenuIcon;
  const darkTheme = theme === 'dark';

  const menuList = (
    <div className={classNames(styles.menu_list)}>
      {renderLink('/bridge', 'Bridge', setLink)}
      {renderLink('/universalswap', 'Swap', setLink)}
      {renderLink('/pools', 'Pools', setLink)}
      {renderLink('https://orderbook.oraidex.io/spot', 'Order Book', () => {}, true)}
      {renderLink('https://orderbook.oraidex.io/future', 'Future', () => {}, true)}
      {renderLink('https://payment.orai.io/', 'Buy ORAI', () => {}, true)}
    </div>
  );
  return (
    <>
      {mobileMode ? (
        <>
          <div className={styles.menuMobile}>
            <div className={styles.logo}>
              <ToggleIcon onClick={handleToggle} />
              <Link to={'/'} onClick={() => setLink('/')}>
                <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
              </Link>
            </div>
            <ConnectWallet />
          </div>

          <div ref={ref} className={classNames(styles.sideMenu, { [styles.open]: open })}>
            {menuList}
            <div className={classNames(styles.connect_wallet_wrapper)}>
              <button
                className={classNames(styles.menu_theme, styles.active, styles[theme])}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Light /> : <Dark />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={classNames(styles.menu)}>
          <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
            <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
          </Link>
          {menuList}
          <div className={classNames(styles.connect_wallet_wrapper)}>
            <button
              className={classNames(styles.menu_theme, styles.active, styles[theme])}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Light /> : <Dark />}
            </button>

            <span>
              <ConnectWallet />
            </span>
          </div>
        </div>
      )}
    </>
  );
});

export default memo(Menu);
