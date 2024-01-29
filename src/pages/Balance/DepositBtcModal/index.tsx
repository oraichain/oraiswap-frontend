import { FC, useContext, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';
import styles from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { ReactComponent as BTCToken } from 'assets/images/token-btc.svg';
import { NomicContext } from 'context/nomic-context';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { reduceString } from 'libs/utils';
import { timeAgo } from 'helper';

import { satToBTC, useGetInfoBtc } from '../helpers';
import { useUsdtToBtc } from 'hooks/useTokenFee';
import { useCopy } from 'hooks/useCopy';
import { DepositPending } from 'libs/nomic/models/nomic-client/nomic-client-interface';

interface ModalProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleRecoveryAddress: () => void;
  addressRecovery: string;
}

const DepositBtcModal: FC<ModalProps> = ({ isOpen, open, close, handleRecoveryAddress, addressRecovery }) => {
  const [theme] = useConfigReducer('theme');
  const { isCopied, setIsCopied } = useCopy();
  const [urlQRCode, setUrlQRCode] = useState(null);
  const nomic = useContext(NomicContext);
  const { infoBTC } = useGetInfoBtc();
  const [oraiAddress] = useConfigReducer('address');
  const [depositPendings, setDepositPendings] = useState<DepositPending[]>();

  const usdt = useUsdtToBtc();

  const expiration = nomic.depositAddress?.expirationTimeMs;
  useEffect(() => {
    let intervalId;
    if (oraiAddress) {
      intervalId = setInterval(async () => {
        const res = await nomic.getDepositsPending(oraiAddress);
        console.log('🚀 ~ intervalId=setInterval ~ res:', res);
        if (res?.length > 0) {
          setDepositPendings(res);
        }
      }, 10000);
      return;
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [oraiAddress]);
  useEffect(() => {
    (async () => {
      if (nomic.depositAddress?.bitcoinAddress) {
        const url = await QRCode.toDataURL(nomic.depositAddress.bitcoinAddress);
        setUrlQRCode(url);
      }
    })();
    return () => {};
  }, [nomic.depositAddress?.bitcoinAddress]);

  return (
    <Modal theme={theme} isOpen={isOpen} close={close} open={open} className={styles[theme]}>
      <div className={styles.deposit}>
        <div className={styles.label}>
          <span className={styles.title}>Transfer BTC to Oraichain</span>
          <button onClick={close}>
            <CloseIcon color="#232521" />
          </button>
        </div>
        <div className={styles.info}>
          <img src={urlQRCode} alt="Qr code" />
          <div className={styles.address}>
            <BTCToken />
            <button
              className={styles.copy}
              onClick={() => {
                if (nomic.depositAddress?.bitcoinAddress) {
                  copy(nomic.depositAddress?.bitcoinAddress);
                  setIsCopied(true);
                }
              }}
            >
              <span>{reduceString(nomic.depositAddress?.bitcoinAddress, 10, 10) ?? '...'}</span>
              {isCopied ? <SuccessIcon width={20} height={20} /> : <CopyIcon />}
            </button>
          </div>

          <div className={styles.error}>
            <div>
              <TooltipIcon width={20} height={20} />
            </div>
            <span>
              This address expires {timeAgo(expiration)}; deposits sent after that will be lost. Transactions fail for
              deposit amounts exceeding {satToBTC(infoBTC?.capacity_limit)} BTC
            </span>
          </div>
        </div>
        {depositPendings?.length > 0 && (
          <div className={styles.estimate}>
            <div className={styles.timeMinerFee}>
              <span className={styles.fee}>
                Deposits Pending: <b>{depositPendings?.length}</b> transaction{depositPendings?.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        <div className={styles.estimate}>
          <div className={styles.timeMinerFee}>
            <span className={styles.fee}>Minimum Deposit:</span>
            <span className={styles.time}>Expected transaction time:</span>
            <span className={styles.miner}>Bitcoin Miner Fee:</span>
            <span className={styles.fee}>Bridge Fee:</span>
          </div>
          <div className={styles.value}>
            <span>{usdt?.displayAmount} BTC (≈$50)</span>
            <span>20 mins - 1.5 hours</span>
            <span>{nomic.depositAddress?.minerFeeRate} BTC</span>
            <span>{nomic.depositAddress?.bridgeFeeRate * 100}%</span>
          </div>
        </div>
        <div className={styles.warning}>
          <div>
            <TooltipIcon width={20} height={20} />
          </div>
          <span>Warning: Register recovery address for automatic refund once original transaction fail.</span>
        </div>
        {addressRecovery ? (
          <div className={styles.recovery}>
            <span>
              Your recovery BTC Address is:
              <b> {reduceString(addressRecovery, 10, 10)}</b>
            </span>
          </div>
        ) : (
          <div className={styles.btn} onClick={handleRecoveryAddress}>
            <div>Set Recovery Address</div>
          </div>
        )}

        <div className={styles.btn} onClick={close}>
          <div>Close</div>
        </div>
      </div>
    </Modal>
  );
};

export default DepositBtcModal;
