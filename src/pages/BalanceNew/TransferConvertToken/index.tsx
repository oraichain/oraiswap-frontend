import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import _ from 'lodash';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { filteredTokens, TokenItemType } from 'config/bridgeTokens';
import {
  parseAmountFromWithDecimal,
  parseAmountToWithDecimal,
  parseBep20Erc20Name,
  reduceString
} from 'libs/utils';
import Loader from 'components/Loader';
import {
  KWT_SUBNETWORK_CHAIN_ID,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  KAWAII_ORG,
  COSMOS_TYPE,
  EVM_TYPE,
  BSC_ORG,
  ETHEREUM_ORG
} from 'config/constants';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import {
  filterChainBridge,
  networks,
  renderLogoNetwork,
  getTokenChain,
  calculateSubAmounts
} from 'helper';
import loadingGif from 'assets/gif/loading.gif';
import Input from 'components/Input';

const AMOUNT_BALANCE_ENTRIES: [number, string][] = [
  [0.25, '25%'],
  [0.5, '50%'],
  [0.75, '75%'],
  [1, 'MAX']
];

interface TransferConvertProps {
  token: TokenItemType;
  amountDetail?: AmountDetail;
  convertToken?: any;
  transferIBC?: any;
  convertKwt?: any;
  onClickTransfer?: any;
}

