import React, { useEffect, useState, useContext, useRef } from 'react';
import copy from 'copy-to-clipboard';
import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as DisconnectIcon } from 'assets/icons/ic_logout.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';

import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { getTotalUsd } from 'libs/utils';
import styles from './MyWallet.module.scss';
import { ThemeContext } from 'context/theme-context';
import { isMobile } from '@walletconnect/browser-utils';
import ToggleSwitch from 'components/ToggleSwitch';
import { Button } from 'components/Button';
import { cosmosNetworks, evmNetworksWithoutTron, tronNetworks } from 'helper';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { ModalDisconnect } from '../ModalDisconnect';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import useConfigReducer from 'hooks/useConfigReducer';
import { NetworkType } from '../ModalChooseWallet';

export const MyWallet: React.FC<{
  setIsShowMyWallet: (isShow: boolean) => void;
  isShowMyWallet: boolean;
  isShowChooseWallet: boolean;
  setIsShowChooseWallet: (isShowChooseWallet: boolean) => void;
  //   handleLogoutWallets: (walletType: any) => void;
}> = ({
  setIsShowMyWallet,
  isShowMyWallet,
  isShowChooseWallet,
  setIsShowChooseWallet
  //   handleLogoutWallets,
}) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [timeoutCopyId, setTimeoutCopyId] = useState<number>(0);

  const [copiedAddressCoordinates, setCopiedAddressCoordinates] = useState<{ networkId: string; walletId: number }>({
    networkId: '',
    walletId: 0
  });

  const [isShowDisconnect, setIsShowDisconnect] = useState(false);
  const [oraiAddress] = useConfigReducer('address');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const totalUsd = getTotalUsd(amounts, prices);

  useEffect(() => {
    if (copiedAddressCoordinates.networkId && copiedAddressCoordinates.walletId) {
      const TIMEOUT_COPY = 2000;
      const timeoutId = setTimeout(() => {
        setCopiedAddressCoordinates({ walletId: 0, networkId: '' });
      }, TIMEOUT_COPY);

      setTimeoutCopyId(Number(timeoutId));
      return () => clearTimeout(timeoutId);
    }
  }, [copiedAddressCoordinates]);

  const copyWalletAddress = (e, address: string, walletId: number, networkId: string) => {
    timeoutCopyId && clearTimeout(timeoutCopyId);
    if (address) {
      e.stopPropagation();
      copy(address);
      setCopiedAddressCoordinates({ walletId, networkId });
    }
  };

  const myWalletRef = useRef(null);
  useOnClickOutside(myWalletRef, () => {
    // just close when no modal is open
    !isShowChooseWallet && !isShowDisconnect && setIsShowMyWallet(false);
  });

  const handleDisconnectNetwork = (networkType: NetworkType) => {};

  return (
    <div
      ref={myWalletRef}
      className={`${styles.myWallets} ${styles[theme]} ${isShowMyWallet ? styles.open : styles.close}`}
    >
      {isShowDisconnect && <ModalDisconnect close={() => setIsShowDisconnect(false)} />}
      <div className={styles.header}>
        <div className={styles.balance}>
          <h3>My Wallets</h3>
          <div>{formatDisplayUsdt(totalUsd)}</div>
        </div>
        {!isMobile() && (
          <div className={styles.btnAddWallet}>
            <Button
              type="primary"
              onClick={() => {
                setIsShowChooseWallet(true);
              }}
              icon={<AddIcon />}
            >
              Add Wallet
            </Button>
          </div>
        )}
      </div>

      <div className={styles.myWalletsWrapper}>
        <div className={styles.toggle}>
          <div className={styles.toggleMode}>
            <div className={styles.toggleModeIcon}>
              <span className={styles.text}>Dark mode</span>
            </div>
            <ToggleSwitch
              small={true}
              id="toggle-mode"
              checked={theme === 'dark'}
              onChange={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            />
          </div>
          {/* <div className={styles.toggleMode}>
            <div className={styles.toggleModeIcon}>
              <span className={cx('text')}>Hide empty assets</span>
            </div>
            <ToggleSwitch
              small={true}
              id="toggle-asset"
              checked={true}
              onChange={() => {
                // setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            />
          </div> */}
        </div>
        <div className={styles.listAddressByNetwork}>
          {oraiAddress && (
            <div className={styles.addressByNetworkItem}>
              {cosmosNetworks.map((network, index) => {
                return (
                  <div className={styles.addressByChainInNetwork} key={network.chainId}>
                    <div className={styles.left}>
                      <div className={styles.icon}>
                        <div className={styles.iconChain}>
                          {theme === 'light' ? (
                            <network.IconLight width={30} height={30} />
                          ) : (
                            <network.Icon width={30} height={30} />
                          )}
                        </div>

                        {/* need to wallet of cosmos network in local storage that save when connect wallet, e.g: {cosmos: owallet, evm: owallet, tron: tronlink  */}
                        <div className={styles.iconWalletByChain}>
                          <KeplrIcon width={18} height={18} />
                        </div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.chainName}>{network.chainName}</div>
                        <div className={styles.chainAddress}>
                          <span>0xD3aB...7f1108</span>
                          <div
                            className={styles.copyBtn}
                            onClick={(e) => copyWalletAddress(e, '12341', 1, network.chainId)}
                          >
                            {copiedAddressCoordinates.networkId === network.chainId &&
                            copiedAddressCoordinates.walletId === 1 ? (
                              <SuccessIcon width={15} height={15} />
                            ) : (
                              <CopyIcon width={15} height={15} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className={styles.right}>
                        {/* get wallet info from local storage */}
                        <div
                          className={styles.disconnectBtn}
                          onClick={() => handleDisconnectNetwork(network.networkType)}
                        >
                          <DisconnectIcon width={25} height={25} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {metamaskAddress && (
            <div className={styles.addressByNetworkItem}>
              {evmNetworksWithoutTron.map((network, index) => {
                return (
                  <div className={styles.addressByChainInNetwork}>
                    <div className={styles.left}>
                      <div className={styles.icon}>
                        <div className={styles.iconChain}>
                          {theme === 'light' ? (
                            <network.IconLight width={30} height={30} />
                          ) : (
                            <network.Icon width={30} height={30} />
                          )}
                        </div>

                        {/* need to wallet of cosmos network in local storage that save when connect wallet, e.g: {cosmos: owallet, evm: owallet, tron: tronlink  */}
                        <div className={styles.iconWalletByChain}>
                          <KeplrIcon width={18} height={18} />
                        </div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.chainName}>{network.chainName}</div>
                        <div className={styles.chainAddress}>
                          <span>0xD3aB...7f1108</span>
                          <div
                            className={styles.copyBtn}
                            onClick={(e) => copyWalletAddress(e, '12341', 1, network.chainId)}
                          >
                            {copiedAddressCoordinates.networkId === network.chainId &&
                            copiedAddressCoordinates.walletId === 1 ? (
                              <SuccessIcon width={15} height={15} />
                            ) : (
                              <CopyIcon width={15} height={15} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.right}>
                      {/* get wallet info from local storage */}
                      <div className={styles.disconnectBtn} onClick={() => {}}>
                        <DisconnectIcon width={25} height={25} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {tronAddress && (
            <div className={styles.addressByNetworkItem}>
              {tronNetworks.map((network, index) => {
                return (
                  <div className={styles.addressByChainInNetwork}>
                    <div className={styles.left}>
                      <div className={styles.icon}>
                        <div className={styles.iconChain}>
                          {theme === 'light' ? (
                            <network.IconLight width={30} height={30} />
                          ) : (
                            <network.Icon width={30} height={30} />
                          )}
                        </div>

                        {/* need to wallet of cosmos network in local storage that save when connect wallet, e.g: {cosmos: owallet, evm: owallet, tron: tronlink  */}
                        <div className={styles.iconWalletByChain}>
                          <KeplrIcon width={18} height={18} />
                        </div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.chainName}>{network.chainName}</div>
                        <div className={styles.chainAddress}>
                          <span>0xD3aB...7f1108</span>
                          <div
                            className={styles.copyBtn}
                            onClick={(e) => copyWalletAddress(e, '12341', 1, network.chainId)}
                          >
                            {copiedAddressCoordinates.networkId === network.chainId &&
                            copiedAddressCoordinates.walletId === 1 ? (
                              <SuccessIcon width={15} height={15} />
                            ) : (
                              <CopyIcon width={15} height={15} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.right}>
                      {/* get wallet info from local storage */}
                      <div className={styles.disconnectBtn} onClick={() => {}}>
                        <DisconnectIcon width={25} height={25} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* {wallets.map((wallet, index) => {
            return (
              <div key={index} className={cx('wallet_container')}>
                <div className={cx('wallet_info')}>
                  <div className={cx('logo')}>
                    <div className={cx('remove')} onClick={() => {}}>
                      <DisconnectIcon />
                    </div>
                    <img src={wallet.icon} alt="wallet icon" />
                  </div>
                  <div className={cx('info')}>
                    <div className={cx('name')}>{wallet.name}</div>
                  </div>
                  <div className={cx('control')} onClick={() => {}}>
                    {wallet.isOpen ? <UpArrowIcon /> : <DownArrowIcon />}
                  </div>
                </div>
                {wallet.isOpen ? (
                  <div className={cx('networks_container')}>
                    {wallet.networks.map((network, index) => {
                      return (
                        <div key={'network' + index} className={cx('network_container')}>
                          <div>
                            {theme === 'light' ? (
                              network.IconLight ? (
                                <network.IconLight className={cx('icon')} />
                              ) : (
                                <network.Icon className={cx('icon')} />
                              )
                            ) : (
                              <network.Icon className={cx('icon')} />
                            )}
                          </div>
                          <div className={cx('info')}>
                            <div className={cx('name')}>{network.chainName}</div>
                            {network.address ? (
                              <div className={cx('address')}>{reduceString(network.address, 5, 5)}</div>
                            ) : null}
                          </div>
                          <div className={cx('actions')}>
                            {network.address ? (
                              <>
                                <div
                                  className={cx('copy')}
                                  onClick={(e) => copyWalletAddress(e, network.address, wallet.id, network.chainId)}
                                >
                                  {copiedAddressCoordinates.networkId === network.chainId &&
                                  copiedAddressCoordinates.walletId === wallet.id ? (
                                    <SuccessIcon width={20} height={20} />
                                  ) : (
                                    <CopyIcon />
                                  )}
                                </div>
                              </>
                            ) : (
                              <div>
                                <UnavailableCloudIcon />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};
