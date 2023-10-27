import React, { FC } from 'react';
import { displayToast, DisplayToast } from './Toast';
import useConfigReducer from 'hooks/useConfigReducer';

export const ToastContext = React.createContext<DisplayToast | null>(null);

export const ToastProvider: FC<{ children: ReactChildren }> = ({ children }) => {
  const [theme] = useConfigReducer('theme');
  return (
    <ToastContext.Provider
      value={{
        displayToast,
        theme
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
