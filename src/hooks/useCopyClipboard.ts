import { useEffect, useState } from 'react';

export const useCopyClipboard = (timeout = 2000) => {
  const [copiedValue, setCopiedValue] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setCopiedValue(text);
      })
      .catch((error) => {
        console.error('Failed to copy to clipboard', error);
        setCopiedValue(null);
      });
  };

  useEffect(() => {
    let timeoutId;

    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
        setCopiedValue(null);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCopied, timeout]);

  return { isCopied, copiedValue, handleCopy };
};
