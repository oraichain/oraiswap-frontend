import {
  ChainIdEnum,
  CustomChainInfo,
  GAS_ESTIMATION_BRIDGE_DEFAULT,
  NetworkChainId,
  ORAI,
  toDisplay,
  TokenItemType,
  BigDecimal
  // flattenTokens
} from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import loadingGif from 'assets/gif/loading.gif';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as ArrowDownIconLight } from 'assets/icons/arrow_light.svg';
import { ReactComponent as SuccessIcon } from 'assets/icons/toast_success.svg';
import classNames from 'classnames';
import Input from 'components/Input';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cosmosTokens, tokenMap, flattenTokens } from 'config/bridgeTokens';
import { btcChains, evmChains } from 'config/chainInfos';
import copy from 'copy-to-clipboard';
import { feeEstimate, filterChainBridge, getAddressTransfer, networks, subNumber } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useTokenFee, { useRelayerFeeToken } from 'hooks/useTokenFee';
import { reduceString } from 'libs/utils';
import { AMOUNT_BALANCE_ENTRIES } from 'pages/UniversalSwap/helpers';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './index.module.scss';
import { calcMaxAmount, useDepositFeesBitcoin, useGetWithdrawlFeesBitcoin } from '../helpers';
import useWalletReducer from 'hooks/useWalletReducer';

interface TransferConvertProps {
  token: TokenItemType;
  amountDetail?: { amount: string; usd: number };
  convertKwt?: any;
  onClickTransfer: any;
  subAmounts?: object;
}

