import { CW20_DECIMALS, oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as CustomIcon } from 'assets/icons/custom.svg';
import { ReactComponent as FullRangeIcon } from 'assets/icons/full-range.svg';
import { ReactComponent as NarrowIcon } from 'assets/icons/narrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-ccw.svg';
import { ReactComponent as WideIcon } from 'assets/icons/wide.svg';
import { ReactComponent as ZoomInIcon } from 'assets/icons/zoom-in.svg';
import { ReactComponent as ZoomOutIcon } from 'assets/icons/zoom-out.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import { getIcon, getTransactionUrl } from 'helper';
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
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import useConfigReducer from 'hooks/useConfigReducer';
import { extractAddress, newPoolKey, poolKeyToString } from '@oraichain/oraiswap-v3';
import { extractDenom } from '../PriceRangePlot/utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/Loader';
import { useGetFeeDailyData } from 'pages/Pool-V3/hooks/useGetFeeDailyData';

interface CreatePositionFormProps {
  poolId: string;
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const CreatePositionFormNew: FC<CreatePositionFormProps> = ({ poolId, slippage, showModal, onCloseModal }) => {
  const theme = useTheme();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const { poolList, poolPrice: extendPrices } = useGetPoolList(prices);
  const [walletAddress] = useConfigReducer('address');
  const loadOraichainToken = useLoadOraichainTokens();
  const navigate = useNavigate();
  const { feeDailyData } = useGetFeeDailyData();

  const [toggleZap, setToggleZap] = useState(false);

  const {
    pool,
    poolKey,
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
    amountX,
    amountY,
    isXBlocked,
    isYBlocked,
    focusId,
    liquidity,
    loading,
    lowerTick,
    higherTick,
    apr,
    addLiquidity,
    changeRangeHandler,
    setAmountX,
    setAmountY,
    setFocusId,
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
  } = useAddLiquidityNew(poolId, slippage, extendPrices, feeDailyData);

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

  const fromUsd = extendPrices?.[tokenX?.coinGeckoId]
    ? (extendPrices[tokenX.coinGeckoId] * Number(amountX || 0)).toFixed(6)
    : '0';
  const toUsd = extendPrices?.[tokenY?.coinGeckoId]
    ? (extendPrices[tokenY.coinGeckoId] * Number(amountY || 0)).toFixed(6)
    : '0';

  // const xUsd =
  //   // zapInResponse &&
  //   ((extendPrices?.[tokenX?.coinGeckoId] * (amountX || 0)) / 10 ** tokenX.decimals).toFixed(6);
  // const yUsd =
  //   // zapInResponse &&
  //   ((extendPrices?.[tokenY?.coinGeckoId] * (amountY || 0)) / 10 ** tokenY.decimals).toFixed(6);

  const getButtonMessage = () => {
    if (!walletAddress) {
      return 'Connect wallet';
    }

    if (!toggleZap) {
      const isInsufficientTo =
        amountY && Number(amountY) > toDisplay(amounts[tokenY?.denom], tokenY?.decimals || CW20_DECIMALS);
      const isInsufficientFrom =
        amountX && Number(amountX) > toDisplay(amounts[tokenX?.denom], tokenX?.decimals || CW20_DECIMALS);

      if (!tokenX || !tokenY) {
        return 'Select tokens';
      }

      if (tokenX?.denom === tokenY?.denom) {
        return 'Select different tokens';
      }

      if (isInsufficientFrom) {
        return `Insufficient ${tokenX.name.toUpperCase()}`;
      }

      if (isInsufficientTo) {
        return `Insufficient ${tokenY.name.toUpperCase()}`;
      }

      if ((!isXBlocked && (!amountX || +amountX === 0)) || (!isYBlocked && (!amountY || +amountY === 0))) {
        return 'Liquidity must be greater than 0';
      }
      return 'Create new position';
    }
    // else {
    //   const isInsufficientZap =
    //     zapAmount && Number(zapAmount) > toDisplay(amounts[tokenZap.denom], tokenZap.decimals || CW20_DECIMALS);

    //   if (!tokenZap) {
    //     return 'Select token';
    //   }

    //   if (!zapAmount || +zapAmount === 0) {
    //     return 'Zap amount must be greater than 0';
    //   }

    //   if (simulating) {
    //     return 'Simulating';
    //   }

    //   if (isInsufficientZap) {
    //     return `Insufficient ${tokenZap.name.toUpperCase()}`;
    //   }

    //   return 'Zap in';
    // }
  };

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
                  apr={apr} //
                  TokenFromIcon={TokenFromIcon} //
                  TokenToIcon={TokenToIcon} //
                  amountFrom={amountX} //
                  amountTo={amountY} //
                  amounts={amounts} //
                  fromUsd={fromUsd} //
                  toUsd={toUsd} //
                  isFromBlocked={isXBlocked} //
                  isToBlocked={isYBlocked} //
                  setAmountFrom={setAmountX} //
                  setAmountTo={setAmountY} //
                  setFocusId={setFocusId} //
                  tokenFrom={tokenX} //
                  tokenTo={tokenY} //
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.submit}>
          {(() => {
            const btnText = getButtonMessage();
            return (
              <Button
                // onClick={() => {}}
                type="primary"
                disabled={
                  loading || !walletAddress || !(btnText === 'Zap in' || btnText === 'Create new position')
                  // !!zapError
                  // true
                }
                onClick={async () => {
                  // const lowerTickIndex = Math.min(leftRange, rightRange);
                  // const upperTickIndex = Math.max(leftRange, rightRange);
                  // const poolKeyData = newPoolKey(extractDenom(tokenX), extractDenom(tokenY), poolKey);

                  // if (toggleZapIn) {
                  //   await handleZapIn();
                  //   return;
                  // }

                  await addLiquidity({
                    data: {
                      poolKeyData: poolKey,
                      lowerTick: lowerTick,
                      upperTick: higherTick,
                      liquidityDelta: liquidity,
                      spotSqrtPrice: BigInt(pool?.sqrt_price),
                      slippageTolerance: BigInt(slippage),
                      tokenXAmount:
                        poolKey.token_x === extractAddress(tokenX)
                          ? BigInt(Math.round(Number(amountX) * 10 ** (tokenX.decimals || 6)))
                          : BigInt(Math.round(Number(amountY) * 10 ** (tokenY.decimals || 6))),
                      tokenYAmount:
                        poolKey.token_y === extractAddress(tokenX)
                          ? BigInt(Math.round(Number(amountX) * 10 ** (tokenX.decimals || 6)))
                          : BigInt(Math.round(Number(amountY) * 10 ** (tokenY.decimals || 6))),
                      initPool: false
                    },
                    walletAddress,
                    callBackSuccess: (tx: string) => {
                      displayToast(TToastType.TX_SUCCESSFUL, {
                        customLink: getTransactionUrl('Oraichain', tx)
                      });
                      // handleSuccessAdd();
                      loadOraichainToken(
                        walletAddress,
                        [tokenX.contractAddress, tokenY.contractAddress].filter(Boolean)
                      );
                      onCloseModal();
                      navigate(`/pools/v3/${encodeURIComponent(poolKeyToString(poolKey))}`);
                    },
                    callBackFailed: (e) => {
                      console.log({ errorZap: e });
                      displayToast(TToastType.TX_FAILED, {
                        message: 'Add liquidity failed!'
                      });
                    }
                  });
                }}
              >
                {loading && <Loader width={22} height={22} />}&nbsp;&nbsp;
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
