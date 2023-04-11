import React, { FC } from 'react';
import { displayToast, DisplayToast } from './Toast';

export const ToastContext = React.createContext<DisplayToast | null>(null);

export const ToastProvider: FC<{ children: ReactChildren }> = ({ children }) => {
  return (
    <ToastContext.Provider
      value={{
        displayToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('You have forgot to use ToastProvider');
  }
  return context;
};
