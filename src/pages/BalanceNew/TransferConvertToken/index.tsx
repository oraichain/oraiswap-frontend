import { Input } from 'antd';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import _ from 'lodash';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import {
  filteredTokens,
  kawaiiTokens,
  TokenItemType,
} from 'config/bridgeTokens';
import bech32, { fromWords } from 'bech32';
import {
  parseAmountFromWithDecimal as parseAmountFrom,
  parseAmountToWithDecimal as parseAmountTo,
  parseBep20Erc20Name,
  reduceString,
} from 'libs/utils';
import Loader from 'components/Loader';
import {
  BEP20_ORAI,
  BSC_ORG,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  STABLE_DENOM,
} from 'config/constants';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import Tooltip from 'components/Tooltip';
import useGlobalState from 'hooks/useGlobalState';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import {
  filterChainBridge,
  networks,
  renderLogoNetwork,
  getTokenChain,
} from 'helper';
import loadingGif from 'assets/gif/loading.gif';
import { ETH } from '@hanchon/ethermint-address-converter';

const AMOUNT_BALANCE_25 = '25%';
const AMOUNT_BALANCE_50 = '50%';
const AMOUNT_BALANCE_75 = '75%';
const AMOUNT_BALANCE_MAX = 'MAX';

type AmountDetail = {
  amount: number;
  usd: number;
};

interface TransferConvertProps {
  token: TokenItemType;
  amountDetail?: AmountDetail;
  convertToken?: any;
  transferIBC?: any;
  transferFromGravity?: any;
  convertKwt?: any;
  onClickTransfer?: any;
  toToken: TokenItemType;
}

