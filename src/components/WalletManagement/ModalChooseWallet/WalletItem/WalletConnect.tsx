import React, { MouseEventHandler, ReactNode } from 'react';
import { ConnectWalletType } from './types';
import { Button } from 'components/Button';
import { WalletStatus } from './WalletItem';

export const ConnectWalletButton = ({ buttonText, isLoading, onClickConnectBtn, isConnected }: ConnectWalletType) => {
  return (
    <Button
      style={{ fontWeight: isConnected ? 500 : 400 }}
      disabled={isLoading}
      type={isConnected ? 'primary-sm' : 'disable-sm'}
      onClick={onClickConnectBtn}
    >
      {buttonText}
    </Button>
  );
};

export const Disconnected = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={() => {}} />;
};

export const Connected = ({ buttonText }: { buttonText: string }) => {
  return <ConnectWalletButton isConnected buttonText={buttonText} onClickConnectBtn={() => {}} />;
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
    default:
      return <>{disconnect}</>;
  }
};
