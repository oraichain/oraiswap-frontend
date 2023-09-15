import classNames from 'classnames';
import TokenBalance from 'components/TokenBalance';
import { assetInfoMap } from 'config/bridgeTokens';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RewardPoolType } from 'reducer/config';
import { parseTokenInfoRawDenom } from 'rest/api';
import styles from './PoolItem.module.scss';
import { PairInfoData } from 'pages/Pools/helpers';


export const PoolItem = memo<PairInfoData & { apr: number; theme?: string, cachedReward?: RewardPoolType[] }>(({ pair, amount, apr, theme, cachedReward }) => {
    const navigate = useNavigate();
    const [token1, token2] = pair.asset_infos_raw.map((info) => assetInfoMap[info]);
    const reward = cachedReward?.find(e => e?.liquidity_token === pair?.liquidity_token)?.reward || ['ORAIX'];
    if (!token1 || !token2) return null;

    return (
        <div
            className={classNames(styles.pairbox)}
            onClick={() =>
                navigate(
                    `/pool/${encodeURIComponent(parseTokenInfoRawDenom(token1))}_${encodeURIComponent(
                        parseTokenInfoRawDenom(token2)
                    )}`
                )
            }
        >
            <div className={styles.pairbox_header}>
                <div className={styles.pairbox_logos}>
                    {theme === 'light' && token1?.IconLight ? (
                        <token1.IconLight className={styles.pairbox_logo1} />
                    ) : (
                        <token1.Icon className={styles.pairbox_logo1} />
                    )}

                    {theme === 'light' && token2?.IconLight ? (
                        <token2.IconLight className={styles.pairbox_logo2} />
                    ) : (
                        <token2.Icon className={styles.pairbox_logo2} />
                    )}
                </div>
                <div className={styles.pairbox_pair}>
                    <div className={styles.pairbox_pair_name}>
                        {token1.name}/{token2.name}
                    </div>
                    <div className={styles.pairbox_pair_rate}>{/* {token1.name} (50%)/{token2.name} (50%) */}</div>
                    <span className={styles.pairbox_pair_apr}>{reward.join(' / ')} Bonus</span>
                </div>
            </div>
            <div className={styles.pairbox_content}>
                {!!apr && (
                    <div className={styles.pairbox_data}>
                        <span className={styles.pairbox_data_name}>APR</span>
                        <span className={styles.pairbox_data_value}>{apr.toFixed(2)}%</span>
                    </div>
                )}
                <div className={styles.pairbox_data}>
                    <span className={styles.pairbox_data_name}>Swap Fee</span>
                    <span className={styles.pairbox_data_value}>{100 * parseFloat(pair.commission_rate)}%</span>
                </div>
                <div className={styles.pairbox_data}>
                    <span className={styles.pairbox_data_name}>Liquidity</span>
                    <TokenBalance balance={amount} className={styles.pairbox_data_value} decimalScale={2} />
                </div>
            </div>
        </div>
    );
});