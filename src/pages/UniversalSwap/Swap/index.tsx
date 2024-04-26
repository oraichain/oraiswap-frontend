import {
  BigDecimal,
  DEFAULT_SLIPPAGE,
  NetworkChainId,
  TRON_DENOM,
  calculateMinReceive,
  network,
  toAmount
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import ArrowImg from 'assets/icons/arrow_new.svg';
import { ReactComponent as BookIcon } from 'assets/icons/book_icon.svg';
import { ReactComponent as FeeIcon } from 'assets/icons/fee.svg';
import { ReactComponent as FeeDarkIcon } from 'assets/icons/fee_dark.svg';
import { ReactComponent as IconOirSettings } from 'assets/icons/iconoir_settings.svg';
import { ReactComponent as SendIcon } from 'assets/icons/send.svg';
import { ReactComponent as SendDarkIcon } from 'assets/icons/send_dark.svg';
import SwitchLightImg from 'assets/icons/switch-new-light.svg';
import SwitchDarkImg from 'assets/icons/switch-new.svg';
import { ReactComponent as RefreshImg } from 'assets/images/refresh.svg';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import LoadingBox from 'components/LoadingBox';
import { tokenMap } from 'config/bridgeTokens';
import { chainInfosWithIcon } from 'config/chainInfos';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useCopyClipboard } from 'hooks/useCopyClipboard';
import useLoadTokens from 'hooks/useLoadTokens';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useTokenFee, { useGetFeeConfig, useRelayerFeeToken } from 'hooks/useTokenFee';
import useWalletReducer from 'hooks/useWalletReducer';
import { reduceString } from 'libs/utils';
import { numberWithCommas } from 'pages/Pools/helpers';
import {
  generateNewSymbol,
  getDisableSwap,
  getFromToToken,
  getRemoteDenom,
  refreshBalances
} from 'pages/UniversalSwap/helpers';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAddressBookStep, setCurrentAddressBookStep } from 'reducer/addressBook';
import { selectCurrentToken, setCurrentToken } from 'reducer/tradingSlice';
import { AddressManagementStep } from 'reducer/type';
import { fetchTokenInfos } from 'rest/api';
import { RootState } from 'store/configure';
import { SlippageModal } from '../Modals';
import AddressBook from './components/AddressBook';
import InputCommon from './components/InputCommon';
import InputSwap from './components/InputSwap/InputSwap';
import SelectChain from './components/SelectChain/SelectChain';
import SelectToken from './components/SelectToken/SelectToken';
import SwapDetail from './components/SwapDetail';
import { useSimulate } from './hooks';
import useAddressTransfer from './hooks/useAddressTransfer';
import useFilteredTokens from './hooks/useFilteredTokens';
import { useGetPriceByUSD } from './hooks/useGetPriceByUSD';
import useHandleSwapAction from './hooks/useHandleSwapAction';
import { useSwapFee } from './hooks/useSwapFee';
import styles from './index.module.scss';