const TransferConvertToken: FC<TransferConvertProps> = ({
  token,
  amountDetail,
  convertToken,
  transferIBC,
  transferFromGravity,
  convertKwt,
  onClickTransfer,
  toToken,
}) => {
  const [[convertAmount, convertUsd], setConvertAmount] = useState([
    undefined,
    0,
  ]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [filterNetwork, setFilterNetwork] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chainInfo] = useGlobalState('chainInfo');
  const [addressTransfer, setAddressTransfer] = useState('');
  const [transferIbcLoading, setTransferIbcLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertLoadingOrai, setConvertLoadingOrai] = useState(0);
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

  // const name = token.name.match(/^(?:ERC20|BEP20)\s+(.+?)$/i)?.[1];
  const name = token.name;
  const ibcConvertToken = filteredTokens.filter(
    (t) =>
      t.cosmosBased &&
      (t.name === `ERC20 ${token.name}` || t.name === `BEP20 ${token.name}`) &&
      token.chainId === ORAICHAIN_ID &&
      t.chainId !== ORAI_BRIDGE_CHAIN_ID
  );

  const maxAmount = parseAmountFrom(
    amountDetail?.amount ?? 0,
    token?.decimals
  ).toNumber();

  const checkValidAmount = () => {
    // if (!convertAmount || convertAmount <= 0 || convertAmount > maxAmount) {
    //   displayToast(TToastType.TX_FAILED, {
    //     message: 'Invalid amount!',
    //   });
    //   return false;
    // }
    return true;
  };

  if (
    !name &&
    !ibcConvertToken &&
    token.chainId !== KWT_SUBNETWORK_CHAIN_ID &&
    !onClickTransfer
  )
    return <></>;

  const filterChain = (item) => {
    return filterChainBridge(token, item, filterNetwork);
  };

  const getAddressTransfer = async (network) => {
    let address = '';
    if (network.networkType == 'evm') {
      address = ETH.encoder(
        Buffer.from(
          fromWords(bech32.decode(await window.Keplr.getKeplrAddr()).words)
        )
      );
    }
    if (network.networkType == 'cosmos') {
      address = await window.Keplr.getKeplrAddr(
        network.chainId.replace(' BEP20', '').replace(' ERC20', '')
      );
    }
    setAddressTransfer(address);
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
                        .filter((item) => filterChain(item))
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
                                  alignItems: 'center',
                                }}
                              >
                                <div>{renderLogoNetwork(network.chainId)}</div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <NumberFormat
                placeholder="0"
                thousandSeparator
                decimalScale={Math.min(6, token.decimals)}
                customInput={Input}
                value={convertAmount}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onValueChange={({ floatValue }) => {
                  if (!floatValue) return setConvertAmount([undefined, 0]);
                  const _floatValue = parseAmountTo(
                    floatValue!,
                    token.decimals
                  ).toNumber();
                  const usdValue =
                    (_floatValue / (amountDetail?.amount ?? 0)) *
                    (amountDetail?.usd ?? 0);

                  setConvertAmount([floatValue!, usdValue]);
                }}
                className={styles.amount}
              />
            </div>
            <div className={styles.balanceFromGroup}>
              <button
                className={styles.balanceBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!amountDetail) return;
                  setConvertAmount([maxAmount / 4, amountDetail.usd / 4]);
                }}
              >
                {AMOUNT_BALANCE_25}
              </button>
              <button
                className={styles.balanceBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!amountDetail) return;
                  setConvertAmount([maxAmount / 2, amountDetail.usd / 2]);
                }}
              >
                {AMOUNT_BALANCE_50}
              </button>
              <button
                className={styles.balanceBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!amountDetail) return;
                  setConvertAmount([maxAmount * 0.75, amountDetail.usd * 0.75]);
                }}
              >
                {AMOUNT_BALANCE_75}
              </button>
              <button
                className={styles.balanceBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!amountDetail) return;
                  setConvertAmount([maxAmount, amountDetail.usd]);
                }}
              >
                {AMOUNT_BALANCE_MAX}
              </button>
            </div>
          </div>

          <div style={{ paddingTop: 8 }}>
            <TokenBalance
              balance={convertUsd}
              className={styles.balanceDescription}
              prefix="~$"
              decimalScale={2}
            />
          </div>
        </div>
      </div>
      <div className={styles.transferTab}>
        {onClickTransfer && (
          <Tooltip
            content={
              toToken.chainId === KWT_SUBNETWORK_CHAIN_ID && (
                <div style={{ textAlign: 'left' }}>
                  <div style={{ marginBottom: '6px' }}>
                    [Notice] Keplr recently sent out an update that affected the
                    current flow of Kawaiiverse, please delete Kawaiiverse in
                    Keplr and add it again (make sure you have no token left in
                    Kawaiiverse before deleting). Also remember to set your gas
                    fee for free transactions.
                  </div>
                  <i>
                    Skip this message if you added Kawaiiverse after July 8,
                    2022.
                  </i>
                </div>
              )
            }
          >
            <button
              className={styles.tfBtn}
              disabled={transferIbcLoading}
              onClick={async (event) => {
                event.stopPropagation();
                try {
                  const isValid = checkValidAmount();
                  if (!isValid) return;
                  setTransferIbcLoading(true);
                  await onClickTransfer(convertAmount);
                } finally {
                  setTransferIbcLoading(false);
                }
              }}
            >
              {transferIbcLoading && <Loader width={20} height={20} />}
              <span>
                Transfer to <strong>{filterNetwork} 2</strong>
                {/* toToken.org */}
              </span>
            </button>
          </Tooltip>
        )}
         {(() => {
          if (
            token.denom === process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM &&
            token.cosmosBased &&
            name
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
                      const to = filteredTokens.find(
                        (t) =>
                          t.chainId === ORAI_BRIDGE_CHAIN_ID &&
                          t.name.includes(token.name) // TODO: need to seperate BEP20 & ERC20. Need user input
                      );
                      await transferIBC(token, to, convertAmount);
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    Transfer To <strong>OraiBridge</strong>
                  </span>
                </button>
              </>
            );
          }

          if (token.chainId === KWT_SUBNETWORK_CHAIN_ID) {
            const to = kawaiiTokens.find(
              (t) => t.denom != token.denom && t.type === token.type
            );
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
                      await convertKwt(convertAmount, token);
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    Convert to <strong>{to.name}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (token.chainId === ORAI_BRIDGE_CHAIN_ID) {
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
                      await transferFromGravity(token, convertAmount);
                    } finally {
                      setTransferLoading(false);
                    }
                  }}
                >
                  {transferLoading && <Loader width={20} height={20} />}
                  <span>
                    Transfer To <strong>{token.bridgeNetworkIdentifier}</strong>
                  </span>
                </button>
              </>
            );
          }

          if (
            token.cosmosBased &&
            token.chainId !== ORAI_BRIDGE_CHAIN_ID &&
            (token.erc20Cw20Map || token.bridgeNetworkIdentifier) &&
            name
          ) {
            return (
              <>
                {token.bridgeNetworkIdentifier && (
                  <button
                    className={styles.tfBtn}
                    disabled={convertLoading}
                    onClick={async (event) => {
                      event.stopPropagation();
                      try {
                        const isValid = checkValidAmount();
                        if (!isValid) return;
                        setConvertLoading(true);
                        await convertToken(
                          convertAmount,
                          token,
                          'nativeToCw20'
                        );
                      } finally {
                        setConvertLoading(false);
                      }
                    }}
                  >
                    {convertLoading && <Loader width={20} height={20} />}
                    <span>
                      Convert To
                      <strong style={{ marginLeft: 5 }}>
                        {parseBep20Erc20Name(name)}
                      </strong>
                    </span>
                  </button>
                )}
                <button
                  disabled={transferLoading}
                  className={styles.tfBtn}
                  onClick={async (event) => {
                    event.stopPropagation();
                    try {
                      const isValid = checkValidAmount();
                      if (!isValid) return;
                      setTransferLoading(true);
                      const name = parseBep20Erc20Name(token.name);
                      const tokenBridge = token?.bridgeNetworkIdentifier;
                      const to = filteredTokens.find(
                        (t) =>
                          t.chainId === ORAI_BRIDGE_CHAIN_ID && tokenBridge
                            ? t.bridgeNetworkIdentifier.includes(
                                token.bridgeNetworkIdentifier
                              )
                            : t.name.includes(name) // TODO: need to seperate BEP20 & ERC20. Need user input
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
                    Transfer To <strong>OraiBridge</strong>
                  </span>
                </button>
              </>
            );
          }

          if (
            token.chainId !== ORAI_BRIDGE_CHAIN_ID &&
            ibcConvertToken.length
          ) {
            return ibcConvertToken.map((ibcConvert, i) => (
              <button
                key={ibcConvert.denom}
                className={styles.tfBtn}
                disabled={convertLoadingOrai === i + 1}
                onClick={async (event) => {
                  event.stopPropagation();
                  try {
                    const isValid = checkValidAmount();
                    if (!isValid) return;
                    setConvertLoadingOrai(i + 1);
                    await convertToken(
                      convertAmount,
                      token,
                      'cw20ToNative',
                      ibcConvert
                    );
                  } finally {
                    setConvertLoadingOrai(0);
                  }
                }}
              >
                {convertLoadingOrai === i + 1 && (
                  <Loader width={20} height={20} />
                )}
                <span>
                  Convert To
                  <strong style={{ marginLeft: 5 }}>{ibcConvert.name}</strong>
                </span>
              </button>
            ));
          }
        })()}
      </div>
    </div>
  );
};
export default TransferConvertToken;
