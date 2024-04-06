import { ReactComponent as BridgeIcon } from 'assets/icons/ic_bridge.svg';
import { ReactComponent as CohavestIcon } from 'assets/icons/ic_cohavest.svg';
import { ReactComponent as BtcDashboardIcon } from 'assets/icons/ic_btc_dashboard.svg';
import { ReactComponent as PoolIcon } from 'assets/icons/ic_pools.svg';
import { ReactComponent as StakingIcon } from 'assets/icons/ic_staking.svg';
import { ReactComponent as UniversalSwapIcon } from 'assets/icons/ic_universalswap.svg';
import { ReactComponent as OraidexBetaIcon } from 'assets/icons/ic_beta.svg';
import { ReactComponent as LogoDownloadOwalletIcon } from 'assets/icons/logo_download.svg';
import { ReactComponent as DownloadOwalletIcon } from 'assets/icons/logo_owallet_gateway.svg';
import { ReactComponent as DownloadOwalletIconDark } from 'assets/icons/logo_owallet_gateway_dark.svg';
import classNames from 'classnames';
import ModalDownloadOwallet from 'components/Modals/ModalDownloadOwallet/ModalDownloadOwallet';
import useTheme from 'hooks/useTheme';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC<{}> = React.memo((props) => {
  const location = useLocation();
  const [link, setLink] = useState('');
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isOpenQrCodeOwallet, setIsOpenQrCodeOwallet] = useState(false);

  useEffect(() => {
    setLink(location.pathname);
  }, [location]);

  const renderLink = (to: string, title: string, onClick: any, icon: ReactElement, externalLink = false) => {
    if (externalLink)
      return (
        <a
          target="_blank"
          href={to}
          className={classNames(styles.menu_item, styles[theme])}
          onClick={() => {
            setOpen(!open);
            onClick(to);
          }}
          rel="noreferrer"
        >
          {icon}
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
          { [styles.active]: link.includes(to) || (link === '/' && to === '/universalswap') },
          styles[theme]
        )}
      >
        {icon}
        <span className={classNames(styles.menu_item_text, { [styles.active]: link === to }, styles[theme])}>
          {title}
        </span>
      </Link>
    );
  };

  return (
    <>
      <div className={classNames(styles.sidebar, { [styles.open]: open })}>
        <div>
          <div className={classNames(styles.menu_items)}>
            {renderLink('/universalswap', 'Swap', setLink, <UniversalSwapIcon />)}
            {renderLink('/bridge', 'Bridge', setLink, <BridgeIcon />)}
            {renderLink('/pools', 'Pools', setLink, <PoolIcon />)}
            {renderLink('/staking', 'Staking', setLink, <StakingIcon />)}
            {renderLink('/co-harvest', 'Co-Harvest', setLink, <CohavestIcon />)}
            {renderLink('/bitcoin-dashboard', 'BTC Dashboard', setLink, <BtcDashboardIcon />)}
            {renderLink('https://beta.oraidex.io', 'OraiDEX Beta', setLink, <OraidexBetaIcon />, true)}
          </div>
        </div>

        <div className={styles.menu_footer} onClick={() => setIsOpenQrCodeOwallet(true)}>
          {theme === 'light' ? <DownloadOwalletIcon /> : <DownloadOwalletIconDark />}
          <div className={styles.download}>
            <span>Download</span>
            <LogoDownloadOwalletIcon />
          </div>
        </div>
      </div>
      {isOpenQrCodeOwallet && <ModalDownloadOwallet close={() => setIsOpenQrCodeOwallet(false)} />}
    </>
  );
});

export default Sidebar;
