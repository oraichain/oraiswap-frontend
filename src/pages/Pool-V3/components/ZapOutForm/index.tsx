import { BigDecimal, toDisplay, TokenItemType, CW20_DECIMALS } from '@oraichain/oraidex-common';
import { FeeTier, PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { extractAddress, ZapOutLiquidityResponse } from '@oraichain/oraiswap-v3';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { getIcon, getTransactionUrl } from 'helper';
import { formatDisplayUsdt, numberWithCommas } from 'helper/format';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import styles from './index.module.scss';
import { oraichainTokens } from 'config/bridgeTokens';
import { USDT_CONTRACT, MULTICALL_CONTRACT } from '@oraichain/oraidex-common';
import { useGetPoolList } from 'pages/Pool-V3/hooks/useGetPoolList';
import { ZapConsumer } from '@oraichain/oraiswap-v3';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { network } from 'config/networks';
import { ReactComponent as OutputIcon } from 'assets/icons/zapOutput-ic.svg';
import { ReactComponent as UsdtIcon } from 'assets/icons/tether.svg';
import { useDebounce } from 'hooks/useDebounce';
import useZap from 'pages/Pool-V3/hooks/useZap';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import SelectToken from '../SelectToken';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames/bind';
import { getCosmWasmClient } from 'libs/cosmjs';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import TooltipHover from 'components/TooltipHover';

const cx = cn.bind(styles);

interface ZapOutFormProps {
  position: any;
  tokenFrom: TokenItemType;
  tokenTo: TokenItemType;
  slippage: number;
  showModal: boolean;
  incentives: { [key: string]: number };
  onCloseModal: () => void;
}

const TOKEN_ZAP = oraichainTokens.find((e) => extractAddress(e) === USDT_CONTRACT);

const ZapOutForm: FC<ZapOutFormProps> = ({
  incentives,
  showModal,
  position,
  tokenFrom,
  tokenTo,
  slippage,
  onCloseModal
}) => {
  const { data: geckoPrice } = useCoinGeckoPrices();
  const { poolPrice: prices } = useGetPoolList(geckoPrice);
  const loadOraichainToken = useLoadOraichainTokens();
  const navigate = useNavigate();
  const [walletAddress] = useConfigReducer('address');

  const theme = useTheme();
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tokenZap, setTokenZap] = useState<TokenItemType>(TOKEN_ZAP);
  const [zapAmount, setZapAmount] = useState<number | string>('');
  const [zapOutResponse, setZapOutResponse] = useState<ZapOutLiquidityResponse>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [toggleZapOut, setToggleZapOut] = useState(true);

  const debounceZapAmount = useDebounce(zapAmount, 800);

  const [focusId, setFocusId] = useState<'from' | 'to' | 'zapper' | null>(null);

  const [amountFrom, setAmountFrom] = useState<number | string>();
  const [amountTo, setAmountTo] = useState<number | string>();
  const fromUsd = (prices?.[tokenFrom?.coinGeckoId] * Number(amountFrom || 0)).toFixed(6);
  const toUsd = (prices?.[tokenTo?.coinGeckoId] * Number(amountTo || 0)).toFixed(6);

  const [swapFee, setSwapFee] = useState<number>(1.5);
  const [zapFee, setZapFee] = useState<number>(1);
  const [zapImpactPrice, setZapImpactPrice] = useState<number>(0.5);
  const [totalFee, setTotalFee] = useState<number>(1.75);

  const isLightTheme = theme === 'light';

  const TokenZapIcon =
    tokenZap &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenZap.coinGeckoId,
      width: 30,
      height: 30
    });

  const TokenFromIcon =
    tokenFrom &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenFrom.coinGeckoId,
      width: 30,
      height: 30
    });

  const TokenToIcon =
    tokenTo &&
    getIcon({
      isLightTheme,
      type: 'token',
      coinGeckoId: tokenTo.coinGeckoId,
      width: 30,
      height: 30
    });

  const [loading, setLoading] = useState<boolean>(false);

  const [isFromBlocked, setIsFromBlocked] = useState(false);
  const [isToBlocked, setIsToBlocked] = useState(false);

  const getButtonMessage = () => {
    if (toggleZapOut) {
      if (!walletAddress) {
        return 'Connect wallet';
      }

      if (toggleZapOut && zapOutResponse) {
        return 'Zap out';
      }

      if (!tokenZap) {
        return 'Select token';
      }

      if (simulating) {
        return 'Simulating...';
      }

      return 'Zap out';
    } else {
      if (!walletAddress) {
        return 'Connect wallet';
      }

      return 'Remove Position';
    }
  };

  const { zapOut } = useZap();

  // console.log("position", position);

  const handleZapOut = async () => {
    try {
      if (tokenZap && zapAmount) {
        setLoading(true);
        await zapOut(
          { tokenId: position.token_id, zapOutResponse },
          walletAddress,
          (tx: string) => {
            displayToast(TToastType.TX_SUCCESSFUL, {
              customLink: getTransactionUrl('Oraichain', tx)
            });
            // handleSuccessAdd();
            loadOraichainToken(walletAddress, [tokenFrom.contractAddress, tokenTo.contractAddress].filter(Boolean));
            onCloseModal();
            navigate(`/pools-v3?type=positions}`);
          },
          (e) => {
            displayToast(TToastType.TX_FAILED, {
              message: 'Zap Out failed!'
            });
          }
        );
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateZapOut = async () => {
    try {
      setSimulating(true);
      const zapper = new ZapConsumer({
        client: await CosmWasmClient.connect(network.rpc),
        devitation: 0.05,
        dexV3Address: network.pool_v3,
        multicallAddress: MULTICALL_CONTRACT,
        routerApi: 'https://osor.oraidex.io/smart-router/alpha-router',
        smartRouteConfig: {
          swapOptions: {
            protocols: ['OraidexV3'],
            maxSplits: 1
          }
        }
      });

      const res = await zapper.processZapOutPositionLiquidity({
        owner: walletAddress,
        tokenId: position.token_id,
        tokenOut: tokenZap
      });

      console.log('res', res);

      setZapOutResponse(res);
      setAmountFrom(Number(res.amountToX) / 10 ** tokenFrom.decimals + Number(res.amountToY) / 10 ** tokenTo.decimals);
      setSimulating(false);
    } catch (error) {
      // console.error(error);
      console.log('error', error);
      setSimulating(false);
    }
  };

  useEffect(() => {
    // console.log("debounceZapAmount", debounceZapAmount);
    if (toggleZapOut && showModal) {
      handleSimulateZapOut();
    }
  }, [showModal, tokenZap]);

  const receiveLiquidityTokens: {
    icon: JSX.Element;
    info: TokenItemType;
    amount: number;
  }[] = [];

  if (position) {
    receiveLiquidityTokens.push({
      icon: TokenFromIcon,
      info: tokenFrom,
      amount: position.tokenXLiq
    });
    receiveLiquidityTokens.push({
      icon: TokenToIcon,
      info: tokenTo,
      amount: position.tokenYLiq
    });
  }

  const receiveIncentiveTokens: {
    icon: JSX.Element;
    info: TokenItemType;
    amount: number;
  }[] = [];

  if (incentives) {
    Object.keys(incentives).forEach((key) => {
      const token = oraichainTokens.find((e) => extractAddress(e) === key);
      receiveIncentiveTokens.push({
        icon: getIcon({
          isLightTheme,
          type: 'token',
          coinGeckoId: token.coinGeckoId,
          width: 30,
          height: 30
        }),
        info: token,
        amount: incentives[key] / 10 ** token.decimals
      });
    });
  }

  return (
    <div className={styles.createPoolForm}>
      <div className={styles.options}>
        <button
          className={classNames(styles.btnOption, { [styles.activeBtn]: toggleZapOut })}
          onClick={() => setToggleZapOut(true)}
        >
          Zap In
          <span>NEW</span>
        </button>
        <button
          className={classNames(styles.btnOption, { [styles.activeBtn]: !toggleZapOut })}
          onClick={() => setToggleZapOut(false)}
        >
          Manual Deposit
        </button>
      </div>

      {toggleZapOut ? (
        <div>
          <div className={styles.tokenOutput}>
            <div className={styles.item}>
              <div className={styles.info}>
                <div>{TokenFromIcon}</div>
                <span>{tokenFrom.name}</span>
              </div>
              <div className={styles.value}>
                <span>{position.tokenXLiq}</span>
                <span className={styles.usd}>
                  ≈ {formatDisplayUsdt(prices[tokenFrom?.coinGeckoId] * position.tokenXLiq)}
                </span>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.info}>
                <div>{TokenToIcon}</div>
                <span>{tokenTo.name}</span>
              </div>
              <div className={styles.value}>
                <span>{position.tokenYLiq}</span>
                <span className={styles.usd}>
                  ≈ {formatDisplayUsdt(prices[tokenTo?.coinGeckoId] * position.tokenYLiq)}
                </span>
              </div>
            </div>
          </div>
          {simulating && (
            <div>
              <span style={{ fontStyle: 'italic', fontSize: 'small', color: 'white' }}>
                Finding best option to zap...
              </span>
            </div>
          )}
          <div className={styles.dividerOut}>
            <div className={styles.bar}></div>
            <div>
              <OutputIcon />
            </div>
            <div className={styles.bar}></div>
          </div>
          <div className={classNames(styles.itemInput, { [styles.disabled]: false })}>
            <div className={styles.balance}>
              <p className={styles.bal}>
                <span>Balance:</span> {numberWithCommas(toDisplay(amounts[tokenZap?.denom] || '0', tokenZap.decimals))}{' '}
                {tokenZap?.name}
              </p>
            </div>
            <div className={styles.tokenInfo}>
              <SelectToken
                token={tokenZap}
                handleChangeToken={(token) => {
                  setTokenZap(token);
                }}
                otherTokenDenom={tokenZap?.denom}
                customClassButton={styles.name}
              />
              <div className={styles.input}>
                {simulating && <div className={styles.mask} />}
                <NumberFormat
                  onFocus={() => setFocusId('zapper')}
                  onBlur={() => setFocusId(null)}
                  placeholder="0"
                  thousandSeparator
                  className={styles.amount}
                  decimalScale={tokenZap?.decimals || 6}
                  disabled={true}
                  type="text"
                  value={amountFrom}
                  onChange={() => {}}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    // allow !floatValue to let user can clear their input
                    return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                  }}
                  onValueChange={({ floatValue }) => {
                    setZapAmount(floatValue);
                  }}
                />
                <div className={styles.usd}>
                  ≈ ${amountFrom ? numberWithCommas(Number(fromUsd) || 0, undefined, { maximumFractionDigits: 6 }) : 0}
                </div>
              </div>
            </div>
          </div>
          {receiveIncentiveTokens.length > 0 && (
            <>
              <span className={styles.receiveType}>With incentives</span>
              <div className={styles.receiveToken}>
                {receiveIncentiveTokens.map((e, i) => (
                  <div className={styles.item} key={i}>
                    <div className={styles.info}>
                      <div>{e.icon}</div>
                      <span>{e.info.name}</span>
                    </div>
                    <div className={styles.value}>
                      <span>{e.amount}</span>
                      <span className={styles.usd}>≈ {formatDisplayUsdt(prices[e?.info?.coinGeckoId] * e.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {zapOutResponse && (
            <div className={styles.feeInfoWrapper}>
              <div className={styles.item}>
                <div className={styles.info}>
                  <span>Price Impact</span>
                </div>
                <div
                  className={cx(
                    'valueImpact',
                    `${zapImpactPrice >= 10 ? 'impact-medium' : zapImpactPrice >= 5 ? 'impact-high' : ''}`
                  )}
                >
                  <span>{zapImpactPrice}%</span>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.info}>
                  <span>Swap Fee</span>
                </div>
                <div className={styles.value}>
                  <span>{swapFee} %</span>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.info}>
                  <TooltipHover
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    content={<div>The amount of token you'll swap to provide liquidity.</div>}
                    position="right"
                    children={<span>Zap Fee</span>}
                  />
                </div>
                <div className={styles.value}>
                  <span>
                    {zapFee} {tokenZap.name}
                  </span>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.conclusion}>
                  <span>Total Fee</span>
                </div>
                <div className={styles.value}>
                  <span>${totalFee}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.manuallyWrapper}>
          <h3>You will receive these amount</h3>

          <span className={styles.receiveType}>Pool Liquidities</span>
          {receiveLiquidityTokens.length > 0 && (
            <div className={styles.receiveToken}>
              {receiveLiquidityTokens.map((e, i) => (
                <div className={styles.item} key={i}>
                  <div className={styles.info}>
                    <div>{e.icon}</div>
                    <span>{e.info.name}</span>
                  </div>
                  <div className={styles.value}>
                    <span>{e.amount}</span>
                    <span className={styles.usd}>≈ {formatDisplayUsdt(prices[e?.info.coinGeckoId] * e.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {receiveIncentiveTokens.length > 0 && (
            <>
              <span className={styles.receiveType}>Pool Incentives</span>
              <div className={styles.receiveToken}>
                {receiveIncentiveTokens.map((e, i) => (
                  <div className={styles.item} key={i}>
                    <div className={styles.info}>
                      <div>{e.icon}</div>
                      <span>{e.info.name}</span>
                    </div>
                    <div className={styles.value}>
                      <span>{e.amount}</span>
                      <span className={styles.usd}>≈ {formatDisplayUsdt(prices[e?.info.coinGeckoId] * e.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.btn}>
        {(() => {
          const btnText = getButtonMessage();
          return (
            <Button
              type="primary"
              disabled={
                loading || !walletAddress || !tokenZap || !(btnText === 'Zap out' || btnText === 'Remove Position')
              }
              onClick={async () => {
                if (toggleZapOut) {
                  await handleZapOut();
                  return;
                }

                try {
                  setLoading(true);
                  const { client } = await getCosmWasmClient({ chainId: network.chainId });
                  SingletonOraiswapV3.load(client, walletAddress);
                  const { transactionHash } = await SingletonOraiswapV3.dex.removePosition({
                    index: Number(position.id)
                  });

                  if (transactionHash) {
                    displayToast(TToastType.TX_SUCCESSFUL, {
                      customLink: getTransactionUrl(network.chainId, transactionHash)
                    });
                  }
                } catch (error) {
                  console.log({ error });
                  displayToast(TToastType.TX_FAILED, {
                    message: 'Remove position failed!'
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading && <Loader width={22} height={22} />}&nbsp;&nbsp;{btnText}
            </Button>
          );
        })()}
      </div>
    </div>
  );
};

export default ZapOutForm;
