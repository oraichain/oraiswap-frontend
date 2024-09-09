import { BigDecimal, toDisplay, TokenItemType, CW20_DECIMALS } from '@oraichain/oraidex-common';
import { FeeTier, PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { extractAddress, ZapOutLiquidityResponse } from '@oraichain/oraiswap-v3';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { getIcon, getTransactionUrl } from 'helper';
import { numberWithCommas } from 'helper/format';
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

interface ZapOutFormProps {
  position: any;
  tokenFrom: TokenItemType;
  tokenTo: TokenItemType;
  slippage: number;
  showModal: boolean;
  onCloseModal: () => void;
}

const TOKEN_ZAP = oraichainTokens.find((e) => extractAddress(e) === USDT_CONTRACT);

const ZapOutForm: FC<ZapOutFormProps> = ({ showModal, position, tokenFrom, tokenTo, slippage, onCloseModal }) => {
  const { data: geckoPrice } = useCoinGeckoPrices();
  const { poolPrice: prices } = useGetPoolList(geckoPrice);
  const loadOraichainToken = useLoadOraichainTokens();
  // const navigate = useNavigate();
  const [walletAddress] = useConfigReducer('address');

  const theme = useTheme();
  const amounts = useSelector((state: RootState) => state.token.amounts);

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
    const isInsufficientTo =
      amountTo && Number(amountTo) > toDisplay(amounts[tokenTo.denom], tokenTo.decimals || CW20_DECIMALS);
    const isInsufficientFrom =
      amountFrom && Number(amountFrom) > toDisplay(amounts[tokenFrom.denom], tokenFrom.decimals || CW20_DECIMALS);

    if (!walletAddress) {
      return 'Connect wallet';
    }

    if (toggleZapOut && zapOutResponse) {
      return 'Zap out';
    }

    if (!tokenFrom || !tokenTo) {
      return 'Select tokens';
    }

    if (tokenFrom.denom === tokenTo.denom) {
      return 'Select different tokens';
    }

    if (isInsufficientFrom) {
      return `Insufficient ${tokenFrom.name.toUpperCase()}`;
    }

    if (isInsufficientTo) {
      return `Insufficient ${tokenTo.name.toUpperCase()}`;
    }

    if ((!isFromBlocked && (!amountFrom || +amountFrom === 0)) || (!isToBlocked && (!amountTo || +amountTo === 0))) {
      return 'Liquidity must be greater than 0';
    }
    return 'Create new pool';
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
            // navigate(`/pools-v3/${encodeURIComponent(poolKeyToString(notInitPoolKey))}`);
          },
          (e) => {
            displayToast(TToastType.TX_FAILED, {
              message: 'Add liquidity failed!'
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
  }, [showModal]);

  return (
    <div className={styles.createPoolForm}>
      <div className={styles.options}>
        <button onClick={() => setToggleZapOut(true)}>
          Zap Out
          <span>NEW</span>
        </button>
        <button onClick={() => setToggleZapOut(false)}>Manual Remove</button>
      </div>
      <div>
        <div className={styles.tokenOutput}>
          <div className={styles.item}>
            <div className={styles.info}>
              <div>{TokenFromIcon}</div>
              <span>{tokenFrom.name}</span>
            </div>
            <div className={styles.value}>
              <span>{position.tokenXLiq}</span>
              <span className={styles.usd}>≈ $0</span>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.info}>
              <div>{TokenToIcon}</div>
              <span>{tokenTo.name}</span>
            </div>
            <div className={styles.value}>
              <span>{position.tokenYLiq}</span>
              <span className={styles.usd}>≈ $0</span>
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
            <div className={styles.name}>
              {TokenZapIcon ? (
                <>
                  {TokenZapIcon}
                  &nbsp;{tokenZap.name}
                </>
              ) : (
                'Select Token'
              )}
            </div>
            <div className={styles.input}>
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
      </div>

      <div className={styles.btn}>
        {(() => {
          const btnText = getButtonMessage();
          return (
            <Button
              type="primary"
              disabled={false}
              onClick={async () => {
                if (toggleZapOut) {
                  await handleZapOut();
                  return;
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
