import loadingGif from 'assets/gif/loading.gif';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import classNames from 'classnames';
import Input from 'components/Input';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cosmosTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { CustomChainInfo, evmChains, NetworkChainId } from 'config/chainInfos';
import { GAS_ESTIMATION_BRIDGE_DEFAULT, ORAI, ORAI_BRIDGE_CHAIN_ID } from 'config/constants';
import { feeEstimate, filterChainBridge, getTokenChain, networks, renderLogoNetwork } from 'helper';
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
  const [[convertAmount, convertUsd], setConvertAmount] = useState([undefined, 0]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [filterNetwork, setFilterNetwork] = useState<NetworkChainId>();
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
    setFilterNetwork(chainDefault);
    const findNetwork = networks.find((net) => net.chainId == chainDefault);
    getAddressTransfer(findNetwork);
  }, [token?.chainId]);

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

  const getAddressTransfer = async (network: CustomChainInfo) => {
    let address: string = '';
    try {
      if (network.networkType == 'evm') {
        if (network.chainId === '0x2b6653dc') {
          address = window.tronWeb.defaultAddress.base58;
        } else {
          if (window.Metamask.isWindowEthereum()) address = await window.Metamask.getEthAddress();
        }
      } else {
        address = await window.Keplr.getKeplrAddr(network.chainId.toString());
      }
    } catch (error) {}
    setAddressTransfer(address);
  };

  const onTransferConvert = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const isValid = checkValidAmount();
      if (!isValid) return;
      setTransferLoading(true);

      // if on the same kwt network => we convert between native & erc20 tokens
      if (token.chainId === 'kawaii_6886-1') {
        await convertKwt(convertAmount, token);
        return;
      }
      // [KWT, MILKY] from ORAICHAIN -> KWT_CHAIN || from EVM token -> ORAICHAIN.
      if (evmChains.find((chain) => chain.chainId === token.chainId)) {
        await onClickTransfer(convertAmount);
        return;
      }
      // remaining tokens, we override from & to of onClickTransfer on index.tsx of BalanceNew based on the user's token destination choice
      // TODO: to is Oraibridge tokens
      // or other token that have same coingeckoId that show in at least 2 chain.
      const to = cosmosTokens.find((t) =>
        t.chainId === ORAI_BRIDGE_CHAIN_ID && t.coinGeckoId === token.coinGeckoId && t?.bridgeNetworkIdentifier
          ? t.bridgeNetworkIdentifier === filterNetwork
          : t.org === filterNetwork
      );
      await onClickTransfer(convertAmount, token, to);
      return;
    } catch (error) {
      console.log({ error });
    } finally {
      setTransferLoading(false);
    }
  };

  const displayTransferConvertButton = () => {
    const buttonName = filterNetwork === token.org ? 'Convert ' : 'Transfer ';
    return buttonName + filterNetwork;
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
                  className={styles.tokenAmount}
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
                    <div className={styles.search_logo}>{renderLogoNetwork(filterNetwork)}</div>
                    <span className={styles.search_text}>{filterNetwork}</span>
                  </div>
                  <div>
                    <ArrowDownIcon />
                  </div>
                </div>
              </div>
              {isOpen && (
                <div>
                  <ul className={styles.items}>
                    {networks
                      .filter((item) => filterChainBridge(token, item))
                      .map((network) => {
                        return (
                          <li
                            key={network.chainId}
                            onClick={async (e) => {
                              e.stopPropagation();
                              setFilterNetwork(network?.chainId);
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
                              <div>{renderLogoNetwork(network.chainId)}</div>
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
                  onClick={(event) => {
                    event.stopPropagation();
                    // hardcode estimate fee oraichain
                    let finalAmount = maxAmount;
                    if (token?.denom === ORAI) {
                      const useFeeEstimate = feeEstimate(token, GAS_ESTIMATION_BRIDGE_DEFAULT);
                      if (coeff === 1) {
                        finalAmount = useFeeEstimate > finalAmount ? 0 : finalAmount - useFeeEstimate;
                      } else {
                        finalAmount = useFeeEstimate > maxAmount - finalAmount * coeff ? 0 : finalAmount;
                      }
                    }

                    setConvertAmount([finalAmount * coeff, amountDetail.usd * coeff]);
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
          if (listedTokens.length > 0 || evmChains.find((chain) => chain.chainId === token.chainId)) {
            return (
              <button
                disabled={transferLoading || !addressTransfer}
                className={styles.tfBtn}
                onClick={onTransferConvert}
              >
                {transferLoading && <Loader width={20} height={20} />}
                <span>
                  <strong>{displayTransferConvertButton()}</strong>
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
