import { PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { extractAddress } from '@oraichain/oraiswap-v3';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import classNames from 'classnames';
import TooltipHover from 'components/TooltipHover';
import { oraichainTokens } from 'config/bridgeTokens';
import { getIcon } from 'helper';
import useTheme from 'hooks/useTheme';
import { ReactElement, useRef, useState } from 'react';
import CreatePositionForm from '../CreatePositionForm';
import styles from './index.module.scss';
import cn from 'classnames/bind';
import { Button, ButtonType } from 'components/Button';

const cx = cn.bind(styles);
export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

const CreateNewPosition = ({
  pool,
  showModal,
  setShowModal
}: {
  pool: PoolWithPoolKey;
  showModal?: boolean;
  setShowModal?: (isModal: boolean) => void;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [slippage, setSlippage] = useState(1);
  const refContent = useRef();
  const theme = useTheme();

  const onCloseModal = () => {
    setShowModal(false);
  };

  const tokenFrom = oraichainTokens.find((e) => extractAddress(e) === pool.pool_key.token_x);
  const tokenTo = oraichainTokens.find((e) => extractAddress(e) === pool.pool_key.token_y);

  const isLightTheme = theme === 'light';
  const TokenFromIcon =
    tokenFrom &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenFrom.coinGeckoId,
      width: 20,
      height: 20
    });

  const TokenToIcon =
    tokenTo &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenTo.coinGeckoId,
      width: 20,
      height: 20
    });

  return (
    <div className={classNames(styles.createNewPool, { [styles.activeWrapper]: showModal })}>
      <div
        onClick={() => setShowModal(false)}
        className={classNames(styles.overlay, { [styles.activeOverlay]: showModal })}
      ></div>
      <div className={classNames(styles.modalWrapper, { [styles.activeModal]: showModal })}>
        <div className={styles.contentWrapper} ref={refContent}>
          <div className={styles.header}>
            <div>
              <div className={classNames(styles.icons, styles[theme])}>
                {TokenFromIcon}
                {TokenToIcon}
              </div>
              <TooltipHover
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                content={
                  <div>
                    <div className={classNames(styles.infoPool, styles[theme])}>
                      <div className={classNames(styles.infoPoolName)}>
                        {tokenFrom.name} / {tokenTo.name}
                        <span>v3</span>
                      </div>
                      <div className={styles.infoPoolfee}>
                        <span>Fee: {Number(pool.pool_key.fee_tier.fee) / 10 ** 10}%</span>
                      </div>
                      <div className={styles.infoPoolfee}>
                        <span>0.01% Spread</span>
                      </div>
                    </div>
                    <div className={classNames(styles.infoMarket)}>Market ID: orai13r0p...00000-100</div>
                  </div>
                }
                position="bottom"
                children={
                  <span>
                    {tokenFrom.name} / {tokenTo.name}
                  </span>
                }
              />

              <div className={styles.feeInfo}>Fee: {Number(pool.pool_key.fee_tier.fee) / 10 ** 10}%</div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.setting}>
                {/* <SettingIcon onClick={() => setIsOpen(true)} /> */}
                {/* <SlippageSetting isOpen={isOpen} setIsOpen={setIsOpen} setSlippage={setSlippage} slippage={slippage} /> */}
              </div>
              <div onClick={() => onCloseModal()}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <CreatePositionForm
            showModal={showModal}
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
