import styles from './index.module.scss';
import ArrowImg from 'assets/icons/arrow_right.svg';

export const TooltipSwapBridge = ({
  type,
  pathChainId,
  tokenInChainId,
  tokenOutChainId,
  TokenInIcon,
  TokenOutIcon,
  NetworkFromIcon,
  NetworkToIcon,
  info
}) => {
  const isOraichain = (chainId) => chainId === 'Oraichain';
  return (
    <div className={styles.tooltipUniversalSwap}>
      <div className={styles.tooltipUniversalSwapType}>{type === 'Swap' ? pathChainId : 'IBC Transfer'}</div>

      <div className={styles.tooltipUniversalSwapRoutes}>
        <div className={styles.tooltipUniversalSwapRoute}>
          <div className={styles.tooltipUniversalSwapRouteImg}>
            {isOraichain(tokenInChainId) ? (
              TokenInIcon && <TokenInIcon width={40} height={40} />
            ) : (
              <img src={info?.tokenInInfo?.logo_URIs?.svg} width={45} height={45} alt="arrow" />
            )}
            <div className={styles.tooltipUniversalSwapRouteImgAbs}>
              <div>
                <NetworkFromIcon />
              </div>
            </div>
          </div>
          <div>{info?.tokenIn}</div>
        </div>
        <div>
          <img src={ArrowImg} width={26} height={26} alt="arrow" />
        </div>
        <div className={styles.tooltipUniversalSwapRoute}>
          <div className={styles.tooltipUniversalSwapRouteImg}>
            {isOraichain(type === 'Swap' ? tokenInChainId : tokenOutChainId) ? (
              TokenOutIcon && <TokenOutIcon width={40} height={40} />
            ) : (
              <img src={info?.tokenOutInfo?.logo_URIs?.svg} width={45} height={45} alt="arrow" />
            )}
            <div className={styles.tooltipUniversalSwapRouteImgAbs}>
              <div>{type === 'Swap' ? <NetworkFromIcon /> : <NetworkToIcon />}</div>
            </div>
          </div>
          <div>{info?.tokenOut}</div>
        </div>
      </div>
    </div>
  );
};
