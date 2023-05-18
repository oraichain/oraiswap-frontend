import { ReactComponent as BuyFiat } from 'assets/icons/buyfiat.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as Dark } from 'assets/icons/dark.svg';
import { ReactComponent as Light } from 'assets/icons/light.svg';
import { ReactComponent as Faucet } from 'assets/icons/faucet.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import { ReactComponent as InfoIcon } from 'assets/icons/oraidex_info.svg';
import { ReactComponent as Pools } from 'assets/icons/pool.svg';
import { ReactComponent as Swap } from 'assets/icons/swap.svg';
import { ReactComponent as Wallet } from 'assets/icons/wallet.svg';
import { ReactComponent as OrderBook } from 'assets/icons/orderbook.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import { ThemeContext } from 'context/theme-context';

import { isMobile } from '@walletconnect/browser-utils';
import RequireAuthButton from 'components/connect-wallet/RequireAuthButton';
import React, { memo, ReactElement, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.scss';
import classNames from 'classnames';

const Menu: React.FC<{}> = React.memo((props) => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setLink(location.pathname);
  }, []);

  const renderLink = (to: string, title: string, onClick: any, icon: ReactElement, externalLink = false) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item + (link === to ? ` ${styles.active}` : '') + ` ${styles[theme]}`)}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          {icon}
          <span className={classNames(styles.menu_item_text + ` ${styles[theme]}`, styles.menu_item_text)}>
            {title}
          </span>
        </a>
      );
    return (
      <Link
        to={to}
        onClick={() => {
          setOpen(!open);
          onClick(to);
        }}
        className={classNames(styles.menu_item + (link === to ? ` ${styles.active}` : '') + ` ${styles[theme]}`)}
      >
        {icon}
        <span
          className={classNames(
            styles.menu_item_text + (link === to ? ` ${styles.active}` : '') + ` ${styles[theme]}`,
            styles.menu_item_text
          )}
        >
          {title}
        </span>
      </Link>
    );
  };

  const mobileMode = isMobile();
  const ToggleIcon = open ? CloseIcon : MenuIcon;
  const darkTheme = theme === 'dark';
  return (
    <>
      {mobileMode && (
        <div className={styles.logo}>
          <Link to={'/'} onClick={() => setLink('/')}>
            <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
          </Link>
          <ToggleIcon onClick={handleToggle} />
        </div>
      )}
      <div className={classNames(styles.menu, { [styles.open]: open })}>
        <div>
          {!mobileMode && (
            <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
              <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
            </Link>
          )}
          <div className={classNames(styles.menu_items)}>
            <RequireAuthButton />
            {renderLink('/bridge', 'Bridge', setLink, <Wallet />)}
            {renderLink('/swap', 'Swap', setLink, <Swap />)}
            {renderLink('/universalswap', 'Universal Swap', setLink, <Swap />)}
            {renderLink('/pools', 'Pools', setLink, <Pools />)}
            {renderLink('https://orderbook.oraidex.io/', 'Order Book', () => {}, <OrderBook />, true)}
            {renderLink('https://info.oraidex.io/', 'Info', () => {}, <InfoIcon />, true)}
            {renderLink('https://payment.orai.io/', 'Buy ORAI (Fiat)', () => {}, <BuyFiat />, true)}
            {renderLink('https://faucet.mainnet.orai.io/', 'Faucet', () => {}, <Faucet />, true)}
          </div>
        </div>

        <div className={styles.menu_footer}>
          {theme === 'dark' ? (
            <button
              className={classNames(styles.menu_theme, {
                [styles.active]: theme === 'dark'
              })}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Light style={{ width: 14, height: 14 }} />
            </button>
          ) : (
            <button
              className={classNames(
                styles.menu_theme,
                {
                  [styles.active]: theme === 'light'
                },
                styles[theme]
              )}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Dark style={{ width: 14, height: 14 }} />
            </button>
          )}
          <span>{/* © 2020 - 2023 Oraichain Foundation */}© 2022 Powered by Oraichain</span>
        </div>
      </div>
    </>
  );
});

export default memo(Menu);
