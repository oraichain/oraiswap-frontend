import React, { MouseEventHandler, ReactNode } from 'react';
import { ConnectWalletType } from './types';
import { Button } from 'components/Button';
import { WalletStatus } from './WalletItem';

export const ConnectWalletButton = ({ buttonText, isLoading, isDisabled, onClickConnectBtn }: ConnectWalletType) => {
  return (
    <Button disabled={isLoading} type="primary-sm" onClick={onClickConnectBtn}>
      {buttonText}
    </Button>
  );
};

export const Disconnected = ({
  buttonText
}: // onClick
{
  buttonText: string;
  // onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={() => {}} />;
};

export const Connected = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={() => {}} />;
};

export const Connecting = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton buttonText={buttonText} isLoading={true} onClickConnectBtn={() => {}} />;
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
  onClick
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div>
      <ConnectWalletButton buttonText={buttonText} isDisabled={false} onClickConnectBtn={onClick} />
      {wordOfWarning && <div>{wordOfWarning}</div>}
    </div>
  );
};

export const Error = ({
  buttonText,
  wordOfWarning,
  onClick
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return <div>Warning: {wordOfWarning}</div>;
};

export const NotExist = ({
  buttonText,
  onClick
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return <ConnectWalletButton buttonText={buttonText} isDisabled={false} onClickConnectBtn={onClick} />;
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connected,
  connecting
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connected: ReactNode;
  connecting: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Loading:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    // case WalletStatus.Rejected:
    //   return <>{rejected}</>;
    // case WalletStatus.Error:
    //   return <>{error}</>;
    // case WalletStatus.NotExist:
    //   return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