const cx = cn.bind(styles);

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: (denoms: [string, string]) => void;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  const [openDetail, setOpenDetail] = useState(false);

  const [isSelectChainFrom, setIsSelectChainFrom] = useState(false);
  const [isSelectChainTo, setIsSelectChainTo] = useState(false);

  const { data: prices } = useCoinGeckoPrices();

  const [openSetting, setOpenSetting] = useState(false);
  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');
  const loadTokenAmounts = useLoadTokens();
  const dispatch = useDispatch();
  const [searchTokenName, setSearchTokenName] = useState('');
  const currentPair = useSelector(selectCurrentToken);
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const currentAddressManagementStep = useSelector(selectCurrentAddressBookStep);
  const { handleReadClipboard } = useCopyClipboard();

  const [fromTokenDenomSwap, setFromTokenDenom] = useState(fromTokenDenom);
  const [toTokenDenomSwap, setToTokenDenom] = useState(toTokenDenom);

  // get token on oraichain to simulate swap amount.
  const originalFromToken = tokenMap[fromTokenDenomSwap];
  const originalToToken = tokenMap[toTokenDenomSwap];

  const remoteTokenDenomFrom = getRemoteDenom(originalFromToken);
  const remoteTokenDenomTo = getRemoteDenom(originalToToken);
  const INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT = 0.00001;
  const isFromBTC = originalFromToken.coinGeckoId === 'bitcoin';
  let INIT_AMOUNT = 1;
  if (isFromBTC) INIT_AMOUNT = INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT;

  useGetFeeConfig();

  const { fromToken, toToken } = getFromToToken(
    originalFromToken,
    originalToToken,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

  const fromTokenFee = useTokenFee(remoteTokenDenomFrom, fromToken.chainId, toToken.chainId);
  const toTokenFee = useTokenFee(remoteTokenDenomTo, fromToken.chainId, toToken.chainId);

  const {
    data: [fromTokenInfoData, toTokenInfoData]
  } = useQuery(['token-infos', fromToken, toToken], () => fetchTokenInfos([fromToken!, toToken!]), { initialData: [] });

  const { price } = useGetPriceByUSD({
    denom: originalFromToken.denom,
    contractAddress: originalFromToken.contractAddress,
    cachePrices: prices
  });

  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken } = useSimulate(
    'simulate-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient
  );

  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT
  );

  let usdPriceShow = ((price || prices?.[originalFromToken?.coinGeckoId]) * fromAmountToken).toFixed(6);
  if (!Number(usdPriceShow)) {
    usdPriceShow = (prices?.[originalToToken?.coinGeckoId] * simulateData?.displayAmount).toFixed(6);
  }

  const { filteredToTokens, filteredFromTokens } = useFilteredTokens(
    originalFromToken,
    originalToToken,
    searchTokenName,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

  const { fee, isDependOnNetwork } = useSwapFee({
    fromToken: originalFromToken,
    toToken: originalToToken
  });

  const { relayerFee, relayerFeeInOraiToAmount: relayerFeeToken } = useRelayerFeeToken(
    originalFromToken,
    originalToToken
  );

  const fromAmountTokenBalance = fromTokenInfoData && toAmount(fromAmountToken, fromTokenInfoData!.decimals);
  const isAverageRatio = averageRatio && averageRatio.amount;
  const isSimulateDataDisplay = simulateData && simulateData.displayAmount;
  const minimumReceive = isAverageRatio
    ? calculateMinReceive(
        // @ts-ignore
        new BigDecimal(averageRatio.amount).div(INIT_AMOUNT).toString(),
        fromAmountTokenBalance.toString(),
        userSlippage,
        originalFromToken.decimals
      )
    : '0';
  const isWarningSlippage = +minimumReceive > +simulateData?.amount;
  const simulateDisplayAmount = simulateData && simulateData.displayAmount ? simulateData.displayAmount : 0;
  const bridgeTokenFee =
    simulateDisplayAmount && (fromTokenFee || toTokenFee)
      ? (simulateDisplayAmount * fromTokenFee + simulateDisplayAmount * toTokenFee) / 100
      : 0;

  const minimumReceiveDisplay = isSimulateDataDisplay
    ? new BigDecimal(
        simulateDisplayAmount - (simulateDisplayAmount * userSlippage) / 100 - relayerFee - bridgeTokenFee
      ).toNumber()
    : 0;

  const expectOutputDisplay = isSimulateDataDisplay
    ? numberWithCommas(simulateData.displayAmount, undefined, { minimumFractionDigits: 6 })
    : 0;

  const estSwapFee = new BigDecimal(simulateDisplayAmount || 0).mul(fee || 0).toNumber();

  const totalFeeEst =
    new BigDecimal(bridgeTokenFee || 0)
      .add(relayerFee || 0)
      .add(estSwapFee)
      .toNumber() || 0;

  const { addressTransfer, setAddressTransfer, initAddressTransfer, validAddress } = useAddressTransfer({
    originalFromToken,
    originalToToken
  });

  const isCustomRecipient = validAddress.isValid && addressTransfer !== initAddressTransfer;
  const customRecipient = isCustomRecipient ? addressTransfer : '';

  const {
    swapLoading,
    selectChainFrom,
    selectChainTo,
    fromTokenBalance,
    toTokenBalance,
    isSelectFrom,
    isSelectTo,
    coe,

    setSelectChainTo,
    setSelectChainFrom,
    setCoe,
    setIsSelectFrom,
    setIsSelectTo,
    handleSubmit,
    handleRotateSwapDirection,
    handleChangeToken,
    onChangeFromAmount,
    onChangePercentAmount,
    setTokenDenomFromChain
  } = useHandleSwapAction({
    fromToken,
    toToken,
    fromAmountToken,
    toAmountToken,
    relayerFeeToken,
    customRecipient,
    simulateData,
    averageRatio,
    userSlippage,
    fromAmountTokenBalance,
    initAmountSimulate: INIT_AMOUNT,

    fromTokenDenomSwap,
    toTokenDenomSwap,
    originalFromToken,
    originalToToken,

    setSwapAmount,
    setSwapTokens,
    setFromTokenDenom,
    setToTokenDenom
  });

  useEffect(() => {
    const newTVPair = generateNewSymbol(fromToken, toToken, currentPair);
    if (newTVPair) dispatch(setCurrentToken(newTVPair));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken]);

  const FromIcon = theme === 'light' ? originalFromToken.IconLight || originalFromToken.Icon : originalFromToken.Icon;
  const ToIcon = theme === 'light' ? originalToToken.IconLight || originalToToken.Icon : originalToToken.Icon;
  const fromNetwork = chainInfosWithIcon.find((chain) => chain.chainId === originalFromToken.chainId);
  const toNetwork = chainInfosWithIcon.find((chain) => chain.chainId === originalToToken.chainId);
  const FromIconNetwork = theme === 'light' ? fromNetwork.IconLight || fromNetwork.Icon : fromNetwork.Icon;
  const ToIconNetwork = theme === 'light' ? toNetwork.IconLight || toNetwork.Icon : toNetwork.Icon;

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setIsSelectFrom(false);
    setIsSelectTo(false);
    setIsSelectChainFrom(false);
    setIsSelectChainTo(false);
  });

  return (
    <div className={cx('swap-box-wrapper')}>
      <LoadingBox loading={loadingRefresh} className={cx('custom-loader-root')}>
        <div className={cx('swap-box')}>
          <div className={cx('header')}>
            <div className={cx('title')}>From</div>
            <div className={cx('actions')}>
              <span className={cx('icon')} onClick={() => setOpenSetting(true)}>
                <IconOirSettings onClick={() => setOpenSetting(true)} />
              </span>
              <button
                className={cx('btn')}
                onClick={async () =>
                  await refreshBalances(
                    loadingRefresh,
                    setLoadingRefresh,
                    { metamaskAddress, tronAddress, oraiAddress },
                    loadTokenAmounts
                  )
                }
              >
                <RefreshImg />
              </button>
            </div>
          </div>
          <div className={cx('from')}>
            <div className={cx('input-wrapper')}>
              <InputSwap
                type={'from'}
                balance={fromTokenBalance}
                originalToken={originalFromToken}
                Icon={FromIcon}
                theme={theme}
                onChangePercentAmount={onChangePercentAmount}
                setIsSelectChain={setIsSelectChainFrom}
                setIsSelectToken={setIsSelectFrom}
                selectChain={selectChainFrom}
                token={originalFromToken}
                IconNetwork={FromIconNetwork}
                amount={fromAmountToken}
                onChangeAmount={onChangeFromAmount}
                tokenFee={fromTokenFee}
                setCoe={setCoe}
                coe={coe}
                usdPrice={usdPriceShow}
              />
              {/* !fromToken && !toTokenFee mean that this is internal swap operation */}
              {!fromTokenFee && !toTokenFee && isWarningSlippage && (
                <div className={cx('impact-warning')}>
                  <div className={cx('title')}>
                    <span>Current slippage exceed configuration!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cx('swap-center')}>
            <div className={cx('title')}>To</div>
            <div className={cx('wrap-img')} onClick={handleRotateSwapDirection}>
              <img
                src={theme === 'light' ? SwitchLightImg : SwitchDarkImg}
                onClick={handleRotateSwapDirection}
                alt="ant"
              />
            </div>
            <div className={cx('ratio')} onClick={() => setOpenDetail(true)}>
              {`1 ${originalFromToken.name} ≈ ${
                averageRatio ? Number((averageRatio.displayAmount / INIT_AMOUNT).toFixed(6)) : '0'
              } ${originalToToken.name}`}

              {/* <img src={ArrowImg} alt="arrow" /> */}
            </div>
          </div>
          <div className={cx('to')}>
            <div className={cx('input-wrapper')}>
              <InputSwap
                type={'to'}
                balance={toTokenBalance}
                theme={theme}
                originalToken={originalToToken}
                disable={true}
                Icon={ToIcon}
                selectChain={selectChainTo}
                setIsSelectChain={setIsSelectChainTo}
                setIsSelectToken={setIsSelectTo}
                token={originalToToken}
                amount={toAmountToken}
                tokenFee={toTokenFee}
                IconNetwork={ToIconNetwork}
                usdPrice={usdPriceShow}
              />
            </div>
          </div>

          <div className={cx('recipient')}>
            <InputCommon
              isOnViewPort={currentAddressManagementStep === AddressManagementStep.INIT}
              title="Recipient address:"
              value={addressTransfer}
              onChange={(val) => setAddressTransfer(val)}
              showPreviewOnBlur
              defaultValue={initAddressTransfer}
              prefix={theme === 'light' ? <SendIcon /> : <SendDarkIcon />}
              suffix={
                <div
                  className={cx('paste')}
                  onClick={() => {
                    handleReadClipboard((text) => setAddressTransfer(text));
                  }}
                >
                  PASTE
                </div>
              }
              extraButton={
                <div className={cx('extraBtnWrapper')}>
                  <div className={cx('book')}>
                    <BookIcon
                      onClick={() => {
                        dispatch(setCurrentAddressBookStep(AddressManagementStep.SELECT));
                      }}
                    />
                    <span
                      onClick={() => {
                        dispatch(setCurrentAddressBookStep(AddressManagementStep.SELECT));
                      }}
                    >
                      Address Book
                    </span>
                  </div>
                  <span
                    className={cx('currentAddress')}
                    onClick={() => {
                      setAddressTransfer(initAddressTransfer);
                    }}
                  >
                    {reduceString(initAddressTransfer, 8, 8)}
                  </span>
                </div>
              }
              error={!validAddress?.isValid && 'Invalid address'}
            />
          </div>
          <div className={cx('estFee')} onClick={() => setOpenDetail(true)}>
            <div className={cx('label')}>
              {theme === 'light' ? <FeeIcon /> : <FeeDarkIcon />}
              Estimated Fee:
            </div>
            <div className={cx('info')}>
              <span className={cx('value')}>
                ≈ {numberWithCommas(totalFeeEst, undefined, { maximumFractionDigits: 6 })} {originalToToken.name}
              </span>
              <span className={cx('icon')}>
                <img src={ArrowImg} alt="arrow" />
              </span>
            </div>
          </div>

          {(() => {
            const { disabledSwapBtn, disableMsg } = getDisableSwap({
              originalToToken,
              walletByNetworks,
              swapLoading,
              fromAmountToken,
              toAmountToken,
              fromAmountTokenBalance,
              fromTokenBalance,
              addressTransfer,
              validAddress,
              simulateData
            });
            return (
              <button
                className={cx('swap-btn', `${disabledSwapBtn ? 'disable' : ''}`)}
                onClick={handleSubmit}
                disabled={disabledSwapBtn}
              >
                {swapLoading && <Loader width={20} height={20} />}
                {/* hardcode check minimum tron */}
                {!swapLoading && (!fromAmountToken || !toAmountToken) && fromToken.denom === TRON_DENOM ? (
                  <span>Minimum amount: {(fromToken.minAmountSwap || '0') + ' ' + fromToken.name} </span>
                ) : (
                  <span>{disableMsg || 'Swap'}</span>
                )}
              </button>
            );
          })()}
        </div>
      </LoadingBox>

      <div ref={ref}>
        <SelectToken
          setIsSelectToken={setIsSelectTo}
          amounts={amounts}
          prices={prices}
          handleChangeToken={(token) => {
            handleChangeToken(token, 'to');
          }}
          items={filteredToTokens}
          theme={theme}
          selectChain={selectChainTo}
          isSelectToken={isSelectTo}
        />
        <SelectToken
          setIsSelectToken={setIsSelectFrom}
          amounts={amounts}
          prices={prices}
          theme={theme}
          selectChain={selectChainFrom}
          items={filteredFromTokens}
          handleChangeToken={(token) => {
            handleChangeToken(token, 'from');
          }}
          isSelectToken={isSelectFrom}
        />
        <SelectChain
          setIsSelectToken={setIsSelectChainTo}
          amounts={amounts}
          theme={theme}
          selectChain={selectChainTo}
          setSelectChain={(chain: NetworkChainId) => {
            setSelectChainTo(chain);
            setTokenDenomFromChain(chain, 'to');
          }}
          prices={prices}
          isSelectToken={isSelectChainTo}
        />
        <SelectChain
          setIsSelectToken={setIsSelectChainFrom}
          amounts={amounts}
          theme={theme}
          prices={prices}
          selectChain={selectChainFrom}
          setSelectChain={(chain: NetworkChainId) => {
            setSelectChainFrom(chain);
            setTokenDenomFromChain(chain, 'from');
          }}
          isSelectToken={isSelectChainFrom}
        />
      </div>

      <AddressBook
        onSelected={(addr: string) => {
          setAddressTransfer(addr);
        }}
        tokenTo={originalToToken}
      />
      <div
        className={cx('overlay', openSetting ? 'activeOverlay' : '')}
        onClick={() => {
          setOpenSetting(false);
        }}
      />
      <div className={cx('setting', openSetting ? 'activeSetting' : '')}>
        <SlippageModal
          setVisible={setOpenSetting}
          setUserSlippage={setUserSlippage}
          userSlippage={userSlippage}
          isBotomSheet
        />
      </div>

      <SwapDetail
        simulatePrice={averageRatio ? Number((averageRatio.displayAmount / INIT_AMOUNT).toFixed(6)) : '0'}
        expected={expectOutputDisplay}
        minimumReceived={numberWithCommas(minimumReceiveDisplay, undefined, { minimumFractionDigits: 6 })}
        slippage={userSlippage}
        relayerFee={relayerFee}
        bridgeFee={numberWithCommas(bridgeTokenFee, undefined, { maximumFractionDigits: 6 })}
        totalFee={numberWithCommas(totalFeeEst, undefined, { maximumFractionDigits: 6 })}
        swapFee={isDependOnNetwork ? 0 : numberWithCommas(estSwapFee, undefined, { maximumFractionDigits: 6 })}
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        toTokenName={originalToToken?.name}
        fromTokenName={originalFromToken?.name}
        openSlippage={() => setOpenSetting(true)}
      />
    </div>
  );
};

export default SwapComponent;