const TransferConvertToken: FC<TransferConvertProps> = ({
  token,
  amountDetail,
  convertKwt,
  onClickTransfer,
  subAmounts
}) => {
  const bridgeNetworks = networks.filter((item) => filterChainBridge(token, item));
  const [[convertAmount, convertUsd], setConvertAmount] = useState([undefined, 0]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toNetworkChainId, setToNetworkChainId] = useState<NetworkChainId>();
  const [isOpen, setIsOpen] = useState(false);
  const [chainInfo] = useConfigReducer('chainInfo');
  const [theme] = useConfigReducer('theme');
  const [addressTransfer, setAddressTransfer] = useState('');
  const { data: prices } = useCoinGeckoPrices();
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');

  useEffect(() => {
    if (chainInfo) setConvertAmount([undefined, 0]);
  }, [chainInfo]);

  useEffect(() => {
    (async () => {
      if (token.chainId) {
        const defaultToChainId = bridgeNetworks[0]?.chainId;
        const findNetwork = networks.find((net) => net.chainId === defaultToChainId);
        const address = await getAddressTransfer(findNetwork, walletByNetworks);
        setAddressTransfer(address);
        setToNetworkChainId(defaultToChainId);
      }
    })();
  }, [token.chainId]);

  // list of tokens where it exists in at least two different chains
  const listedTokens = cosmosTokens.filter((t) => t.chainId !== token.chainId && t.coinGeckoId === token.coinGeckoId);
  const maxAmount = toDisplay(
    amountDetail.amount, // amount detail here can be undefined
    token?.decimals
  );

  const checkValidAmount = () => {
    if (!convertAmount || convertAmount <= 0 || convertAmount > maxAmount) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Invalid amount!'
      });
      return false;
    }
    return true;
  };

  const onTransferConvert = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const isValid = checkValidAmount();
      if (!isValid) return;
      setTransferLoading(true);

      // if on the same kwt network => we convert between native & erc20 tokens
      if (token.chainId === 'kawaii_6886-1') {
        // [KWT, MILKY] from Kawaiiverse => [KWT, MILKY] Oraichain
        if (toNetworkChainId === 'Oraichain') {
          return await onClickTransfer(convertAmount, toNetworkChainId);
        }
        await convertKwt(convertAmount, token);
        return;
      }
      // [KWT, MILKY] from ORAICHAIN -> KWT_CHAIN || from EVM token -> ORAICHAIN.
      if (
        evmChains.find((chain) => chain.chainId === token.chainId) ||
        (token.chainId === 'Oraichain' && toNetworkChainId === 'kawaii_6886-1')
      ) {
        await onClickTransfer(convertAmount, toNetworkChainId);
        return;
      }
      return await onClickTransfer(convertAmount, toNetworkChainId);
    } catch (error) {
      console.log({ error });
    } finally {
      setTransferLoading(false);
    }
  };

  // get token fee & relayer fee
  const toNetwork = bridgeNetworks.find((n) => n.chainId === toNetworkChainId);
  const to = flattenTokens.find((t) => t.coinGeckoId === token.coinGeckoId && t.chainId === toNetworkChainId);

  let remoteTokenDenomFrom;
  let remoteTokenDenomTo;

  if (token) remoteTokenDenomFrom = token.contractAddress ? token.prefix + token.contractAddress : token.denom;
  if (to) remoteTokenDenomTo = to.contractAddress ? to.prefix + to.contractAddress : to.denom;

  // token fee
  const fromTokenFee = useTokenFee(remoteTokenDenomFrom);
  const toTokenFee = useTokenFee(remoteTokenDenomTo);

  // bridge fee & relayer fee
  const bridgeFee = fromTokenFee + toTokenFee;
  console.log({
    token,
    to,
    toNetwork,
    toNetworkChainId
  });

  const isFromOraichainToBitcoin = token.chainId === 'Oraichain' && toNetworkChainId === ('bitcoin' as any);
  const isFromBitcoinToOraichain = token.chainId === ('bitcoin' as string) && toNetworkChainId === 'Oraichain';
  const { relayerFee: relayerFeeTokenFee } = useRelayerFeeToken(token, to);
  const depositFeeBtc = useDepositFeesBitcoin(isFromBitcoinToOraichain);
  const withdrawalFeeBtc = useGetWithdrawlFeesBitcoin({
    enabled: isFromOraichainToBitcoin,
    bitcoinAddress: addressTransfer
  });

  let toDisplayBTCFee = 0;
  if (depositFeeBtc && isFromBitcoinToOraichain) {
    // TODO: usat decimal 14
    toDisplayBTCFee = new BigDecimal(depositFeeBtc.deposit_fees ?? 0).div(1e14).toNumber();
  }

  if (withdrawalFeeBtc && isFromOraichainToBitcoin) {
    // TODO: usat decimal 14
    toDisplayBTCFee = new BigDecimal(withdrawalFeeBtc.withdrawal_fees ?? 0).div(1e14).toNumber();
  }

  let receivedAmount = convertAmount ? convertAmount * (1 - bridgeFee / 100) - relayerFeeTokenFee - toDisplayBTCFee : 0;

  const renderBridgeFee = () => {
    return (
      <div className={styles.bridgeFee}>
        Bridge fee: <span>{bridgeFee}% </span>
        {relayerFeeTokenFee > 0 ? (
          <div className={styles.relayerFee}>
            - Relayer fee:{' '}
            <span>
              {' '}
              {relayerFeeTokenFee} {token.name}{' '}
            </span>
          </div>
        ) : null}{' '}
        - Received amount:
        <span>
          {' '}
          {receivedAmount.toFixed(6)} {token.name}
        </span>
        {!!toDisplayBTCFee && (
          <>
            {' '}
            - BTC fee: <span>{toDisplayBTCFee} BTC </span>
          </>
        )}
      </div>
    );
  };

  const renderTransferConvertButton = () => {
    let buttonName = toNetworkChainId === token.chainId ? 'Convert to ' : 'Transfer to ';
    if (toNetwork) buttonName += toNetwork.chainName;
    if (receivedAmount < 0) buttonName = 'Not enought amount to pay fee';
    return buttonName;
  };

  return (
    <div className={classNames(styles.tokenFromGroup, styles.small)} style={{ flexWrap: 'wrap' }}>
      <div className={styles.tokenSubAmouts}>
        {subAmounts &&
          Object.keys(subAmounts)?.length > 0 &&
          Object.keys(subAmounts).map((denom, idx) => {
            const subAmount = subAmounts[denom] ?? '0';
            const evmToken = tokenMap[denom];
            return (
              <div key={idx} className={styles.itemSubAmounts}>
                <TokenBalance
                  balance={{
                    amount: subAmount,
                    denom: evmToken.name,
                    decimals: evmToken.decimals
                  }}
                  decimalScale={token.decimals}
                />
              </div>
            );
          })}
      </div>
      <div className={styles.tokenFromGroupBalance}>
        <div className={styles.network}>
          <div className={styles.loading}>
            {transferLoading && <img alt="loading" src={loadingGif} width={180} height={180} />}
          </div>
          <div className={styles.box}>
            <div className={styles.transfer}>
              <div
                className={styles.content}
                onClick={(e) => {
                  e.stopPropagation();
                  copy(addressTransfer);
                  setCopied(true);
                }}
              >
                <div className={classNames(styles.title, styles[theme])}>Transfer to</div>
                <div className={styles.address}>
                  {reduceString(addressTransfer, 10, 7)}
                  {copied ? <SuccessIcon width={20} height={20} /> : null}
                </div>
              </div>
            </div>
            <div className={styles.search}>
              <div
                className={classNames(styles.search_filter, styles[theme])}
                onClick={(event) => {
                  event.stopPropagation();
                  setCopied(false);
                  if (bridgeNetworks.length > 1) setIsOpen(!isOpen);
                }}
              >
                <div className={styles.search_box}>
                  {toNetwork && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={styles.search_logo}>
                        {theme === 'light' ? (
                          toNetwork.IconLight ? (
                            <toNetwork.IconLight width={44} height={44} />
                          ) : (
                            <toNetwork.Icon width={44} height={44} />
                          )
                        ) : (
                          <toNetwork.Icon width={44} height={44} />
                        )}
                      </div>
                      <span className={classNames(styles.search_text, styles[theme])}>{toNetwork.chainName}</span>
                    </div>
                  )}
                  {bridgeNetworks.length > 1 && (
                    <div>{theme === 'light' ? <ArrowDownIconLight /> : <ArrowDownIcon />}</div>
                  )}
                </div>
              </div>
              {isOpen && (
                <div>
                  <ul className={classNames(styles.items, styles[theme])}>
                    {networks
                      .filter((item) => filterChainBridge(token, item))
                      .map((net) => {
                        return (
                          <li
                            key={net.chainId}
                            onClick={async (e) => {
                              e.stopPropagation();
                              const address = await getAddressTransfer(net, walletByNetworks);
                              setAddressTransfer(address);
                              setToNetworkChainId(net.chainId);
                              setIsOpen(false);
                            }}
                          >
                            {net && (
                              <div className={classNames(styles.items_chain)}>
                                <div>
                                  <net.Icon width={44} height={44} />
                                </div>
                                <div className={classNames(styles.items_title, styles[theme])}>{net.chainName}</div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div className={styles.balanceDescription}>
            Convert Amount:{' '}
            <TokenBalance balance={convertUsd} className={styles.balanceDescription} prefix="~$" decimalScale={2} />
          </div>
          <div className={styles.balanceAmount}>
            <div>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                decimalScale={Math.min(6, token?.decimals)}
                customInput={Input}
                value={convertAmount}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onValueChange={({ floatValue }) => {
                  if (!floatValue) return setConvertAmount([undefined, 0]);
                  const usdValue = floatValue * (prices[token.coinGeckoId] ?? 0);
                  setConvertAmount([floatValue!, usdValue]);
                }}
                className={classNames(styles.amount, styles[theme])}
              />
            </div>

            <div className={styles.balanceFromGroup}>
              {AMOUNT_BALANCE_ENTRIES.map(([coeff, text]) => (
                <button
                  key={coeff}
                  className={classNames(styles.balanceBtn, styles[theme])}
                  onClick={(event) => {
                    event.stopPropagation();
                    const finalAmount = calcMaxAmount({
                      maxAmount,
                      token,
                      coeff
                    });

                    setConvertAmount([finalAmount * coeff, amountDetail.usd * coeff]);
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
        {renderBridgeFee()}
      </div>
      <div className={styles.transferTab}>
        {(() => {
          if (
            listedTokens.length > 0 ||
            evmChains.find((chain) => chain.chainId === token.chainId) ||
            btcChains.find((chain) => chain.chainId !== token.chainId)
          ) {
            return (
              <button
                disabled={transferLoading || !addressTransfer || receivedAmount < 0}
                className={classNames(styles.tfBtn, styles[theme])}
                onClick={onTransferConvert}
              >
                {transferLoading && <Loader width={20} height={20} />}
                <span>
                  <strong>{renderTransferConvertButton()}</strong>
                </span>
              </button>
            );
          }
        })()}
      </div>
    </div>
  );
};
export default TransferConvertToken;
