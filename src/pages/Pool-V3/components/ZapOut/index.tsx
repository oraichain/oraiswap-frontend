import { toDisplay, TokenItemType } from '@oraichain/oraidex-common';
import { FeeTier, PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { ReactComponent as OpenBlankTabIcon } from 'assets/icons/arrow_right_ic.svg';
import { ReactComponent as BackIcon } from 'assets/icons/back.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/setting.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import { ALL_FEE_TIERS_DATA } from 'libs/contractSingleton';
import { useCallback, useMemo, useRef, useState } from 'react';
import CreatePositionForm from '../CreatePositionForm';
import { extractDenom } from '../PriceRangePlot/utils';
import SelectToken from '../SelectToken';
import styles from './index.module.scss';
import SlippageSetting from '../SettingSlippage';
import { oraichainTokens } from 'config/bridgeTokens';
import { extractAddress } from '@oraichain/oraiswap-v3';
import ZapOutForm from '../ZapOutForm';
import { useGetPositions } from 'pages/Pool-V3/hooks/useGetPosition';
import useConfigReducer from 'hooks/useConfigReducer';

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

const ZapOut = ({ position, incentives }: { position: any; incentives: { [key: string]: number } }) => {
  const [walletAddress] = useConfigReducer('address');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const refContent = useRef();
  const { refetchPositions } = useGetPositions(walletAddress);

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.createNewPool}>
      <div className={styles.btnAdd}>
        <Button type="third-sm" onClick={() => setShowModal(true)}>
          Remove Position
        </Button>
      </div>

      <div
        onClick={() => setShowModal(false)}
        className={classNames(styles.overlay, { [styles.activeOverlay]: showModal })}
      ></div>
      <div className={classNames(styles.modalWrapper, { [styles.activeModal]: showModal })}>
        <div className={styles.contentWrapper} ref={refContent}>
          <div className={styles.header}>
            <div>Remove Position</div>
            <div className={styles.headerActions}>
              <div className={styles.setting}>
                <SettingIcon onClick={() => setIsOpen(true)} />
                <SlippageSetting isOpen={isOpen} setIsOpen={setIsOpen} setSlippage={setSlippage} slippage={slippage} />
              </div>
              <div onClick={() => onCloseModal()}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <ZapOutForm
            showModal={showModal}
            onCloseModal={async () => {
              setShowModal(false);
              await refetchPositions();
            }}
            slippage={1}
            tokenFrom={position.tokenX}
            tokenTo={position.tokenY}
            position={position}
            incentives={incentives}
          />
        </div>
      </div>
    </div>
  );
};

export default ZapOut;
