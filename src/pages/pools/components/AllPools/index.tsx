//@ts-nocheck
import styled from 'styled-components';
import { Dec } from '@keplr-wallet/unit';
import querystring from 'querystring';
import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { HideLBPPoolFromPage, HidePoolFromPage, PoolsPerPage } from 'config';
import { AllPoolsPagination } from 'pages/pools/components/AllPools/AllPoolsPagination';
import { AllPoolsTh } from 'pages/pools/components/AllPools/AllPoolsTh';
import { AllPoolsTr } from 'pages/pools/components/AllPools/AllPoolsTr';
import { usePoolWithFinancialDataList } from 'pages/pools/hooks/usePoolWithFinancialDataList';
import { commaizeNumber } from 'libs/format';

const FILTER_TVL_THRESHOLD = 1_000;
const TABLE_WIDTHS = ['10%', '40%', '30%', '20%'];

export const AllPools = function AllPools() {
  const location = useLocation();
  const history = useHistory();

  const params: { page?: string } = querystring.parse(
    location.search.replace('?', '')
  );
  const page =
    params.page && !Number.isNaN(parseInt(params.page))
      ? parseInt(params.page)
      : 1;

  const poolDataList = usePoolWithFinancialDataList();

  const [allPoolsShown, setAllPoolsShown] = useState<boolean>(false);

  const handleShowAllPoolsClicked = useCallback(() => {
    if (allPoolsShown) {
      history.replace('/pools?page=1');
    }
    setAllPoolsShown((shown) => !shown);
  }, [allPoolsShown, history]);

  const poolDataListFiltered = useMemo(() => {
    if (allPoolsShown) {
      return poolDataList;
    }
    return poolDataList.filter((poolData: any) => {
      const tvlPretty = poolData.tvl;
      return tvlPretty.toDec().gte(new Dec(FILTER_TVL_THRESHOLD));
    });
  }, [allPoolsShown, poolDataList]);

  const offset = (page - 1) * PoolsPerPage;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <ContainerShowAllPools>
        <h5>All Pools</h5>
        <label
          htmlFor="show-all-pools"
          className="text-xs md:text-base flex items-center"
        >
          <CheckboxShowAllPools
            id="show-all-pools"
            type="checkbox"
            checked={allPoolsShown}
            onChange={handleShowAllPoolsClicked}
          />
          <TextShowAllPools>
            Show pools less than ${commaizeNumber(FILTER_TVL_THRESHOLD)} TVL
          </TextShowAllPools>
        </label>
      </ContainerShowAllPools>
      <section>
        <table className="table-fixed w-full">
          <thead>
            <AllPoolsTh widths={TABLE_WIDTHS} />
          </thead>
          <tbody>
            {poolDataListFiltered
              .slice(offset, offset + PoolsPerPage)
              .map(({ pool, volume24h, tvl, swapFee }) => {
                if (
                  (HideLBPPoolFromPage &&
                    pool.smoothWeightChangeParams != null) ||
                  HidePoolFromPage[pool.id]
                ) {
                  return null;
                }
                return (
                  <AllPoolsTr
                    key={pool.id}
                    id={pool.id}
                    volume24h={volume24h}
                    swapFee={swapFee}
                    widths={TABLE_WIDTHS}
                    poolRatios={pool.poolRatios}
                    totalValueLocked={tvl}
                  />
                );
              })}
          </tbody>
        </table>
      </section>

      <AllPoolsPagination
        page={page}
        numberOfPools={poolDataListFiltered.length}
      />
    </div>
  );
};

const ContainerShowAllPools = styled.div`
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 20px;

  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`;

const CheckboxShowAllPools = styled.input`
  display: inline-block;
`;

const TextShowAllPools = styled.span`
  display: inline-block;
  margin-left: 8px;
  user-select: none;
  cursor: pointer;
`;
