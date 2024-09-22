import React, { FC, PropsWithChildren } from 'react';

import { getChainMetadata } from '../chains';
import { AccountAction, AccountBalances, ChainMetadata, ChainNamespaces, ellipseAddress } from '../helpers';
import { Button } from 'components/Button';

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
      <div>
        {!address ? (
          <Button onClick={() => onClick && onClick(props.chainId)} type="primary-sm">
            Connect {name}
          </Button>
        ) : (
          <span>{ellipseAddress(address)}</span>
        )}
        <div>
          {fetching ? (
            <div>Fetching....</div>
          ) : (
            <>
              {/* {!!actions && actions.length ? (
                <div>
                  <h6>Methods</h6>
                  {actions.map((action) => (
                    <div key={action.method} rgb={chain.meta.rgb} onClick={() => action.callback(chainId)}>
                      {action.method}
                    </div>
                  ))}
                </div>
              ) : null} */}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Blockchain;
