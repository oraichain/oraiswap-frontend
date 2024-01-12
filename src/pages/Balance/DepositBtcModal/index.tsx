import { FC, useContext, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import style from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import { ReactComponent as BTCToken } from 'assets/images/token-btc.svg';
import { NomicContext } from 'context/nomic-context';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { reduceString } from 'libs/utils';
import { Button } from 'components/Button';
interface ModalProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DepositBtcModal: FC<ModalProps> = ({ isOpen, open, close }) => {
  const [theme] = useConfigReducer('theme');
  const nomic = useContext(NomicContext);
  const [qrcodeUrl, setQrcodeUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    (async () => {
      if (nomic?.depositAddress?.address) {
        const url = await QRCode.toDataURL(nomic?.depositAddress?.address);
        setQrcodeUrl(url);
      }
    })();
    return () => {};
  }, [nomic?.depositAddress?.address]);
  useEffect(() => {
    const TIMEOUT_COPY = 2000;
    let timeoutId;
    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT_COPY);
    }

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  return (
    <Modal theme={theme} isOpen={isOpen} close={close} open={open}>
      {/* <div className={classNames(style.modal)}>
        <button
          onClick={async () => {
            await nomic.setRecoveryAddress('tb1qepum984v3l7nnvzy79dtgx3kh709uvm93v3qjj');
          }}
        >
          Set recovery address
        </button>
      </div> */}
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 12
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              color: '#232521',
              fontSize: 20,
              fontWeight: 600
            }}
          >
            Transfer BTC to Oraichain
          </span>
          <button onClick={close}>
            <CloseIcon color="#232521" />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img src={qrcodeUrl} alt="Qr code" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <BTCToken />
            <button
              style={{
                background: '#F7F7F7',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: 99,
                margin: 8
              }}
              onClick={() => {
                if (nomic?.depositAddress?.address) {
                  copy(nomic?.depositAddress?.address);
                  setIsCopied(true);
                }
              }}
            >
              <span
                style={{
                  paddingRight: 10,
                  color: '#494949'
                }}
              >
                {reduceString(nomic?.depositAddress?.address, 15, 15) ?? '...'}
              </span>{' '}
              {isCopied ? <SuccessIcon width={20} height={20} /> : <CopyIcon />}
            </button>
          </div>

          <div
            style={{
              background: '#FFEDEB',
              padding: 16,
              borderRadius: 12,
              margin: '16px 0px'
            }}
          >
            {/* <CopyIcon /> */}
            <span
              style={{
                color: '#E01600',
                fontSize: 14
              }}
            >
              This address expires in 4 days; deposits sent after that will be lost. Transactions fail for deposit
              amounts below 0.00043713 BTC or exceeding 21 BTC
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            background: '#F7F7F7',
            borderRadius: 12,
            padding: 16
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingRight: 20
            }}
          >
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              Expected transaction time:
            </span>
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              Bitcoin Miner Fee:
            </span>
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              Bridge Fee:
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              10 mins - 1.5 hours
            </span>
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              0.00024285 BTC
            </span>
            <span
              style={{
                color: '#686A66',
                fontSize: 14
              }}
            >
              1%
            </span>
          </div>
        </div>
        <div
          style={{
            background: '#FFFDEB',
            padding: 16,
            borderRadius: 12,
            marginTop: 16
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: '#AD9C00'
            }}
          >
            The Bitcoin Recovery address is necessary for retrieving Bitcoin in the event of an emergency disbursement.
          </span>
        </div>

        <Button
          onClick={close}
          type="secondary-sm"
          // style={{
          //   width: '100%',
          //   marginTop: 24,
          //   color: '#232521'
          // }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default DepositBtcModal;