const onClickTransferList = [BSC_ORG, ETHEREUM_ORG];
const TransferConvertToken: FC<TransferConvertProps> = ({
  token,
  amountDetail,
  convertToken,
  transferIBC,
  convertKwt,
  onClickTransfer
}) => {
  const [[convertAmount, convertUsd], setConvertAmount] = useState([
    undefined,
    0
  ]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [filterNetwork, setFilterNetwork] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chainInfo] = useConfigReducer('chainInfo');
  const [addressTransfer, setAddressTransfer] = useState('');
  useEffect(() => {
    if (chainInfo) {
      setConvertAmount([undefined, 0]);
    }
  }, [chainInfo]);

  useEffect(() => {
    const chainDefault = getTokenChain(token);
    setFilterNetwork(chainDefault);
    const findNetwork = networks.find((net) => net.title == chainDefault);
    getAddressTransfer(findNetwork);
  }, [token?.chainId]);

  const name = token.name;
  const ibcConvertToken = filteredTokens.filter(
    (t) =>
      t.cosmosBased &&
      (t.name === `ERC20 ${token.name}` || t.name === `BEP20 ${token.name}`) &&
      token.chainId === ORAICHAIN_ID &&
      t.chainId !== ORAI_BRIDGE_CHAIN_ID
  );

  // list of tokens where it exists in at least two different chains
  const listedTokens = filteredTokens.filter(
    (t) => t.chainId !== token.chainId && t.coingeckoId === token.coingeckoId
  );

  const subAmount = calculateSubAmounts(amountDetail);
  const maxAmount = parseAmountFromWithDecimal(
    amountDetail ? amountDetail.amount + subAmount : 0, // amount detail here can be undefined
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

  if (
    !name &&
    !ibcConvertToken &&
    token.chainId !== KWT_SUBNETWORK_CHAIN_ID &&
    !onClickTransfer
  )
    return <></>;

  const getAddressTransfer = async (network) => {
    try {
      let address: string = '';
      if (network.networkType == EVM_TYPE) {
        if (!window.Metamask.isWindowEthereum()) return setAddressTransfer('');
        address = await window.Metamask!.getEthAddress();
      }
      if (network.networkType == COSMOS_TYPE) {
        address = await window.Keplr.getKeplrAddr(network.chainId);
      }
      setAddressTransfer(address);
    } catch (error) {
      setAddressTransfer('');
    }
  };

  return (
    <div
      className={classNames(styles.tokenFromGroup, styles.small)}
      style={{ flexWrap: 'wrap' }}
    >
      <div className={styles.tokenFromGroupBalance}>
        <div className={styles.network}>
          <div className={styles.loading}>
            {transferLoading && (
              <img src={loadingGif} width={180} height={180} />
            )}
          </div>
          <div className={styles.box}>
            <div className={styles.transfer}>
              <div className={styles.content}>
                <div className={styles.title}>Transfer to</div>
                <div className={styles.address}>
                  {reduceString(addressTransfer, 10, 7)}
                </div>
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
                    <div className={styles.search_logo}>
                      {renderLogoNetwork(filterNetwork)}
                    </div>
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
                    {networks &&
                      networks
                        .filter((item) => filterChainBridge(token, item))
                        .map((network) => {
                          return (
                            <li
                              key={network.chainId}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setFilterNetwork(network?.title);
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
                                <div>{renderLogoNetwork(network.title)}</div>
                                <div className={styles.items_title}>
                                  {network.title}
                                </div>
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
                  const _floatValue = parseAmountToWithDecimal(
                    floatValue!,
                    token?.decimals
                  );
                  const usdValue =
                    (_floatValue / (amountDetail?.amount ?? 0)) *
                    (amountDetail?.usd ?? 0);

                  setConvertAmount([floatValue!, usdValue]);
                }}
                className={styles.amount}
              />
              <div style={{ paddingTop: 8 }}>
                <TokenBalance
                  balance={convertUsd}
                  className={styles.balanceDescription}
                  prefix="~$"
                  decimalScale={2}
                />
              </div>
            </div>

            <div className={styles.balanceFromGroup}>
              {AMOUNT_BALANCE_ENTRIES.map(([coeff, text]) => (
                <button
                  key={coeff}
                  className={styles.balanceBtn}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!amountDetail) return;
                    setConvertAmount([
                      maxAmount * coeff,
                      amountDetail.usd * coeff
                    ]);
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
          if (token.chainId === KWT_SUBNETWORK_CHAIN_ID) {
            return (
              <>
                <button
                  className={styles.tfBtn}
                  disabled={transferLoading}
                  onClick={async (event) => {
                    event.stopPropagation();
                    try {
                      const isValid = checkValidAmount();
                      if (!isValid) return;
                      setTransferLoading(true);
                      if (filterNetwork === ORAICHAIN_ID) {
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
                    {filterNetwork === ORAICHAIN_ID ? 'Transfer' : 'Convert'}{' '}
                    <strong>{filterNetwork}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (
            (token.cosmosBased &&
              token.chainId !== ORAI_BRIDGE_CHAIN_ID &&
              listedTokens.length > 0 &&
              name) ||
            onClickTransferList.includes(token?.org)
          ) {
            return (
              <>
                <button
                  disabled={transferLoading}
                  className={styles.tfBtn}
                  onClick={async (event) => {
                    event.stopPropagation();
                    try {
                      const isValid = checkValidAmount();
                      if (!isValid) return;
                      setTransferLoading(true);
                      if (
                        token.bridgeNetworkIdentifier &&
                        filterNetwork == ORAICHAIN_ID
                      ) {
                        return await convertToken(
                          convertAmount,
                          token,
                          'nativeToCw20'
                        );
                      }
                      if (
                        onClickTransfer &&
                        (filterNetwork == KAWAII_ORG ||
                          onClickTransferList.includes(token?.org))
                      ) {
                        return await onClickTransfer(convertAmount);
                      }
                      const to = filteredTokens.find((t) =>
                        t.chainId === ORAI_BRIDGE_CHAIN_ID &&
                        t?.bridgeNetworkIdentifier
                          ? t.bridgeNetworkIdentifier === filterNetwork &&
                            t.coingeckoId === token.coingeckoId
                          : t.coingeckoId === token.coingeckoId &&
                            t.org === filterNetwork
                      );
                      // convert reverse before transferring
                      await transferIBC(token, to, convertAmount);
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    {'Transfer'} <strong>{filterNetwork}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (
            token.chainId !== ORAI_BRIDGE_CHAIN_ID &&
            ibcConvertToken.length
          ) {
            return (
              <button
                className={styles.tfBtn}
                disabled={transferLoading}
                onClick={async (event) => {
                  event.stopPropagation();
                  try {
                    const isValid = checkValidAmount();
                    if (!isValid) return;
                    setTransferLoading(true);
                    const ibcConvert = ibcConvertToken.find(
                      (ibc) => ibc.bridgeNetworkIdentifier === filterNetwork
                    );
                    await convertToken(
                      convertAmount,
                      token,
                      'cw20ToNative',
                      ibcConvert
                    );
                  } finally {
                    setTransferLoading(false);
                  }
                }}
              >
                {transferLoading && <Loader width={20} height={20} />}
                <span>
                  Transfer
                  <strong style={{ marginLeft: 5 }}>{filterNetwork}</strong>
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
