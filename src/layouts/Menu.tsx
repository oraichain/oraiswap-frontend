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
import LogoFullImg from 'assets/images/OraiDEX_full_light.svg';
import { ThemeContext } from 'context/theme-context';

import { isMobile } from '@walletconnect/browser-utils';
import RequireAuthButton from 'components/connect-wallet/RequireAuthButton';
import React, { memo, ReactElement, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.scss';

import classNames from 'classnames';
import useConfigReducer from 'hooks/useConfigReducer';

const Menu: React.FC<{}> = React.memo((props) => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const { theme, setTheme } = useContext(ThemeContext);
  const [address, setAddress] = useConfigReducer('address');
  const [infoCosmos] = useConfigReducer('infoCosmos');
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
          className={styles.menu_item + (link === to ? ` ${styles.active}` : '')}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          {icon}
          <span className={styles.menu_item_text}>{title}</span>
        </a>
      );
    return (
      <Link
        to={to}
        onClick={() => {
          setOpen(!open);
          onClick(to);
        }}
        className={styles.menu_item + (link === to ? ` ${styles.active}` : '')}
      >
        {icon}
        <span className={styles.menu_item_text}>{title}</span>
      </Link>
    );
  };

  const mobileMode = isMobile();
  const ToggleIcon = open ? CloseIcon : MenuIcon;

  return (
    <>
      {mobileMode && (
        <div className={styles.logo}>
          <Link to={'/'} onClick={() => setLink('/')}>
            <img src={LogoFullImg} alt='logo' />
          </Link>
          <ToggleIcon onClick={handleToggle} />
        </div>
      )}
      <div className={classNames(styles.menu, { [styles.open]: open })}>
        <div>
          {!mobileMode && (
            <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
              <img src={LogoFullImg} alt='logo' />
            </Link>
          )}
          <div className={styles.menu_items}>
            <RequireAuthButton address={address} setAddress={setAddress} />
            {renderLink('/bridge', 'Bridge', setLink, <Wallet />)}
            {renderLink('/swap', 'Swap', setLink, <Swap />)}
            {renderLink('/pools', 'Pools', setLink, <Pools />)}
            {renderLink(
              'https://info.oraidex.io/',
              'Info',
              () => { },
              <InfoIcon />,
              true
            )}
            {renderLink(
              'https://payment.orai.io/',
              'Buy ORAI (Fiat)',
              () => { },
              <BuyFiat />,
              true
            )}
            {renderLink(
              'https://faucet.mainnet.orai.io/',
              'Faucet',
              () => { },
              <Faucet />,
              true
            )}
          </div>
        </div>

        <div className={styles.menu_footer}>
          {theme === 'dark'
            ? <button
              className={classNames(styles.menu_theme, {
                [styles.active]: theme === 'dark'
              })}
              onClick={() => {
                setTheme("light");
              }}
            >
              <Dark style={{ width: 14, height: 14 }} />
            </button>
            : <button
              className={classNames(styles.menu_theme, {
                [styles.active]: theme === 'light'
              })}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Light style={{ width: 14, height: 14 }} />
            </button>
          }
          <span>
            {/* © 2020 - 2023 Oraichain Foundation */}
            © 2022 Powered by Oraichain
          </span>
        </div>
      </div>
    </>
  );
});

export default memo(Menu);
