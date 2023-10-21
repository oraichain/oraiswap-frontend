import cn from 'classnames/bind';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import useConfigReducer from 'hooks/useConfigReducer';
import OraiDEXLoadingBlack from 'assets/lottie/oraiDEX_loading_black.json';

import styles from './index.module.scss';
import { getListAddressCosmos, switchWalletCosmos, switchWalletTron } from 'helper';
import { network } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import useLoadTokens from 'hooks/useLoadTokens';

const cx = cn.bind(styles);

const ConnectProcessing: React.FC<{ walletName: string; close: () => void }> = ({ walletName, close }) => {
  const [theme] = useConfigReducer('theme');
  const [address, setAddress] = useState('');
  const loadTokenAmounts = useLoadTokens();
  const [oraiAddressWallet, setOraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress, setTronAddress] = useConfigReducer('tronAddress');
  const [_, setCosmosAddress] = useConfigReducer('cosmosAddress');

  useEffect(() => {
    getWallet();
  }, [walletName]);

  const connectOwalletOrKeplr = async (type: 'keplr' | 'owallet') => {
    try {
      await switchWalletCosmos(type);
      await window.Keplr.suggestChain(network.chainId);
      const oraiAddress = await window.Keplr.getKeplrAddr();
      if (oraiAddress !== oraiAddressWallet) {
        const { listAddressCosmos } = await getListAddressCosmos();
        loadTokenAmounts({ oraiAddress });
        setOraiAddressWallet(oraiAddress);
        setCosmosAddress(listAddressCosmos);
      }
      setAddress(oraiAddress);
    } catch (error) {
      console.log('🚀 ~ file: connectOwalletOrKeplr ~ error:', error);
    }
  };

  const getWallet = async () => {
    if (walletName === 'Owallet') {
      connectOwalletOrKeplr('owallet');
    }

    if (walletName === 'Metamask') {
      const evmAddress = await window.Metamask.getEthAddress();
      if (evmAddress !== metamaskAddress) {
        loadTokenAmounts({ metamaskAddress: evmAddress });
        setMetamaskAddress(evmAddress);
      }
      setAddress(evmAddress);
    }

    if (walletName === 'TronLink') {
      const { tronAddress: address } = await switchWalletTron();
      if (address !== tronAddress) {
        loadTokenAmounts({ tronAddress: address });
        setTronAddress(address);
      }
      setAddress(tronAddress);
    }

    if (walletName === 'Keplr') {
      connectOwalletOrKeplr('keplr');
    }
  };
  return (
    <div className={cx('connect_processing', theme)}>
      {!address && (
        <>
          <div className={cx('loading_icon')}>
            <span>
              <Lottie animationData={OraiDEXLoadingBlack} />
            </span>
          </div>
          <div className={cx('content')}>Connect {walletName} to OraiDEX to proceed</div>
        </>
      )}
      {address && (
        <div className={cx('box')}>
          <div className={cx('label')}>This address has already been added:</div>
          <div className={cx('address')}> {address}</div>
        </div>
      )}
      <div className={cx('cancel_btn')} onClick={close}>
        Cancel
      </div>
    </div>
  );
};

export default ConnectProcessing;
