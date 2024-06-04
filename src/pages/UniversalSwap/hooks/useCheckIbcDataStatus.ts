import { useSteps } from '@chakra-ui/react';
import { StateDBStatus } from 'config/ibc-routing';
import { TransactionHistory } from 'libs/duckdb';
import { useEffect, useState } from 'react';
import { useGetRoutingData } from './useGetRoutingData';

const useCheckIbcDataStatus = (data: TransactionHistory) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1
  });
  const [routingFinished, setRoutingFinished] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const routingData = useGetRoutingData({
    txHash: data.initialTxHash,
    chainId: data.fromChainId
  });

  useEffect(() => {
    if (!routingData) return;

    const routingDataLength = routingData.length;

    setActiveStep(routingDataLength);
    setCurrentRoute(routingData[routingDataLength - 1]);

    const pendingItems = routingData.filter((item: any) => item.data.status === StateDBStatus.PENDING);
    if (pendingItems.length === 0 && routingDataLength !== 0) {
      setRoutingFinished(true);
    }
  }, [routingData]);

  return {
    activeStep,
    routingData,
    routingFinished,
    currentRoute
  };
};

export default useCheckIbcDataStatus;
