import { useEffect, useState } from 'react';
import { fetchRelayerFee } from 'rest/api';

export const useRelayerFee = () => {
  const [relayerFee, setRelayerFee] = useState([]);

  const queryRelayerFee = async () => {
    const data = await fetchRelayerFee();
    setRelayerFee(data);
  };

  useEffect(() => {
    queryRelayerFee();
  }, []);

  return relayerFee;
};
