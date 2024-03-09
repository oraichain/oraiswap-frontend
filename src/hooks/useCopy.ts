import { useEffect, useState } from 'react';
export interface IUseCopy {
  setIsCopied: (isBoolean: boolean) => void;
  isCopied: boolean;
}
export const useCopy = (): IUseCopy => {
  const [isCopied, setIsCopied] = useState(false);
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
  return { setIsCopied, isCopied };
};
