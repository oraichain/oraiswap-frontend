import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as AddIcon } from 'assets/icons/Add-icon-black-only.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as DisconnectIcon } from 'assets/icons/ic_logout.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { Button } from 'components/Button';
import ToggleSwitch from 'components/ToggleSwitch';
import { ThemeContext } from 'context/theme-context';
import {
  cosmosWallets,
  tronWallets,
  evmWallets,
  btcWallets,
  type NetworkType
} from 'components/WalletManagement/walletConfig';
import {
  tronNetworksWithIcon,
  cosmosNetworksWithIcon,
  evmNetworksIconWithoutTron,
  getListAddressCosmos,
  btcNetworksWithIcon
} from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useCopyClipboard } from 'hooks/useCopyClipboard';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useWalletReducer from 'hooks/useWalletReducer';
import { getTotalUsd, reduceString } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'store/configure';
import { ModalDisconnect } from '../ModalDisconnect';
import styles from './MyWallet.module.scss';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';

export const MyWallet: React.FC<{
  setIsShowMyWallet: (isShow: boolean) => void;
  isShowMyWallet: boolean;
  isShowChooseWallet: boolean;
  setIsShowChooseWallet: (isShowChooseWallet: boolean) => void;
}> = ({ setIsShowMyWallet, isShowMyWallet, isShowChooseWallet, setIsShowChooseWallet }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [oraiAddress] = useConfigReducer('address');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [btcAddress] = useConfigReducer('btcAddress');

  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddresses, setCosmosAddress] = useConfigReducer('cosmosAddress');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

  const [currentDisconnectingNetwork, setCurrentDisconnectingNetwork] = useState<NetworkType>(null);
  const [isShowDisconnect, setIsShowDisconnect] = useState(false);

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const totalUsd = getTotalUsd(amounts, prices);
  const { isCopied, copiedValue, handleCopy } = useCopyClipboard();

  const myWalletRef = useRef(null);
  useOnClickOutside(myWalletRef, () => {
    // just close when no modal is open
    !isShowChooseWallet && !isShowDisconnect && setIsShowMyWallet(false);
  });

  useEffect(() => {
    (async () => {
      const listAddress = cosmosAddresses ? Object.values(cosmosAddresses).filter((e) => e) : [];
      if (oraiAddress && listAddress.length < cosmosNetworksWithIcon.length) {
        const { listAddressCosmos } = await getListAddressCosmos(oraiAddress, walletByNetworks.cosmos);
        setCosmosAddress(listAddressCosmos);
      }
    })();
  }, []);

  const renderCosmosAddresses = () => {
    if (!oraiAddress) return <></>;
    const cosmosWalletConnected = cosmosWallets.find((item) => item.nameRegistry === walletByNetworks.cosmos);
    if (!cosmosWalletConnected) return <></>;

    return (
      <div className={styles.addressByNetworkItem}>
        {cosmosNetworksWithIcon.map((network, index) => {
          const chainAddress = cosmosAddresses && cosmosAddresses[network.chainId];
          let NetworkIcon = theme === 'dark' ? network.Icon : network.IconLight;
          if (!NetworkIcon) NetworkIcon = DefaultIcon;

          return !chainAddress ? null : (
            <div className={styles.addressByChainInNetwork} key={network.chainId}>
              <div className={styles.left}>
                <div className={styles.icon}>
                  <div className={styles.iconChain}>
                    <NetworkIcon width={30} height={30} />
                  </div>

                  <div className={styles.iconWalletByChain}>
                    <cosmosWalletConnected.icon width={18} height={18} />
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.chainName}>{network.chainName}</div>
                  <div className={styles.chainAddress}>
                    <span>{reduceString(chainAddress, 6, 6)}</span>
                    <div className={styles.copyBtn} onClick={(e) => handleCopy(chainAddress)}>
                      {isCopied && copiedValue === chainAddress ? (
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
                    title="Disconnect"
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

  const renderEvmAddresses = () => {
    if (!metamaskAddress) return <></>;

    const evmWalletConnected = evmWallets.find((item) => item.nameRegistry === walletByNetworks.evm);
    if (!evmWalletConnected) return <></>;

    return (
      <div className={styles.addressByNetworkItem}>
        {evmNetworksIconWithoutTron.map((network, index) => {
          const chainAddress = metamaskAddress;
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

                  <div className={styles.iconWalletByChain}>
                    <evmWalletConnected.icon width={18} height={18} />
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.chainName}>{network.chainName}</div>
                  <div className={styles.chainAddress}>
                    <span>{reduceString(chainAddress, 6, 6)}</span>
                    <div className={styles.copyBtn} onClick={(e) => handleCopy(chainAddress)}>
                      {isCopied && copiedValue === chainAddress ? (
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
                    title="Disconnect"
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

  const renderTronAddresses = () => {
    if (!tronAddress) return <></>;

    const tronWalletConnected = tronWallets.find((item) => item.nameRegistry === walletByNetworks.tron);
    if (!tronWalletConnected) return <></>;

    return (
      <div className={styles.addressByNetworkItem}>
        {tronNetworksWithIcon.map((network) => {
          let NetworkIcon = theme === 'dark' ? network.Icon : network.IconLight;
          if (!NetworkIcon) NetworkIcon = DefaultIcon;
          return (
            <div key={network.chainId} className={styles.addressByChainInNetwork}>
              <div className={styles.left}>
                <div className={styles.icon}>
                  <div className={styles.iconChain}>
                    <NetworkIcon width={30} height={30} />
                  </div>

                  <div className={styles.iconWalletByChain}>
                    <tronWalletConnected.icon width={18} height={18} />
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.chainName}>{network.chainName}</div>
                  <div className={styles.chainAddress}>
                    <span>{reduceString(tronAddress, 6, 6)}</span>
                    <div className={styles.copyBtn} onClick={(e) => handleCopy(tronAddress)}>
                      {isCopied && copiedValue === tronAddress ? (
                        <SuccessIcon width={15} height={15} />
                      ) : (
                        <CopyIcon width={15} height={15} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div
                  className={styles.disconnectBtn}
                  onClick={() => {
                    setIsShowDisconnect(true);
                    setCurrentDisconnectingNetwork('tron');
                  }}
                  title="Disconnect"
                >
                  <DisconnectIcon width={25} height={25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const renderBtcAddresses = () => {
    if (!btcAddress) return null;
    const btcWalletConnected = btcWallets.find((item) => item.nameRegistry === walletByNetworks.bitcoin);
    if (!btcWalletConnected) return <></>;

    return (
      <div className={styles.addressByNetworkItem}>
        {btcNetworksWithIcon.map((network) => {
          let NetworkIcon = theme === 'dark' ? network.Icon : network.IconLight;
          if (!NetworkIcon) NetworkIcon = DefaultIcon;
          return (
            <div key={network.chainId} className={styles.addressByChainInNetwork}>
              <div className={styles.left}>
                <div className={styles.icon}>
                  <div className={styles.iconChain}>
                    <NetworkIcon width={30} height={30} />
                  </div>

                  <div className={styles.iconWalletByChain}>
                    <btcWalletConnected.icon width={18} height={18} />
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.chainName}>{network.chainName}</div>
                  <div className={styles.chainAddress}>
                    <span>{reduceString(btcAddress, 6, 6)}</span>
                    <div className={styles.copyBtn} onClick={(e) => handleCopy(btcAddress)}>
                      {isCopied && copiedValue === btcAddress ? (
                        <SuccessIcon width={15} height={15} />
                      ) : (
                        <CopyIcon width={15} height={15} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div
                  className={styles.disconnectBtn}
                  onClick={() => {
                    setIsShowDisconnect(true);
                    setCurrentDisconnectingNetwork('bitcoin');
                  }}
                  title="Disconnect"
                >
                  <DisconnectIcon width={25} height={25} />
                </div>
              </div>
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
          {renderEvmAddresses()}
          {renderTronAddresses()}
          {renderBtcAddresses()}
        </div>
      </div>
    </div>
  );
};
