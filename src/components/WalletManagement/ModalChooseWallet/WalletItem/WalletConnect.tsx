import React, { MouseEventHandler, ReactNode } from 'react';
import { ConnectWalletType } from './types';
import { WalletStatus } from '@cosmos-kit/core';
import { Button } from 'components/Button';

export const ConnectWalletButton = ({ buttonText, isLoading, isDisabled, onClickConnectBtn }: ConnectWalletType) => {
  return (
    <Button
      //   isLoading={isLoading}
      //   isDisabled={isDisabled}
      type="primary-sm"
      onClick={onClickConnectBtn}
    >
      {buttonText}
    </Button>
  );
};

export const Disconnected = ({
  buttonText,
  onClick
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />;
};

export const Connected = ({
  buttonText,
  onClick
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />;
};

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
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
  connecting,
  connected,
  rejected,
  error,
  notExist,
  isActive
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
  isActive: boolean;
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
