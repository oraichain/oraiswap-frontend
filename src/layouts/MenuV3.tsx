import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as MenuIcon } from 'assets/icons/menu.svg';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import { ThemeContext } from 'context/theme-context';
import { ReactComponent as Dark } from 'assets/icons/dark.svg';
import { ReactComponent as Light } from 'assets/icons/light.svg';
import { isMobile } from '@walletconnect/browser-utils';
import classNames from 'classnames';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MenuV3.module.scss';
import { Button } from 'components/Button';

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

                {!mobileMode && (
                    <Link to={'/'} onClick={() => setLink('/')} className={styles.logo}>
                        <img src={darkTheme ? LogoFullImgLight : LogoFullImgDark} alt="logo" />
                    </Link>
                )}
                <div className={classNames(styles.menu_list)}>
                    {/* <RequireAuthButton /> */}
                    {renderLink(
                        '/universalswap',
                        'Swap',
                        setLink,
                    )}
                    {renderLink('/pools', 'Pools', setLink)}
                    {renderLink('https://orderbook.oraidex.io/spot', 'Order Book', () => { }, true)}
                    {renderLink('https://orderbook.oraidex.io/future', 'Future', () => { }, true)}
                    {renderLink('https://payment.orai.io/', 'Buy ORAI', () => { }, true)}
                </div>
                <div className={classNames(styles.wallet)}>
                    <Button type='primary' onClick={() => console.log('ok')}>Connect Wallet</Button>
                    {theme === 'dark' ? (
                        <button
                            style={{ paddingLeft: 20 }}
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
                            style={{ paddingLeft: 20 }}
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
                </div>
            </div>
        </>
    );
});

export default memo(Menu);
