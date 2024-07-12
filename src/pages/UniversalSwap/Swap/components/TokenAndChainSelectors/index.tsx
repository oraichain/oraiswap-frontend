import React, { useRef } from 'react';
import SelectToken from '../SelectToken/SelectToken';
import SelectChain from '../SelectChain/SelectChain';

const TokenAndChainSelectors = ({
  setIsSelectTokenTo,
  setIsSelectTokenFrom,
  setIsSelectChainTo,
  setIsSelectChainFrom,
  amounts,
  prices,
  handleChangeToken,
  filteredToTokens,
  filteredFromTokens,
  theme,
  selectChainTo,
  selectChainFrom,
  isSelectTo,
  isSelectFrom,
  isSelectChainTo,
  isSelectChainFrom,
  setSelectChainTo,
  setSelectChainFrom,
  setTokenDenomFromChain,
  originalFromToken,
  unSupportSimulateToken
}) => {
  const ref = useRef(null);
  return (
    <div ref={ref}>
      <SelectToken
        setIsSelectToken={setIsSelectTokenTo}
        amounts={amounts}
        prices={prices}
        handleChangeToken={(token) => handleChangeToken(token, 'to')}
        items={filteredToTokens}
        theme={theme}
        selectChain={selectChainTo}
        isSelectToken={isSelectTo}
      />
      <SelectToken
        setIsSelectToken={setIsSelectTokenFrom}
        amounts={amounts}
        prices={prices}
        theme={theme}
        selectChain={selectChainFrom}
        items={filteredFromTokens}
        handleChangeToken={(token) => handleChangeToken(token, 'from')}
        isSelectToken={isSelectFrom}
      />
      <SelectChain
        filterChainId={unSupportSimulateToken.includes(originalFromToken?.denom) ? ['Oraichain'] : []}
        setIsSelectToken={setIsSelectChainTo}
        amounts={amounts}
        theme={theme}
        selectChain={selectChainTo}
        setSelectChain={(chain) => {
          setSelectChainTo(chain);
          setTokenDenomFromChain(chain, 'to');
        }}
        prices={prices}
        isSelectToken={isSelectChainTo}
      />
      <SelectChain
        setIsSelectToken={setIsSelectChainFrom}
        amounts={amounts}
        theme={theme}
        prices={prices}
        selectChain={selectChainFrom}
        setSelectChain={(chain) => {
          setSelectChainFrom(chain);
          setTokenDenomFromChain(chain, 'from');
        }}
        isSelectToken={isSelectChainFrom}
      />
    </div>
  );
};

export default TokenAndChainSelectors;
