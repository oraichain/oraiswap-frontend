import cn from 'classnames/bind';
import { useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import { Pairs } from 'config/pools';
import _ from 'lodash';
import { ReactComponent as SuccessIcon } from 'assets/icons/success.svg';
import { ReactComponent as TokensIcon } from 'assets/icons/tokens.svg';
import { reduceString } from 'libs/utils';
import { OraiswapTokenQueryClient } from '@oraichain/oraidex-contracts-sdk';

const cx = cn.bind(styles);

export const AddTokenStatus = ({ status }) => {
  if (status === null) return <></>;
  return (
    <div
      style={{
        paddingTop: 4,
        color: !status ? 'rgba(255, 47, 54, 1)' : 'rgba(6, 201, 88, 1)',
        fontSize: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!status ? (
        <div>This Token‘s contract address does not exist ! </div>
      ) : (
        <>
          <div style={{ paddingRight: 4 }}>Add Token success</div>
          <SuccessIcon />
        </>
      )}
    </div>
  );
};

export const ModalListToken = ({
  indReward,
  rewardTokens,
  setRewardTokens,
  allRewardSelect,
  tokensNew,
  setTokensNew
}) => {
  const [contractAddr, setContractAddr] = useState('');
  const [isAddToken, setIsAddToken] = useState(null);

  return (
    <div className={cx('dropdown-reward')}>
      <div>
        <div className={cx('label')}>Enter Token’s contract to add new tokens !</div>
        <div className={cx('check')}>
          <Input
            value={contractAddr}
            onChange={(e) => setContractAddr(e?.target?.value)}
            placeholder="0xd3f2jlwxt...1f009"
          />
          <div
            className={cx('btn')}
            onClick={async () => {
              try {
                if (!contractAddr) return;
                const cw20Token = new OraiswapTokenQueryClient(window.client, contractAddr);
                await cw20Token.tokenInfo();

                const existContractAddress = [...Pairs.getPoolTokens(), ...tokensNew].find(
                  (e) => e.contractAddress === contractAddr
                );
                if (existContractAddress) return setIsAddToken(false);
                setTokensNew([
                  ...tokensNew,
                  {
                    contractAddress: contractAddr,
                    name: 'New Token ' + `${contractAddr?.slice(contractAddr?.length - 4, contractAddr?.length)}`,
                    denom: 'New Token ' + `${contractAddr?.slice(contractAddr?.length - 4, contractAddr?.length)}`
                  }
                ]);
                setIsAddToken(true);
              } catch (error) {
                console.log({ error });
                setIsAddToken(false);
              }
            }}
          >
            <div style={{ opacity: contractAddr ? 1 : 0.5 }}>
              <PlusIcon />
              <span>Add Token</span>
            </div>
          </div>
        </div>
        <AddTokenStatus status={isAddToken} />
        <div className={cx('list')}>
          <ul>
            {[...Pairs.getPoolTokens(), ...tokensNew]
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
                    {t.Icon ? <t.Icon className={cx('logo')} /> : <TokensIcon className={cx('logo')} />}
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
