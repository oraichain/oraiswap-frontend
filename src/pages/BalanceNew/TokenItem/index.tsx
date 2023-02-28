import classNames from 'classnames';
import styles from './index.module.scss';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import TransferConvertToken from '../TransferConvertToken';
import { TooltipIcon } from 'components/Tooltip';

interface TokenItemProps {
  token: TokenItemType;
  amountDetail?: [string, number];
  convertToken?: any;
  transferIBC?: any;
  name?: string;
  onClickTransfer?: any;
  active: Boolean;
  className?: string;
  onClick?: Function;
  onBlur?: Function;
  convertKwt?: any;
  subAmounts?: AmountDetails;
}

const TokenItem: React.FC<TokenItemProps> = ({
  token,
  amountDetail,
  active,
  className,
  onClick,
  convertToken,
  transferIBC,
  onClickTransfer,
  convertKwt,
  subAmounts
}) => {
  const [amount, usd] = amountDetail;
  return (
    <div
      className={classNames(styles.tokenWrapper, { [styles.active]: active }, className)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(token);
      }}
    >
      <div className={styles.balanceAmountInfo}>
        <div className={styles.token}>
          {token.Icon && <token.Icon className={styles.tokenIcon} />}
          <div className={styles.tokenInfo}>
            <div className={styles.tokenName}>{token.name}</div>
          </div>
        </div>
        <div className={styles.tokenBalance}>
          <div className={styles.row}>
            <TokenBalance
              balance={{
                amount: amount ?? '0',
                denom: '',
                decimals: token.decimals
              }}
              className={styles.tokenAmount}
              decimalScale={Math.min(6, token.decimals)}
            />
            {subAmounts && Object.keys(subAmounts)?.length > 0 && (
              <TooltipIcon
                content={
                  <div className={styles.tooltipAmount}>
                    {Object.keys(subAmounts).map((denom, idx) => {
                      const subAmount = subAmounts[denom] ?? '0';
                      const evmToken = tokenMap[denom];
                      return (
                        <div key={idx} className={styles.row}>
                          <div>
                            <div className={styles.description}>({evmToken.name})</div>
                          </div>
                          <TokenBalance
                            balance={{
                              amount: subAmount,
                              denom: token.denom,
                              decimals: evmToken.decimals
                            }}
                            className={styles.tokenAmount}
                            decimalScale={token.decimals}
                          />
                        </div>
                      );
                    })}
                  </div>
                }
                placement="bottom-end"
              />
            )}
          </div>
          <TokenBalance balance={usd} className={styles.subLabel} decimalScale={2} />
        </div>
      </div>
      <div>
        {active && (
          <TransferConvertToken
            token={token}
            amountDetail={amountDetail}
            convertToken={convertToken}
            transferIBC={transferIBC}
            onClickTransfer={onClickTransfer}
            convertKwt={convertKwt}
          />
        )}

        {/* // TODO: {active && token.contractAddress && token.cosmosBased && (
          <ConvertToNative
            name={evmName}
            token={token}
            amountDetail={amountDetail}
            convertToken={convertToken}
          />
        )} */}
      </div>
    </div>
  );
};

export default TokenItem;
