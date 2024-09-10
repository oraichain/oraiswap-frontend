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

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

const CreateNewPosition = ({ pool }: { pool: PoolWithPoolKey }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const refContent = useRef();

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.createNewPool}>
      <div className={styles.btnAdd}>
        <Button type="primary-sm" onClick={() => setShowModal(true)}>
          Add Postion
        </Button>
      </div>

      <div
        onClick={() => setShowModal(false)}
        className={classNames(styles.overlay, { [styles.activeOverlay]: showModal })}
      ></div>
      <div className={classNames(styles.modalWrapper, { [styles.activeModal]: showModal })}>
        <div className={styles.contentWrapper} ref={refContent}>
          <div className={styles.header}>
            <div>
              
            </div>
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
          <CreatePositionForm
            slippage={slippage}
            tokenFrom={oraichainTokens.find((e) => extractAddress(e) === pool.pool_key.token_x)}
            tokenTo={oraichainTokens.find((e) => extractAddress(e) === pool.pool_key.token_y)}
            feeTier={pool.pool_key.fee_tier}
            poolData={pool}
            onCloseModal={onCloseModal}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNewPosition;
