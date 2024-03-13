import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import classNames from 'classnames';
// import ConnectWallet from 'components/ConnectWallet';
import TooltipContainer from 'components/ConnectWallet/TooltipContainer';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { ThemeContext } from 'context/theme-context';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.scss';
import BuyOraiModal from './BuyOraiModal';
import { WalletManagement } from 'components/WalletManagement/WalletManagement';

const Menu: React.FC = () => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const [otherActive, setOtherActive] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    setLink(location.pathname);
  }, [location.pathname]);

  const renderLink = (to: string, title: string, onClick: any, externalLink = false) => {
    if (to === 'coming-soon') {
      return (
        <span
          className={classNames(styles.menu_item, { [styles.active]: link === to }, styles[theme], styles.spin)}
          onClick={() => {
            displayToast(TToastType.TX_INFO, {
              message: `Coming soon!`
            });
          }}
        >
          <span className={classNames(styles[theme], styles.menu_item_text)}>{title}</span>
        </span>
      );
    }

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
        className={classNames(
          styles.menu_item,
          { [styles.active]: !otherActive && (link.includes(to) || (link === '/' && to === '/universalswap')) },
          styles[theme],
          styles.spin
        )}
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
      {renderLink('/universalswap', 'SWAP', setLink)}
      {renderLink('/bridge', 'BRIDGE', setLink)}
      {renderLink('/pools', 'POOLS', setLink)}
      {renderLink('/staking', 'STAKING', setLink)}
      {renderLink('/co-harvest', 'CO-HARVEST', setLink)}
      {renderLink('https://orderbook.oraidex.io', 'ORDER BOOK', () => {}, true)}
      {renderLink('https://futures.oraidex.io', 'FUTURES', () => {}, true)}
      {/* {renderLink('https://beta.oraidex.io', 'BETA', () => {}, true)} */}
      {mobileMode ? (
        <>
          {renderLink('#', 'BUY ORAI', () => {
            setOpenBuy(true);
          })}
          {renderLink('https://legacy-v2.oraidex.io/', 'OraiDEX Legacy', () => {}, true)}
        </>
      ) : (
        <>
          <div
            onClick={() => {
              setOtherActive(!otherActive);
            }}
            className={classNames(styles.menu_item, { [styles.active]: otherActive }, styles[theme], styles.spin)}
          >
            <span className={classNames(styles.menu_item_text, { [styles.active]: otherActive }, styles[theme])}>
              {'OTHERS'}
              <DownArrowIcon />
            </span>
          </div>

          <TooltipContainer
            placement="bottom-end"
            visible={otherActive}
            setVisible={() => setOtherActive(!otherActive)}
            content={
              <div className={classNames(styles.menu_others_list, styles[theme])}>
                {renderLink('#', 'BUY ORAI', () => {
                  setOpenBuy(true);
                  setOtherActive(!otherActive);
                })}
                {renderLink('https://legacy-v2.oraidex.io/', 'OraiDEX Legacy', () => {}, true)}
                {renderLink('/bitcoin-dashboard?tab=pending_deposits', 'Bitcoin Dashboard', () => {}, false)}
              </div>
            }
          />
        </>
      )}

      {openBuy && (
        <BuyOraiModal
          open={openBuy}
          close={() => {
            setOpenBuy(false);
            setIsLoadedIframe(false);
          }}
          onAfterLoad={() => setIsLoadedIframe(true)}
          isLoadedIframe={isLoadedIframe}
        />
      )}
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
            <WalletManagement />
          </div>

          <div ref={ref} className={classNames(styles.sideMenu, { [styles.open]: open })}>
            {menuList}
          </div>
        </>
      ) : (
        <div className={classNames(styles.menu)}>
          <div className={styles.menuLeft}>
            <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
              <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
            </Link>
            <div className={styles.divider}></div>
            {menuList}
          </div>
          <div className={classNames(styles.connect_wallet_wrapper)}>
            <span>
              <WalletManagement />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
