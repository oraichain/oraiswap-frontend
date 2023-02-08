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
  TokenItemType
} from 'config/bridgeTokens';
import {
  parseAmountFromWithDecimal as parseAmountFrom,
  parseAmountToWithDecimal as parseAmountTo,
  parseBep20Erc20Name
} from 'libs/utils';
import Loader from 'components/Loader';
import {
  BSC_ORG,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID
} from 'config/constants';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import Tooltip from 'components/Tooltip';
import useGlobalState from 'hooks/useGlobalState';

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
  toToken
}) => {
  const [[convertAmount, convertUsd], setConvertAmount] = useState([
    undefined,
    0
  ]);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertLoadingOrai, setConvertLoadingOrai] = useState(0);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferIbcLoading, setTransferIbcLoading] = useState(false);
  const [chainInfo] = useGlobalState('chainInfo');
  const [metamaskAddress] = useGlobalState('metamaskAddress');

  useEffect(() => {
    if (chainInfo) {
      setConvertAmount([undefined, 0]);
    }
  }, [chainInfo]);

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
    !ibcConvertToken?.length &&
    token.chainId !== KWT_SUBNETWORK_CHAIN_ID &&
    !onClickTransfer
  )
    return <></>;
  return (
    <div
      className={classNames(styles.tokenFromGroup, styles.small)}
      style={{ flexWrap: 'wrap' }}
    >
      <div
        className={styles.balanceDescription}
        style={{ width: '100%', textAlign: 'left' }}
      >
        Convert Amount:
      </div>
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
      <div className={styles.balanceFromGroup} style={{ flexGrow: 1 }}>
        <button
          className={styles.balanceBtn}
          onClick={(event) => {
            event.stopPropagation();
            if (!amountDetail) return;
            setConvertAmount([maxAmount, amountDetail.usd]);
          }}
        >
          MAX
        </button>
        <button
          className={styles.balanceBtn}
          onClick={(event) => {
            event.stopPropagation();
            if (!amountDetail) return;
            setConvertAmount([maxAmount / 2, amountDetail.usd / 2]);
          }}
        >
          HALF
        </button>
      </div>
      <div>
        <TokenBalance
          balance={convertUsd}
          className={styles.balanceDescription}
          prefix="~$"
          decimalScale={2}
        />
      </div>
      <div
        className={styles.transferTab}
        style={{
          marginTop: '0px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
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
                Transfer to <strong>{toToken.org}</strong>
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
                          t.name.includes(token.name)
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
                {/* <small
                  style={{
                    backgroundColor: '#C69A24',
                    color: '#95452d',
                    padding: '0px 3px',
                    borderRadius: 3,
                  }}
                >
                  Congested
                </small> */}
              </>
            );
          }

          if (
            token.cosmosBased &&
            token.chainId !== ORAI_BRIDGE_CHAIN_ID &&
            (token.erc20Cw20Map || token.bridgeNetworkIdentifier || token.denom === ORAI) && // TODO: Remove ORAI harcode
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
                      if (!window.ethereum || !metamaskAddress) {
                        displayToast(TToastType.TX_FAILED, {
                          message: `Please install Metamask to continue.`,
                        });
                        return;
                      }
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
                            : t.name.includes(name)
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
                    Transfer To <strong>{BSC_ORG}</strong> {/** TODO: Remove BSC ORG hardcode */}
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
