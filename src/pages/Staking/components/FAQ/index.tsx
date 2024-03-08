import CollapseButton from '../Collapse';
import styles from './index.module.scss';

const FAQ = () => {
  return (
    <div className={styles.FAQ}>
      <div className={styles.title}>FAQ</div>

      <div className={styles.content}>
        {LIST_FAQ.map(({ question, answer }, key) => {
          return (
            <div key={key}>
              <CollapseButton label={question} content={answer} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;

export const LIST_FAQ = [
  {
    question: 'Is staking ORAIX worth it?',
    answer: (
      <div>
        Staking ORAIX allow you to participate in OraiDEX's governance proposals - vote for protocol updates, emission
        adjustments.
        <br />
        <br />
        Moreover, it enables ORAIX stakers to earn weekly rewards from revenue sharing, liquidity rewards & so on...
      </div>
    )
  },
  {
    question: 'What is ORAIX staking?',
    answer:
      'ORAIX Staking is a program for ORAIX holders to join revenue sharing with oraiDEX, by locking their ORAIX with 30 days unbonding time.'
  },
  {
    question: 'How much can you earn staking ORAIX?',
    answer: 'You can earn 10% of revenue from OraiDEX, which including liquidity fee, relayer fee, derivatives fee...'
  },
  {
    question: 'How do I claim my ORAIX staking rewards?',
    answer:
      'ORAIX rewards can be claimed after unboding time. During unbonding time, there will be no reward distribution.'
  },
  {
    question: 'How long will ORAIX unbonding last?',
    answer: 'Staking ORAIX requires 30 days unbonding time'
  },
  {
    question: 'What are the risks of staking ORAIX?',
    answer: (
      <div>
        There are few risks to be considered:
        <br />
        <br />
        The technical risk: OraiDEX Staking Contract gets hacked and staked ORAIX are stolen.
        <br />
        <br />
        The liquidity risk of staking: ORAIX tokens got sudden rally or the price suffers high volatile due to negative
        events. In both, users will not able to trade since staked tokens are locked up
      </div>
    )
  }
  // {
  //   question: 'How does ORAIX staking work?',
  //   answer:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  // },
  // {
  //   question: 'Can you lose coins Staking ORAIX?',
  //   answer:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  // },
  // {
  //   question: 'Are there any ORAIX Staking fees?',
  //   answer:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  // }
];
