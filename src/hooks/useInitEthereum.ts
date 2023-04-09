import { initEthereum } from 'polyfill';
import { useEffect } from 'react';

export default function useInitEthereum() {
  useEffect(() => {
    _initEthereum();
  }, []);

  const _initEthereum = async () => {
    try {
      await initEthereum();
    } catch (error) {
      console.log(error);
    }
  };
}
