import TokenBalance from "components/TokenBalance";
import styles from './Header.module.scss';
import { FC } from "react";

export const Header: FC<{ theme: string; amount: number; oraiPrice: number }> = ({ amount, oraiPrice, theme }) => {
    return (
        <div className={styles.header}>
            <div className={styles.header_data}>
                <div className={styles.header_data_item}>
                    <span className={styles.header_data_name}>ORAI Price</span>
                    <span className={styles.header_data_value}>
                        <TokenBalance balance={oraiPrice} className={styles.header_data_value} decimalScale={2} />
                    </span>
                </div>
                <div className={styles.header_data_item}>
                    <span className={styles.header_data_name}>Total Liquidity</span>
                    <TokenBalance balance={amount} className={styles.header_data_value} decimalScale={2} />
                </div>
            </div>
        </div>
    );
};
