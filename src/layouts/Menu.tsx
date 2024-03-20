import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow.svg';
import { ReactComponent as BridgeIcon } from 'assets/icons/ic_bridge.svg';
import { ReactComponent as CohavestIcon } from 'assets/icons/ic_cohavest.svg';
import { ReactComponent as ExternalLinkIcon } from 'assets/icons/ic_external_link.svg';
import { ReactComponent as FuturesIcon } from 'assets/icons/ic_futures.svg';
import { ReactComponent as HelpIcon } from 'assets/icons/ic_help.svg';
import { ReactComponent as KadoIcon } from 'assets/icons/ic_kado.svg';
import { ReactComponent as OrderbookIcon } from 'assets/icons/ic_orderbook.svg';
import { ReactComponent as PoolIcon } from 'assets/icons/ic_pools.svg';
import { ReactComponent as StakingIcon } from 'assets/icons/ic_staking.svg';
import { ReactComponent as SupportIcon } from 'assets/icons/ic_support.svg';
import { ReactComponent as TelegramIcon } from 'assets/icons/ic_telegram.svg';
import { ReactComponent as TwitterIcon } from 'assets/icons/ic_twitter.svg';
import { ReactComponent as UniversalSwapIcon } from 'assets/icons/ic_universalswap.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import classNames from 'classnames';
import TooltipContainer from 'components/ConnectWallet/TooltipContainer';
import { WalletManagement } from 'components/WalletManagement/WalletManagement';
import { ThemeContext } from 'context/theme-context';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BuyOraiModal from './BuyOraiModal';
import styles from './Menu.module.scss';

const Menu: React.FC = () => {
  const location = useLocation();
  const [link, setLink] = useState('/');
  const [otherActive, setOtherActive] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [isLoadedIframe, setIsLoadedIframe] = useState(false); // check iframe data loaded
  const [isOpenSubMenuMobile, setIsOpenSubMenuMobile] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    setLink(location.pathname);
  }, [location.pathname]);

  const renderLink = (
    to: string,
    title: string,
    onClick: any,
    externalLink = false,
    Icon?: ReactNode,
    isExternalIcon = true
  ) => {
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
          {Icon}
          <span className={classNames(styles[theme], styles.menu_item_text)}>{title}</span>
          {isExternalIcon && (
            <div className={styles.hoverIcon}>
              <ExternalLinkIcon />
            </div>
          )}
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
        {Icon}
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
      <div className={classNames(styles.menu_list_left)}>
        {renderLink('https://orderbook.oraidex.io', 'Order Book', () => {}, true, <OrderbookIcon />)}
        {renderLink('https://futures.oraidex.io', 'Futures Trading', () => {}, true, <FuturesIcon />)}
      </div>
    </div>
  );

  const menuListMobile = (
    <div className={classNames(styles.menu_list)}>
      {renderLink('/universalswap', 'Swap', setLink, false, <UniversalSwapIcon />)}
      {renderLink('/bridge', 'Bridge', setLink, false, <BridgeIcon />)}
      {renderLink('/pools', 'Pools', setLink, false, <PoolIcon />)}
      {renderLink('/staking', 'Staking', setLink, false, <StakingIcon />)}
      {renderLink('/co-harvest', 'Co-Harvest', setLink, false, <CohavestIcon />)}
      <div className={styles.divider}></div>
      {renderLink('https://orderbook.oraidex.io', 'Order Book', () => {}, true, <OrderbookIcon />)}
      {renderLink('https://futures.oraidex.io', 'Futures Trading', () => {}, true, <FuturesIcon />)}
      <div className={styles.divider}></div>
      <div
        onClick={() => {
          setIsOpenSubMenuMobile(!isOpenSubMenuMobile);
        }}
        className={classNames(styles.menu_item, styles.menu_item_help, styles[theme])}
      >
        <div className={styles.menu_item_help_left}>
          <HelpIcon />
          <span className={classNames(styles.menu_item_text, styles[theme])}>{'Help'}</span>
        </div>
        <DownArrowIcon />
      </div>
      <div
        className={classNames(styles.mobile_sub_menu, isOpenSubMenuMobile ? styles.openSubMenu : null, styles[theme])}
      >
        {renderLink('https://t.me/oraidex', 'Join our Community', () => {}, true, <TelegramIcon />, false)}
        {renderLink('https://twitter.com/oraidex', 'Twitter', () => {}, true, <TwitterIcon />, false)}
        {renderLink('https://t.me/SamORAI_bot', 'Contact us', () => {}, true, <SupportIcon />, false)}
      </div>
      {renderLink(
        '#',
        'Buy ORAI',
        () => {
          setOpenBuy(true);
        },
        false,
        <KadoIcon />
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
            {menuListMobile}
          </div>
        </>
      ) : (
        <div className={classNames(styles.menu)}>
          <div className={styles.menuLeft}>
            <div className={styles.logoWrapper}>
              <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
                <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
              </Link>
              <div className={styles.divider}></div>
            </div>
            {menuList}
          </div>
          <div className={classNames(styles.menuRight)}>
            <div className={classNames(styles.menu_list_right)}>
              <div
                onClick={() => {
                  setOtherActive(!otherActive);
                }}
                className={classNames(styles.menu_item, { [styles.active]: otherActive }, styles[theme], styles.spin)}
              >
                <HelpIcon />
                <span className={classNames(styles.menu_item_text, { [styles.active]: otherActive }, styles[theme])}>
                  {'Help'}
                </span>
                <DownArrowIcon />
              </div>

              <TooltipContainer
                placement="auto-end"
                visible={otherActive}
                setVisible={() => setOtherActive(!otherActive)}
                content={
                  <div className={classNames(styles.menu_others_list, styles[theme])}>
                    {renderLink('https://t.me/oraidex', 'Join our Community', () => {}, true, <TelegramIcon />, false)}
                    {renderLink('https://twitter.com/oraidex', 'Twitter', () => {}, true, <TwitterIcon />, false)}
                    {renderLink('https://t.me/SamORAI_bot', 'Contact us', () => {}, true, <SupportIcon />, false)}
                  </div>
                }
              />
              {renderLink(
                '#',
                'Buy ORAI',
                () => {
                  setOpenBuy(true);
                },
                false,
                <KadoIcon />
              )}
            </div>

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
            <div className={styles.divider}></div>
            <div className={classNames(styles.connect_wallet_wrapper)}>
              <span>
                <WalletManagement />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
