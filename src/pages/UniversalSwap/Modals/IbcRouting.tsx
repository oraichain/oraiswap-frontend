import {
  ChakraProvider,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  extendTheme,
  useSteps
} from '@chakra-ui/react';
import { COSMOS_CHAIN_ID_COMMON } from '@oraichain/oraidex-common';
import ArrowImg from 'assets/icons/arrow_right.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraiLightIcon } from 'assets/icons/oraichain_light.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning_icon.svg';
import classNames from 'classnames';
import Modal from 'components/Modal';
import { ICON_WITH_NETWORK, chainInfosWithIcon, flattenTokensWithIcon } from 'config/chainInfos';
import { CosmosState, DatabaseEnum, EvmState, RoutingQueryItem, StateDBStatus } from 'config/ibc-routing';
import useTheme from 'hooks/useTheme';
import { TransactionHistory } from 'libs/duckdb';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import React, { useEffect, useState } from 'react';
import TimelineDetail, { TimelineType } from '../Component/TimelineDetail';
import useGetPriceImpact from '../hooks/useGetPriceImpact';
import { useGetRoutingData } from '../hooks/useGetRoutingData';
import styles from './IbcRouting.module.scss';

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
  });
  const [routingFinished, setRoutingFinished] = useState(false);

  const routingData = useGetRoutingData({
    txHash: data.initialTxHash,
    chainId: data.fromChainId
  });

  const { impactWarning } = useGetPriceImpact({ data });

  useEffect(() => {
    if (!routingData) return;

    const routingDataLength = routingData.length;

    setActiveStep(routingDataLength);

    const pendingItems = routingData.filter((item: any) => item.data.status === StateDBStatus.PENDING);
    if (pendingItems.length === 0 && routingDataLength !== 0) {
      setRoutingFinished(true);
    }
  }, [routingData]);

  const getTimelineState = (data: RoutingQueryItem): TimelineType => {
    if (data.data.status === StateDBStatus.PENDING) return TimelineType.WAITING;
    if (data.data.status === StateDBStatus.FINISHED) return TimelineType.CONFIRMED;
    return TimelineType.INACTIVE;
  };

  const [fromToken, toToken] = [
    flattenTokensWithIcon.find((token) => token.coinGeckoId === data.fromCoingeckoId),
    flattenTokensWithIcon.find((token) => token.coinGeckoId === data.toCoingeckoId)
  ];
  if (!fromToken || !toToken) return <></>;

  const [fromChain, toChain] = [
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === data.fromChainId),
    chainInfosWithIcon.find((chainInfo) => chainInfo.chainId === data.toChainId)
  ];
  if (!fromChain || !toChain) return <></>;

  return (
    <ChakraProvider disableGlobalStyle={false} theme={chakraTheme}>
      <Modal
        isOpen={true}
        close={close}
        open={() => {}}
        isCloseBtn={false}
        className={classNames(styles.ibcModal, `${styles[theme]}`, styles.modal)}
      >
        <div className={styles.modalWrapper}>
          <div className={styles.header}>
            <div className={styles.title}>Order Routing</div>
            <div onClick={close} className={styles.closeIcon}>
              <CloseIcon />
            </div>
          </div>
          <div className={styles.headerDetail}>
            <div className={styles.swap}>
              <div className={styles.from}>
                <div className={styles.list}>
                  <div className={styles.img}>
                    {theme === 'light' ? (
                      <fromToken.IconLight width={26} height={26} />
                    ) : (
                      <fromToken.Icon width={26} height={26} />
                    )}
                    <div className={styles.imgChain}>
                      {theme === 'light' ? (
                        <fromChain.IconLight width={14} height={14} />
                      ) : (
                        <fromChain.Icon width={14} height={14} />
                      )}
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.subBalance}>
                      {'-'}
                      {numberWithCommas(Number(data.fromAmount), undefined, { maximumFractionDigits: 6 })}

                      <span className={styles.denom}>{fromToken.name}</span>
                    </div>
                    <div className={styles.timestamp}>{formatDisplayUsdt(data.fromAmountInUsdt)}</div>
                  </div>
                </div>
              </div>
              <div className={styles.icon}>
                <img src={ArrowImg} width={26} height={26} alt="filter" />
              </div>
              <div className={styles.to}>
                <div className={styles.list}>
                  <div className={styles.img}>
                    {theme === 'light' ? (
                      <toToken.IconLight width={26} height={26} />
                    ) : (
                      <toToken.Icon width={26} height={26} />
                    )}
                    <div className={styles.imgChain}>
                      {theme === 'light' ? (
                        <toChain.IconLight width={14} height={14} />
                      ) : (
                        <toChain.Icon width={14} height={14} />
                      )}
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.addBalance}>
                      {'≈'}
                      {numberWithCommas(Number(data.toAmount), undefined, { maximumFractionDigits: 6 })}

                      <span className={styles.denom}>{toToken.name}</span>
                    </div>
                    <div className={styles.timestamp}>≈{formatDisplayUsdt(data.toAmountInUsdt)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.price}>
              <div className={styles.impact}>
                <span>Price Impact: </span>
                <span
                  className={classNames(styles.valueImpact, {
                    [styles.warningTen]: Number(impactWarning) > 10,
                    [styles.warningFive]: Number(impactWarning) > 5
                  })}
                >
                  {Number(impactWarning) > 5 && <WarningIcon />} ≈{' '}
                  {numberWithCommas(impactWarning, undefined, { minimumFractionDigits: 2 })}%
                </span>
              </div>
            </div>
          </div>

          <div className={styles.stepperWrapper}>
            <Stepper size="lg" colorScheme={borderColor} index={activeStep} orientation="vertical" gap="2">
              {routingData &&
                routingData.map((item: any, index) => {
                  const Icon = getIcons(item, theme);

                  return (
                    <Step key={index} style={{ width: '100%', gap: '16px' }}>
                      <StepIndicator>
                        <StepStatus complete={<Icon />} incomplete={<Icon opacity={0.5} />} active={<Icon />} />
                      </StepIndicator>

                      <TimelineDetail
                        type={getTimelineState(item)}
                        data={item}
                        lastIndex={index + 1 === activeStep}
                        historyData={data}
                      />

                      <StepSeparator className={classNames(styles.separator, { hasAnimation: !routingFinished })} />
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

export const getIcons = (data: RoutingQueryItem, theme: 'light' | 'dark') => {
  let Icon = {
    Icon: OraiIcon,
    IconLight: OraiLightIcon
  };

  switch (data.type) {
    case DatabaseEnum.Evm:
      const evmChainPrefix = (data.data as EvmState).evmChainPrefix;

      Icon = ICON_WITH_NETWORK[evmChainPrefix];
      break;
    case DatabaseEnum.Cosmos:
      const chainId = (data.data as CosmosState).chainId;
      Icon = ICON_WITH_NETWORK[chainId];
      break;
    case DatabaseEnum.Oraichain:
      Icon = ICON_WITH_NETWORK[COSMOS_CHAIN_ID_COMMON.ORAICHAIN_CHAIN_ID];
      break;

    default:
      Icon = ICON_WITH_NETWORK[COSMOS_CHAIN_ID_COMMON.ORAICHAIN_CHAIN_ID];
      break;
  }

  return theme === 'light' ? Icon.IconLight || Icon.Icon : Icon.Icon;
};
