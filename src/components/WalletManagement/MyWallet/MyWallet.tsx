import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as DisconnectIcon } from 'assets/icons/ic_logout.svg';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { Button } from 'components/Button';
import ToggleSwitch from 'components/ToggleSwitch';
import { cosmosWallets, type NetworkType } from 'components/WalletManagement/walletConfig';
import { ThemeContext } from 'context/theme-context';
import copy from 'copy-to-clipboard';
import { cosmosNetworksWithIcon, evmNetworksWithoutTron, tronNetworks } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useWalletReducer from 'hooks/useWalletReducer';
import { getTotalUsd, reduceString } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'store/configure';
import { ModalDisconnect } from '../ModalDisconnect';
import styles from './MyWallet.module.scss';

export const MyWallet: React.FC<{
  setIsShowMyWallet: (isShow: boolean) => void;
  isShowMyWallet: boolean;
  isShowChooseWallet: boolean;
  setIsShowChooseWallet: (isShowChooseWallet: boolean) => void;
}> = ({ setIsShowMyWallet, isShowMyWallet, isShowChooseWallet, setIsShowChooseWallet }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [timeoutCopyId, setTimeoutCopyId] = useState<number>(0);

  const [copiedAddressCoordinates, setCopiedAddressCoordinates] = useState<{ networkId: string; walletId: number }>({
    networkId: '',
    walletId: 0
  });
  const [currentDisconnectingNetwork, setCurrentDisconnectingNetwork] = useState<NetworkType>(null);

  const [isShowDisconnect, setIsShowDisconnect] = useState(false);
  const [oraiAddress] = useConfigReducer('address');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddresses] = useConfigReducer('cosmosAddress');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

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

  const renderCosmosAddresses = () => {
    if (!oraiAddress) return <></>;

    const cosmosWalletConnected = cosmosWallets.find((item) => item.nameRegistry === walletByNetworks.cosmos);
    if (!cosmosWalletConnected) return <></>;

    return (
      <div className={styles.addressByNetworkItem}>
        {cosmosNetworksWithIcon.map((network, index) => {
          const chainAddress = cosmosAddresses[network.chainId];
          return !cosmosAddresses[network.chainId] ? null : (
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

                  <div className={styles.iconWalletByChain}>
                    <cosmosWalletConnected.icon width={18} height={18} />
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.chainName}>{network.chainName}</div>
                  <div className={styles.chainAddress}>
                    <span>{reduceString(chainAddress, 6, 6)}</span>
                    <div
                      className={styles.copyBtn}
                      onClick={(e) => copyWalletAddress(e, chainAddress, 1, network.chainId)}
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
                  <div
                    className={styles.disconnectBtn}
                    onClick={() => {
                      setIsShowDisconnect(true);
                      setCurrentDisconnectingNetwork(network.networkType);
                    }}
                  >
                    <DisconnectIcon width={25} height={25} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={myWalletRef}
      className={`${styles.myWallets} ${styles[theme]} ${isShowMyWallet ? styles.open : styles.close}`}
    >
      {isShowDisconnect && (
        <ModalDisconnect
          close={() => setIsShowDisconnect(false)}
          currentDisconnectingNetwork={currentDisconnectingNetwork}
          setCurrentDisconnectingNetwork={setCurrentDisconnectingNetwork}
        />
      )}
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
          {renderCosmosAddresses()}
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
        </div>
      </div>
    </div>
  );
};
