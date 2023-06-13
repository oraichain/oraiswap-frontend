import cn from 'classnames/bind';
import { useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import { Pairs } from 'config/pools';
import _ from 'lodash';

const cx = cn.bind(styles);

export const ModalListToken = ({ indReward, rewardTokens, setRewardTokens, allRewardSelect }) => {
  const [searchText, setSearchText] = useState('');
  return (
    <div className={cx('dropdown-reward')}>
      <div>
        <div className={cx('label')}>Enter Token’s contract to add new tokens !</div>
        <div className={cx('check')}>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e?.target?.value)}
            placeholder="0xd3f2jlwxt...1f009"
          />
          <div className={cx('btn')}>
            <div>
              <PlusIcon />
              <span>Add Token</span>
            </div>
          </div>
        </div>
        <div className={cx('list')}>
          <ul>
            {Pairs.getPoolTokens()
              .filter((pair) => !allRewardSelect.includes(pair.denom))
              .map((t, index) => {
                return (
                  <li
                    key={index + '' + t?.name}
                    onClick={() => {
                      setRewardTokens(
                        rewardTokens.map((isReward, ind) => {
                          return indReward == ind + 1
                            ? { ...isReward, denom: t.denom, name: t.name, contract_addr: t?.contractAddress }
                            : isReward;
                        })
                      );
                    }}
                  >
                    <t.Icon className={cx('logo')} />
                    <span>{t?.name}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ModalDelete = ({
  typeDelete,
  setTypeDelete,
  setSelectedReward,
  selectedReward,
  rewardTokens,
  setRewardTokens,
  initBalances,
  setInitBalances,
  selectedInitBalances,
  setSelectedInitBalances
}) => {
  let contentReward = <></>;
  if (typeDelete === 'Reward') {
    contentReward = (
      <div className={cx('content-reward')}>
        Are you sure delete{' '}
        <span>
          {rewardTokens
            .filter((_, i) => selectedReward?.includes(i))
            .map(function (elem) {
              return elem?.denom;
            })
            .join(',')}{' '}
          {typeDelete}
        </span>
        ?
      </div>
    );
  }

  return (
    <div
      className={cx('dropdown-reward')}
      style={{
        width: 430,
        fontSize: 16
      }}
    >
      <div className={cx('title-reward')}>
        <span> Delete {typeDelete}</span>
      </div>
      {contentReward}
      <div className={cx('action')}>
        <div className={cx('btn', 'btn-cancel')} onClick={() => setTypeDelete('')}>
          <span>Cancel</span>
        </div>
        <div
          className={cx('btn', 'btn-delete')}
          onClick={() => {
            if (typeDelete === 'Reward') {
              const filterReward = rewardTokens.filter((e, i) => !selectedReward.includes(i));
              setRewardTokens(filterReward);
              setTypeDelete('');
              setSelectedReward([]);
            }
            if (typeDelete === 'Init Balances') {
              const filterInitBalances = initBalances.filter((e, i) => !selectedInitBalances.includes(i));
              setInitBalances(filterInitBalances);
              setTypeDelete('');
              setSelectedInitBalances([]);
            }
          }}
        >
          <span>Delete</span>
        </div>
      </div>
    </div>
  );
};
