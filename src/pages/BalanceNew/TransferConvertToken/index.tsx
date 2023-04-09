import loadingGif from 'assets/gif/loading.gif';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import classNames from 'classnames';
import Input from 'components/Input';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cosmosNetworks, evmChains, evmChainsWithoutTron, filteredTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import {
  GAS_ESTIMATION_BRIDGE_DEFAULT,
  KAWAII_ORG,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  TRON_CHAIN_ID
} from 'config/constants';
import { networksWithoutOraib } from 'config/bridgeTokens';
import { feeEstimate, filterChainBridge, getTokenChain, renderLogoNetwork } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { reduceString, toDisplay } from 'libs/utils';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import styles from './index.module.scss';
const AMOUNT_BALANCE_ENTRIES: [number, string][] = [
  [0.25, '25%'],
  [0.5, '50%'],
  [0.75, '75%'],
  [1, 'MAX']
];

interface TransferConvertProps {
  token: TokenItemType;
  amountDetail?: [string, number];
  convertToken?: any;
  transferIBC?: any;
  convertKwt?: any;
  onClickTransfer?: any;
  subAmounts?: object;
  fromNetwork: string | number;
}

const TransferConvertToken: FC<TransferConvertProps> = ({
  token,
  amountDetail,
  convertToken,
  transferIBC,
  convertKwt,
  onClickTransfer,
  subAmounts,
  fromNetwork
}) => {
  const [[convertAmount, convertUsd], setConvertAmount] = useState([undefined, 0]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [toNetwork, setToNetwork] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chainInfo] = useConfigReducer('chainInfo');
  const [addressTransfer, setAddressTransfer] = useState('');
  const { data: prices } = useCoinGeckoPrices();
  useEffect(() => {
    if (chainInfo) {
      setConvertAmount([undefined, 0]);
    }
  }, [chainInfo]);

  useEffect(() => {
    const chainDefault = getTokenChain(token);
    setToNetwork(chainDefault);
    const findNetwork = networksWithoutOraib.find((net) => net.chainName === chainDefault);
    getAddressTransfer(findNetwork);
  }, [fromNetwork, token]);

  const [amount, usd] = amountDetail;
  const name = token.name;
  const ibcConvertToken = filteredTokens.filter(
    (t) =>
      t.cosmosBased &&
      (t.name === `ERC20 ${token.name}` || t.name === `BEP20 ${token.name}`) &&
      fromNetwork === ORAICHAIN_ID &&
      !t.bridgeNetworkIdentifier
  );

  // list of tokens where it exists in at least two different chains
  const listedTokens = filteredTokens.filter((t) => t.chainId !== fromNetwork && t.coinGeckoId === token.coinGeckoId);

  const maxAmount = toDisplay(
    amount, // amount detail here can be undefined
    token?.coinDecimals
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

  if (!name && !ibcConvertToken && fromNetwork !== KWT_SUBNETWORK_CHAIN_ID && !onClickTransfer) return <></>;

  const getAddressTransfer = async (network) => {
    try {
      let address: string = '';
      if (evmChainsWithoutTron.find(i => i.chainId == network.chainId)) {
        if (!window.Metamask.isWindowEthereum()) return setAddressTransfer('');
        address = await window.Metamask!.getEthAddress();
      }
      if (network.chainId === TRON_CHAIN_ID) {
        address = await window.tronWeb.defaultAddress.base58;
      }

      if (cosmosNetworks.find(i => i.chainId == network.chainId) || network.chainId === KWT_SUBNETWORK_CHAIN_ID) {
        address = await window.Keplr.getKeplrAddr(network.chainId);
      }
      setAddressTransfer(address);
    } catch (error) {
      setAddressTransfer('');
    }
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
                    decimals: evmToken.coinDecimals
                  }}
                  className={styles.tokenAmount}
                  decimalScale={token.coinDecimals}
                />
              </div>
            );
          })}
      </div>
      <div className={styles.tokenFromGroupBalance}>
        <div className={styles.network}>
          <div className={styles.loading}>{transferLoading && <img src={loadingGif} width={180} height={180} />}</div>
          <div className={styles.box}>
            <div className={styles.transfer}>
              <div className={styles.content}>
                <div className={styles.title}>Transfer to</div>
                <div className={styles.address}>{reduceString(addressTransfer, 10, 7)}</div>
              </div>
            </div>
            <div className={styles.search}>
              <div
                className={styles.search_filter}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                <div className={styles.search_box}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.search_logo}>{renderLogoNetwork(toNetwork)}</div>
                    <span className={styles.search_text}>{toNetwork}</span>
                  </div>
                  <div>
                    <ArrowDownIcon />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div>
                  <ul className={styles.items}>
                    {networksWithoutOraib &&
                      networksWithoutOraib
                        .filter((item) => filterChainBridge(token, item))
                        .map((network) => {
                          return (
                            <li
                              key={network.chainId}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setToNetwork(network?.chainId);
                                await getAddressTransfer(network);
                                setIsOpen(false);
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <div><network.Icon /></div>
                                <div className={styles.items_title}>{network.chainName}</div>
                              </div>
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
          <div className={styles.balanceDescription}>Convert Amount:</div>
          <div className={styles.balanceAmount}>
            <div>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                decimalScale={Math.min(6, token?.coinDecimals)}
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
                className={styles.amount}
              />
              <div style={{ paddingTop: 8 }}>
                <TokenBalance balance={convertUsd} className={styles.balanceDescription} prefix="~$" decimalScale={2} />
              </div>
            </div>

            <div className={styles.balanceFromGroup}>
              {AMOUNT_BALANCE_ENTRIES.map(([coeff, text]) => (
                <button
                  key={coeff}
                  className={styles.balanceBtn}
                  onClick={async (event) => {
                    event.stopPropagation();
                    // hardcode estimate fee oraichain
                    let finalAmount = maxAmount;
                    if (token?.coinDenom === ORAI) {
                      const useFeeEstimate = await feeEstimate(token, GAS_ESTIMATION_BRIDGE_DEFAULT);
                      if (coeff === 1) {
                        finalAmount = useFeeEstimate > finalAmount ? 0 : finalAmount - useFeeEstimate;
                      } else {
                        finalAmount = useFeeEstimate > maxAmount - finalAmount * coeff ? 0 : finalAmount;
                      }
                    }

                    setConvertAmount([finalAmount * coeff, usd * coeff]);
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.transferTab}>
        {(() => {
          if (fromNetwork === KWT_SUBNETWORK_CHAIN_ID) {
            return (
              <>
                <button
                  className={styles.tfBtn}
                  disabled={transferLoading || !addressTransfer}
                  onClick={async (event) => {
                    event.stopPropagation();
                    try {
                      const isValid = checkValidAmount();
                      if (!isValid) return;
                      setTransferLoading(true);
                      if (toNetwork === ORAICHAIN_ID) {
                        return await onClickTransfer(convertAmount);
                      }
                      await convertKwt(convertAmount, token);
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    {toNetwork === ORAICHAIN_ID ? 'Transfer' : 'Convert'} <strong>{toNetwork}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (
            (token.cosmosBased && fromNetwork !== ORAI_BRIDGE_CHAIN_ID && listedTokens.length > 0 && name) ||
            evmChains.find((chain) => chain.chainId === fromNetwork)
          ) {
            return (
              <>
                <button
                  disabled={transferLoading || !addressTransfer}
                  className={styles.tfBtn}
                  onClick={async (event) => {
                    event.stopPropagation();
                    try {
                      const isValid = checkValidAmount();
                      if (!isValid) return;
                      setTransferLoading(true);
                      if (token.bridgeNetworkIdentifier && toNetwork === ORAICHAIN_ID) {
                        return await convertToken(convertAmount, token, 'nativeToCw20');
                      }
                      if (
                        onClickTransfer &&
                        (toNetwork === KAWAII_ORG || evmChains.find((chain) => chain.chainId === fromNetwork))
                      ) {
                        return await onClickTransfer(convertAmount);
                      }
                      const to = filteredTokens.find((t) =>
                        t.chainId === ORAI_BRIDGE_CHAIN_ID && t?.bridgeNetworkIdentifier
                          ? t.bridgeNetworkIdentifier === toNetwork && t.coinGeckoId === token.coinGeckoId
                          : t.coinGeckoId === token.coinGeckoId && t.org === toNetwork
                      );
                      // convert reverse before transferring
                      await transferIBC(token, to, convertAmount);
                    } catch (error) {
                      console.log({ error });
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    {'Transfer'} <strong>{toNetwork}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (fromNetwork !== ORAI_BRIDGE_CHAIN_ID && ibcConvertToken.length) {
            return (
              <button
                className={styles.tfBtn}
                disabled={transferLoading || !addressTransfer}
                onClick={async (event) => {
                  event.stopPropagation();
                  try {
                    const isValid = checkValidAmount();
                    if (!isValid) return;
                    setTransferLoading(true);
                    const ibcConvert = ibcConvertToken.find((ibc) => ibc.bridgeNetworkIdentifier === toNetwork);
                    await convertToken(convertAmount, token, 'cw20ToNative', ibcConvert);
                  } finally {
                    setTransferLoading(false);
                  }
                }}
              >
                {transferLoading && <Loader width={20} height={20} />}
                <span>
                  Transfer
                  <strong style={{ marginLeft: 5 }}>{toNetwork}</strong>
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
