import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import { ReactComponent as FailedIcon } from 'assets/icons/toast_failed.svg';
import { ReactComponent as InfoIcon } from 'assets/icons/toast_info.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import classNames from 'classnames';
import Loader from 'components/Loader';
import { reduceString } from 'libs/utils';
import { FunctionComponent } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import styles from './Toast.module.scss';

const CloseButton = ({ closeToast }: { closeToast: () => void }) => {
  return <button onClick={closeToast} className={styles.btn_close}></button>;
};

const defaultOptions: ToastOptions = {
  position: 'top-right',
  theme: 'dark',
  autoClose: 7000,
  icon: false,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  pauseOnFocusLoss: false,
  closeButton: CloseButton
};

const defaultExtraData = { message: '', customLink: '' };

export enum TToastType {
  TX_BROADCASTING,
  TX_SUCCESSFUL,
  TX_FAILED,
  TX_INFO,
  KEPLR_FAILED,
  METAMASK_FAILED,
  TRONLINK_FAILED
}

interface IToastExtra {
  message: string;
  customLink: string;
  textLink: string;
  linkCw20Token?: string;
  cw20Address?: string;
}

export type DisplayToastFn = ((
  type: TToastType.TX_INFO,
  extraData?: Partial<Pick<IToastExtra, 'message'>>,
  options?: Partial<ToastOptions>
) => void) &
  ((type: TToastType.TX_BROADCASTING, options?: Partial<ToastOptions>) => void) &
  ((
    type: TToastType.TX_SUCCESSFUL,
    extraData?: Partial<Pick<IToastExtra, 'customLink' | 'linkCw20Token' | 'cw20Address'>>,
    options?: Partial<ToastOptions>
  ) => void) &
  ((
    type: TToastType.TX_FAILED,
    extraData?: Partial<Pick<IToastExtra, 'message'>>,
    options?: Partial<ToastOptions>
  ) => void) &
  ((
    type: TToastType.KEPLR_FAILED,
    extraData?: Partial<Pick<IToastExtra, 'message'>>,
    options?: Partial<ToastOptions>
  ) => void) &
  ((
    type: TToastType.METAMASK_FAILED,
    extraData?: Partial<Pick<IToastExtra, 'message'>>,
    options?: Partial<ToastOptions>
  ) => void) &
  ((
    type: TToastType.TRONLINK_FAILED,
    extraData?: Partial<Pick<IToastExtra, 'message'>>,
    options?: Partial<ToastOptions>
  ) => void) &
  ((
    type: TToastType.TX_INFO,
    extraData?: Partial<Pick<IToastExtra, 'message' | 'customLink' | 'textLink'>>,
    options?: Partial<ToastOptions>
  ) => void);

export interface DisplayToast {
  displayToast: DisplayToastFn;
}

export const displayToast: DisplayToastFn = (
  type: TToastType,
  extraData?: Partial<IToastExtra> | Partial<ToastOptions>,
  options?: Partial<ToastOptions>
) => {
  const refinedOptions = type === TToastType.TX_BROADCASTING ? extraData ?? {} : options ?? {};
  const refinedExtraData = extraData ? extraData : {};
  const inputExtraData = {
    ...defaultExtraData,
    ...refinedExtraData
  } as IToastExtra;
  const inputOptions = {
    ...defaultOptions,
    ...refinedOptions,
    closeOnClick: true
  } as ToastOptions;

  switch (type) {
    case TToastType.TX_INFO:
      return toast(
        <ToastInfo
          message={inputExtraData.message}
          link={inputExtraData.customLink}
          textLink={inputExtraData.textLink}
        />,
        inputOptions
      );
    case TToastType.TX_BROADCASTING:
      return toast(<ToastTxBroadcasting />, inputOptions);
    case TToastType.TX_SUCCESSFUL:
      return toast(
        <ToastTxSuccess
          link={inputExtraData.customLink}
          linkCw20Token={inputExtraData.linkCw20Token}
          cw20Address={inputExtraData.cw20Address}
        />,
        inputOptions
      );
    case TToastType.TX_FAILED:
      return toast(<ToastTxFailed message={inputExtraData.message} />, inputOptions);
    case TToastType.KEPLR_FAILED:
      return toast(<ToastKeplrFailed message={inputExtraData.message} />, inputOptions);
    case TToastType.METAMASK_FAILED:
      return toast(<ToastMetamaskFailed message={inputExtraData.message} />, inputOptions);
    case TToastType.TRONLINK_FAILED:
      return toast(<ToastTronLinkFailed message={inputExtraData.message} />, inputOptions);
    default:
      return console.error(`Undefined toast type - ${type}`);
  }
};

const ToastTxBroadcasting: FunctionComponent = () => (
  <div className={classNames(styles.toast_content, styles.toast_broadcasting)}>
    <Loader />
    <section className={styles.toast_section}>
      <h6>Transaction Broadcasting</h6>
      <p>Waiting for transaction to be included in the block</p>
    </section>
  </div>
);

const ToastInfo: FunctionComponent<{
  message: string;
  link: string;
  textLink: string;
}> = ({ message, link, textLink }) => (
  <div className={classNames(styles.toast_content, styles.toast_info)}>
    <InfoIcon />
    <section className={styles.toast_section}>
      <p>{message}</p>
      {link && (
        <a target="__blank" href={link}>
          {textLink ?? 'View on Instructions'} <LinkIcon />
        </a>
      )}
    </section>
  </div>
);

const ToastTxFailed: FunctionComponent<{ message: string }> = ({ message }) => (
  <div className={classNames(styles.toast_content, styles.toast_failed)}>
    <FailedIcon />
    <section className={styles.toast_section}>
      <h6>Transaction Failed</h6>
      <p>{message}</p>
    </section>
  </div>
);

const ToastKeplrFailed: FunctionComponent<{ message: string }> = ({ message }) => (
  <div className={classNames(styles.toast_content, styles.toast_failed)}>
    <FailedIcon />
    <section className={styles.toast_section}>
      <h6>Keplr failed</h6>
      <p>{message}</p>
    </section>
  </div>
);

const ToastMetamaskFailed: FunctionComponent<{ message: string }> = ({ message }) => (
  <div className={classNames(styles.toast_content, styles.toast_failed)}>
    <FailedIcon />
    <section className={styles.toast_section}>
      <h6>Metamask failed</h6>
      <p>{message}</p>
    </section>
  </div>
);

const ToastTronLinkFailed: FunctionComponent<{ message: string }> = ({ message }) => (
  <div className={classNames(styles.toast_content, styles.toast_failed)}>
    <FailedIcon />
    <section className={styles.toast_section}>
      <h6>Tronlink failed</h6>
      <p>{message}</p>
    </section>
  </div>
);

const ToastTxSuccess: FunctionComponent<{
  link: string;
  linkCw20Token?: string;
  cw20Address?: string;
}> = ({ link, linkCw20Token, cw20Address }) => (
  <div className={classNames(styles.toast_content, styles.toast_success)}>
    <SuccessIcon />
    <section className={styles.toast_section}>
      <h6>Transaction Successful</h6>
      {cw20Address && (
        <div className={styles.cw20_section} onClick={() => window.open(linkCw20Token)}>
          <span className={styles.cw20_section_label}>CW20 Token</span>:{' '}
          <span className={styles.cw20_section_value}>{reduceString(cw20Address, 6, 6)}</span>
          <LinkIcon />
        </div>
      )}
      <a target="__blank" href={link}>
        View on Explorer <LinkIcon />
      </a>
    </section>
  </div>
);
