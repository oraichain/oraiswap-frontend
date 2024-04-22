import React, { useEffect, useState } from 'react';
import styles from './IbcRouting.module.scss';
import Modal from 'components/Modal';
import useTheme from 'hooks/useTheme';
import cn from 'classnames/bind';
import { COSMOS_CHAIN_ID_COMMON } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import {
  Box,
  Step,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  extendTheme,
  useSteps
} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import TimelineDetail, { TimelineType } from '../Component/TimelineDetail';
import { TransactionHistory } from 'libs/duckdb';
import { useGetRoutingData } from '../hooks/useGetRoutingData';
import { CosmosState, DatabaseEnum, EvmChainPrefix, EvmState, RoutingQueryItem, StateDBStatus } from '../ibc-routing';
import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as AtomIcon } from 'assets/icons/atom_cosmos.svg';
import { ReactComponent as InjIcon } from 'assets/icons/inj.svg';
import { ReactComponent as OsmoIcon } from 'assets/icons/osmosis.svg';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';

const cx = cn.bind(styles);

const borderColor = 'rgb(47, 87, 17)';

const chakraTheme = extendTheme({
  fonts: {
    body: 'IBM Plex Sans, sans-serif',
    heading: 'IBM Plex Sans, sans-serif'
  }
});

const IbcRouting: React.FC<{
  close: () => void;
  data: TransactionHistory;
}> = ({ close, data }) => {
  const theme = useTheme();
  const { activeStep, setActiveStep } = useSteps({
    index: 1
    // count: steps.length
  });
  const [routingFinished, setRoutingFinished] = useState(false);
  const routingData = useGetRoutingData({
    txHash: data.initialTxHash,
    chainId: data.fromChainId
  });

  useEffect(() => {
    if (!routingData) return;

    const routingDataLength = routingData.length;

    setActiveStep(routingDataLength);

    const pendingItems = routingData.filter((item: any) => item.data.status === StateDBStatus.PENDING);
    if (pendingItems.length === 0 && routingDataLength != 0) {
      setRoutingFinished(true);
    }
  }, [routingData]);

  const getTimelineState = (data: RoutingQueryItem): TimelineType => {
    if (data.data.status === StateDBStatus.PENDING) return TimelineType.WAITING;
    if (data.data.status === StateDBStatus.FINISHED) return TimelineType.CONFIRMED;
    return TimelineType.INACTIVE;
  };

  return (
    <ChakraProvider disableGlobalStyle={false} theme={chakraTheme}>
      <Modal
        isOpen={true}
        close={close}
        open={() => {}}
        isCloseBtn={false}
        className={cx(styles.chooseWalletModalContainer, `${styles[theme]}`, styles.modal)}
      >
        <div className={styles.chooseWalletModalWrapper}>
          <div className={styles.header}>
            <div className={styles.title}>{routingFinished ? 'Transaction finished' : 'Transaction processing...'}</div>
            <div onClick={close} className={styles.closeIcon}>
              <CloseIcon />
            </div>
          </div>
          <div className={styles.stepperWrapper}>
            <Stepper size="lg" colorScheme={borderColor} index={activeStep} orientation="vertical" gap="2">
              {routingData &&
                routingData.map((item: any, index) => {
                  return (
                    <Step key={index} style={{ width: '597px', gap: '16px' }}>
                      <StepIndicator>
                        <StepStatus complete={getIcons(item)} incomplete={getIcons(item)} active={getIcons(item)} />
                      </StepIndicator>

                      <TimelineDetail type={getTimelineState(item)} data={item} lastIndex={index + 1 == activeStep} />

                      <StepSeparator
                        style={{
                          width: '2px',
                          background: `${
                            index <= activeStep - 1
                              ? 'linear-gradient(rgba(47, 87, 17, 1), rgba(120, 202, 17, 1), rgba(208, 229, 76, 1), rgba(47, 87, 17, 1))'
                              : 'rgba(223, 224, 222, 1)'
                          }`
                        }}
                      />
                    </Step>
                  );
                })}
            </Stepper>
          </div>
        </div>
      </Modal>
    </ChakraProvider>
  );
};

export default IbcRouting;

export const getIcons = (data: RoutingQueryItem): JSX.Element => {
  if (data.type === DatabaseEnum.Evm) {
    const evmChainPrefix = (data.data as EvmState).evmChainPrefix;
    if (evmChainPrefix === EvmChainPrefix.BSC_MAINNET) {
      return <BnbIcon />;
    }
    if (evmChainPrefix === EvmChainPrefix.ETH_MAINNET) {
      return <EthIcon />;
    }
    if (evmChainPrefix === EvmChainPrefix.TRON_MAINNET) {
      return <TronIcon />;
    }
  }
  if (data.type === DatabaseEnum.Cosmos) {
    const chainId = (data.data as CosmosState).chainId;
    if (chainId === COSMOS_CHAIN_ID_COMMON.COSMOSHUB_CHAIN_ID) {
      return <AtomIcon />;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.INJECTVE_CHAIN_ID) {
      return <InjIcon />;
    }
    if (chainId === COSMOS_CHAIN_ID_COMMON.OSMOSIS_CHAIN_ID) {
      return <OsmoIcon />;
    }
  }
  if (data.type === DatabaseEnum.Oraichain) {
    return <OraiIcon />;
  }
  return <OraiXIcon />;
};
