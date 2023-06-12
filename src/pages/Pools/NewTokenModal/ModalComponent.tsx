import cn from 'classnames/bind';
import { FC, useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import { Pairs } from 'config/pools';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import CheckBox from 'components/CheckBox';
import { tokenMap } from 'config/bridgeTokens';
import { toDisplay } from 'libs/utils';
const cx = cn.bind(styles);

export const ModalListToken = ({ position, isNewReward, setIsNewReward, allRewardSelect }) => {
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
                      setIsNewReward(
                        isNewReward.map((isReward, ind) => {
                          return position == ind + 1
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
  isNewReward,
  setIsNewReward,
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
          {isNewReward
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
        <div
          className={cx('btn', 'btn-cancel')}
          onClick={() => {
            setTypeDelete('');
          }}
        >
          <span>Cancel</span>
        </div>
        <div
          className={cx('btn', 'btn-delete')}
          onClick={() => {
            if (typeDelete === 'Reward') {
              const filterReward = isNewReward.filter((e, i) => !selectedReward.includes(i));
              setIsNewReward(filterReward);
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

export const NewRewardItems = ({ item, i, setPosition, selectedReward, setSelectedReward }) => {
  const originalFromToken = tokenMap?.[item?.denom];
  let Icon = originalFromToken?.Icon ?? originalFromToken?.IconLight;
  return (
    <div className={cx('orai')}>
      <CheckBox
        checked={selectedReward.includes(i)}
        label=""
        onCheck={() => {
          const arr = selectedReward.includes(i) ? selectedReward.filter((e) => e !== i) : [...selectedReward, i];
          setSelectedReward(arr);
        }}
      />
      <div className={cx('orai_label')}>
        <Icon className={cx('logo')} />
        <div
          className={cx('per')}
          onClick={() => {
            setPosition(i + 1);
          }}
        >
          <span>{item?.name}</span> Reward/s
        </div>
      </div>
      <div className={cx('input_per')}>
        <NumberFormat
          placeholder="0"
          thousandSeparator
          decimalScale={6}
          customInput={Input}
          value={toDisplay('1000000', 6)}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onValueChange={(e) => {}}
          className={cx('value')}
        />
      </div>
    </div>
  );
};
