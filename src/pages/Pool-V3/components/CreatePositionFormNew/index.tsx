import { oraichainTokens } from '@oraichain/oraidex-common';
import { ReactComponent as CustomIcon } from 'assets/icons/custom.svg';
import { ReactComponent as FullRangeIcon } from 'assets/icons/full-range.svg';
import { ReactComponent as NarrowIcon } from 'assets/icons/narrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-ccw.svg';
import { ReactComponent as WideIcon } from 'assets/icons/wide.svg';
import { ReactComponent as ZoomInIcon } from 'assets/icons/zoom-in.svg';
import { ReactComponent as ZoomOutIcon } from 'assets/icons/zoom-out.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import { getIcon } from 'helper';
import { numberWithCommas } from 'helper/format';
import useTheme from 'hooks/useTheme';
import useAddLiquidityNew, { OptionType } from 'pages/Pool-V3/hooks/useAddLiquidityNew';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import HistoricalChartDataWrapper from '../HistoricalChartDataWrapper';
import LiquidityChartWrapper from '../LiquidityChartWrapper';
import ManuallyAddLiquidity from '../ManuallyAddLiquidity';
import PriceDetail from '../PriceDetail';
import ZapInTab from '../ZapInTab';
import styles from './index.module.scss';

interface CreatePositionFormProps {
  poolId: string;
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const CreatePositionFormNew: FC<CreatePositionFormProps> = ({ poolId, slippage, showModal, onCloseModal }) => {
  const theme = useTheme();
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const [toggleZap, setToggleZap] = useState(false);

  const {
    tokenX,
    tokenY,
    historicalChartData,
    fullRange,
    xRange,
    yRange,
    currentPrice,
    liquidityChartData,
    hoverPrice,
    minPrice,
    maxPrice,
    historicalRange,
    isXToY,
    optionType,
    setOptionType,
    setHoverPrice,
    changeHistoricalRange,
    zoomIn,
    zoomOut,
    resetRange,
    setMinPrice,
    setMaxPrice,
    flipToken,
    swapBaseToX,
    swapBaseToY
  } = useAddLiquidityNew(poolId);

  const isLightTheme = theme === 'light';

  const renderTokenObj = (coinGeckoId, size: number = 30) => {
    return {
      isLightTheme,
      type: 'token' as any,
      coinGeckoId,
      width: size,
      height: size
    };
  };

  const TokenFromIcon = tokenX && getIcon(renderTokenObj(tokenX.coinGeckoId));
  const TokenToIcon = tokenY && getIcon(renderTokenObj(tokenY.coinGeckoId));

  // console.log({minPrice, maxPrice})

  return (
    <div className={styles.createPositionForm}>
      <div className={styles.infoTab}>
        <div className={styles.header}>
          <div className={styles.currentInfo}>
            <p className={styles.title}>Current pool price</p>
            {tokenX && tokenY && currentPrice && (
              <p className={styles.content}>
                {numberWithCommas(currentPrice, undefined, { maximumFractionDigits: 2 })}{' '}
                {isXToY ? `${tokenY.name} per ${tokenX.name}` : `${tokenX.name} per ${tokenY.name}`}
              </p>
            )}
          </div>
          {tokenX && tokenY && (
            <div className={styles.switchTokenWrapper}>
              <span onClick={swapBaseToX} className={classNames({ [styles.chosen]: isXToY })}>
                {tokenX.name}
              </span>
              <span onClick={swapBaseToY} className={classNames({ [styles.chosen]: !isXToY })}>
                {tokenY.name}
              </span>
            </div>
          )}
        </div>

        {/* <div className={styles.alert}>
          <div>
            <WarningIcon />
          </div>
          <span>
            Your position will not earn fees or be used in trades until the market price moves into your range.
          </span>
        </div> */}

        <div className={styles.actionWrapper}>
          <p className={styles.title}>Select Volatility Strategy</p>
          <div className={styles.strategyBtnList}>
            <div
              onClick={() => setOptionType(OptionType.CUSTOM)}
              className={classNames(styles.btn, { [styles.chosen]: optionType === OptionType.CUSTOM })}
            >
              <CustomIcon />
              <br />
              <span>Custom</span>
            </div>
            <div
              onClick={() => setOptionType(OptionType.WIDE)}
              className={classNames(styles.btn, { [styles.chosen]: optionType === OptionType.WIDE })}
            >
              <WideIcon />
              <br />
              <span>Wide</span>
            </div>
            <div
              onClick={() => setOptionType(OptionType.NARROW)}
              className={classNames(styles.btn, { [styles.chosen]: optionType === OptionType.NARROW })}
            >
              <NarrowIcon />
              <br />
              <span>Narrow</span>
            </div>
            <div
              onClick={() => setOptionType(OptionType.FULL_RANGE)}
              className={classNames(styles.btn, { [styles.chosen]: optionType === OptionType.FULL_RANGE })}
            >
              <FullRangeIcon />
              <br />
              <span>Full range</span>
            </div>
          </div>
          <div className={styles.explain}>
            <p>
              Add liquidity to a specific price range. Earns the most fees when the price stays in range but stops
              earning if the price moves out
            </p>
          </div>
        </div>

        <div className={styles.wrapChart}>
          <div className={styles.chartOptions}>
            <div className={styles.time}>
              <button
                className={classNames({ [styles.chosen]: historicalRange === '7d' })}
                onClick={() => changeHistoricalRange('7d')}
              >
                1W
              </button>
              <button
                className={classNames({ [styles.chosen]: historicalRange === '1mo' })}
                onClick={() => changeHistoricalRange('1mo')}
              >
                1M
              </button>
              <button
                className={classNames({ [styles.chosen]: historicalRange === '3mo' })}
                onClick={() => changeHistoricalRange('3mo')}
              >
                3M
              </button>
              <button
                className={classNames({ [styles.chosen]: historicalRange === '1y' })}
                onClick={() => changeHistoricalRange('1y')}
              >
                1Y
              </button>
            </div>

            <div className={styles.actions}>
              <RefreshIcon widths={60} onClick={resetRange} />
              <ZoomOutIcon widths={60} onClick={zoomOut} />
              <ZoomInIcon widths={60} onClick={zoomIn} />
            </div>
          </div>

          <div className={styles.chartContent}>
            {historicalChartData && yRange ? (
              <HistoricalChartDataWrapper
                hoverPrice={hoverPrice}
                tokenX={tokenX}
                tokenY={tokenY}
                historicalChartData={historicalChartData}
                fullRange={fullRange}
                yRange={yRange}
                addRange={[minPrice, maxPrice]}
                currentPrice={currentPrice}
                isXToY={isXToY}
                setHoverPrice={setHoverPrice}
                setHistoricalRange={changeHistoricalRange}
              />
            ) : (
              <span>Loading</span>
            )}

            {liquidityChartData && yRange && xRange ? (
              <LiquidityChartWrapper
                minPrice={minPrice}
                maxPrice={maxPrice}
                yRange={yRange}
                xRange={xRange}
                liquidityChartData={liquidityChartData}
                currentPrice={currentPrice}
                fullRange={fullRange}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                resetRange={resetRange}
              />
            ) : (
              <span>Loading</span>
            )}
          </div>
        </div>

        {minPrice && maxPrice && currentPrice && tokenX && tokenY ? (
          <PriceDetail
            leftInput={minPrice}
            rightInput={maxPrice}
            currentPrice={currentPrice}
            tokenX={tokenX}
            tokenY={tokenY}
            isXToY={isXToY}
          />
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className={styles.line}></div>

      <div className={styles.depositTab}>
        <div className={styles.depositInput}>
          <div className={styles.menuWrapper}>
            <button
              className={classNames(styles.btnOption, { [styles.activeBtn]: !toggleZap })}
              onClick={() => setToggleZap(false)}
            >
              Manual Deposit
            </button>
            <button
              className={classNames(styles.btnOption, { [styles.activeBtn]: toggleZap })}
              onClick={() => setToggleZap(true)}
            >
              Zap In
              <span>NEW</span>
            </button>
          </div>

          {toggleZap ? (
            <div className={styles.zapWrapper}>
              <ZapInTab
                amounts={amounts}
                endRef={null}
                isVisible={true}
                matchRate={0}
                setFocusId={() => {}}
                setIsVisible={() => {}}
                setTokenZap={() => {}}
                setZapAmount={() => {}}
                simulating={false}
                swapFee={0}
                tokenFrom={tokenX}
                tokenFromIcon={TokenFromIcon}
                tokenTo={tokenY}
                tokenToIcon={TokenToIcon}
                tokenZap={oraichainTokens.find((token) => token.name === 'USDT')}
                zapAmount={0}
                totalFee={0}
                xUsd={0}
                yUsd={0}
                zapError={null}
                zapFee={0}
                zapImpactPrice={0}
                zapInResponse={null}
                zapUsd={0}
              />
            </div>
          ) : (
            <div className={styles.manuallyWrapper}>
              {tokenX && tokenY && (
                <ManuallyAddLiquidity
                  TokenFromIcon={TokenFromIcon}
                  TokenToIcon={TokenToIcon}
                  amountFrom={0}
                  amountTo={0}
                  amounts={amounts}
                  fromUsd={0}
                  toUsd={0}
                  isFromBlocked={false}
                  isToBlocked={false}
                  setAmountFrom={() => {}}
                  setAmountTo={() => {}}
                  setFocusId={() => {}}
                  tokenFrom={tokenX}
                  tokenTo={tokenY}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.submit}>
          {(() => {
            const btnText = 'Create new position';
            return (
              <Button
                onClick={() => {}}
                type="primary"
                // disabled={
                //   loading ||
                //   !walletAddress ||
                //   !(btnText === 'Zap in' || btnText === 'Create new position') ||
                //   !!zapError
                //   // true
                // }
                // onClick={async () => {
                //   const lowerTick = Math.min(leftRange, rightRange);
                //   const upperTick = Math.max(leftRange, rightRange);
                //   const poolKeyData = newPoolKey(extractDenom(tokenFrom), extractDenom(tokenTo), feeTier);

                //   if (toggleZapIn) {
                //     await handleZapIn();
                //     return;
                //   }

                //   await addLiquidity({
                //     poolKeyData,
                //     lowerTick: lowerTick,
                //     upperTick: upperTick,
                //     liquidityDelta: liquidityRef.current,
                //     spotSqrtPrice: isPoolExist
                //       ? BigInt(poolData.pool?.sqrt_price || 0)
                //       : calculateSqrtPrice(midPrice.index),
                //     slippageTolerance: BigInt(slippage),
                //     tokenXAmount:
                //       poolKeyData.token_x === extractAddress(tokenFrom)
                //         ? BigInt(Math.round(Number(amountFrom) * 10 ** (tokenFrom.decimals || 6)))
                //         : BigInt(Math.round(Number(amountTo) * 10 ** (tokenTo.decimals || 6))),
                //     tokenYAmount:
                //       poolKeyData.token_y === extractAddress(tokenFrom)
                //         ? BigInt(Math.round(Number(amountFrom) * 10 ** (tokenFrom.decimals || 6)))
                //         : BigInt(Math.round(Number(amountTo) * 10 ** (tokenTo.decimals || 6))),
                //     initPool: !isPoolExist
                //   });
                // }}
              >
                {/* {loading && <Loader width={22} height={22} />}&nbsp;&nbsp; */}
                {btnText}
              </Button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CreatePositionFormNew;
