import React, { FC, PropsWithChildren } from 'react';

import { getChainMetadata } from '../chains';
import { AccountAction, AccountBalances, ChainMetadata, ChainNamespaces, ellipseAddress } from '../helpers';

interface BlockchainProps {
  chainData: ChainNamespaces;
  fetching?: boolean;
  active?: boolean;
  chainId: string;
  address?: string;
  onClick?: (chain: string) => void;
  balances?: AccountBalances;
  actions?: AccountAction[];
}

interface BlockchainDisplayData {
  data: any;
  meta: ChainMetadata;
}

function getBlockchainDisplayData(chainId: string, chainData: ChainNamespaces): BlockchainDisplayData | undefined {
  const [namespace, reference] = chainId.split(':');
  let meta: ChainMetadata;
  try {
    meta = getChainMetadata(chainId);
  } catch (e) {
    return undefined;
  }
  const data = chainData[namespace][reference];
  if (typeof data === 'undefined') return undefined;
  return { data, meta };
}

const Blockchain: FC<PropsWithChildren<BlockchainProps>> = (props: PropsWithChildren<BlockchainProps>) => {
  const { chainData, fetching, chainId, address, onClick, balances, active, actions } = props;

  if (!Object.keys(chainData).length) return null;

  const chain = getBlockchainDisplayData(chainId, chainData);
  if (typeof chain === 'undefined') {
    return null;
  }
  const name = chain.meta.name || chain.data.name;

  return (
    <React.Fragment>
      <div onClick={() => onClick && onClick(props.chainId)} className={active ? 'active' : ''}>
        <div>
          <img src={chain.meta.logo} alt={name} />
          <p>{name}</p>
        </div>
        {!!address && <p>{ellipseAddress(address)}</p>}
        <div>
          {fetching ? (
            <div>Fetching....</div>
          ) : (
            <>
              {!!address && !!balances && balances[address] ? (
                <div>
                  <h6>Balances</h6>
                  <div>Symbol: ${balances[address].symbol}</div>
                  {/* <div>Balances: {balances[address]}</div> */}
                </div>
              ) : null}
              {!!actions && actions.length ? (
                <div>
                  <h6>Methods</h6>
                  {actions.map((action) => (
                    <div key={action.method} rgb={chain.meta.rgb} onClick={() => action.callback(chainId)}>
                      {action.method}
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Blockchain;
