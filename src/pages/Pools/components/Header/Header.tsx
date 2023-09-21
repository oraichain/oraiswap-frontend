import bg_claim_btn from 'assets/images/bg_claim_btn.png';
import bg_claim_btn_light from 'assets/images/bg_claim_btn_light.png';
import { Button } from "components/Button";
import TokenBalance from "components/TokenBalance";
import useTheme from "hooks/useTheme";
import { FC } from "react";
import styles from './Header.module.scss';

export const Header: FC<{ amount: number; oraiPrice: number }> = ({ amount, oraiPrice }) => {

    const theme = useTheme()

    return (
        <div className={styles.header}>
            <div className={styles.header_data}>
                <div className={styles.header_data_item}>
                    <span className={styles.header_data_name}>ORAI Price</span><br />
                    <span className={styles.header_data_value}>
                        <TokenBalance balance={oraiPrice} className={styles.header_data_value} decimalScale={2} />
                    </span>
                </div>
                <div className={styles.header_data_item}>
                    <span className={styles.header_data_name}>Total Staked LP</span><br />
                    <TokenBalance balance={amount} className={styles.header_data_value} decimalScale={2} />
                </div>
                <div className={styles.header_data_item}>
                    <span className={styles.header_data_name}>Total Earned</span><br />
                    <TokenBalance balance={amount} className={styles.header_data_value} decimalScale={2} />
                </div>
            </div>
            <div className={styles.header_claim_reward}>
                <div className={styles.claim_reward_bg}>
                    <img src={theme === 'light' ? bg_claim_btn : bg_claim_btn_light} alt="bg-claim-reward" />
                </div>
                <Button type='primary-sm' onClick={() => console.log('ok')}>Claim All Rewards</Button>
            </div>
        </div>
    );
};
