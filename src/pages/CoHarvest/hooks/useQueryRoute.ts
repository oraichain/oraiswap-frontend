import { validateNumber } from '@oraichain/oraidex-common';
import { Dispatch, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUND_QUERY_KEY, TAB_HISTORY, TAB_QUERY_KEY } from '../constants';

const useTabRoute = (setTab: Dispatch<React.SetStateAction<TAB_HISTORY>>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getUrlString = (param?: string) => {
    const currentRound = searchParams.get(ROUND_QUERY_KEY);
    const queryParams = new URLSearchParams();

    if (param) queryParams.set(TAB_QUERY_KEY, param);

    if (currentRound) queryParams.set(ROUND_QUERY_KEY, currentRound);

    const queryString = queryParams.toString();
    return { queryString };
  };

  const handleUpdateTabURL = (tab: TAB_HISTORY) => {
    const pathname = location.pathname;
    const { queryString } = getUrlString(tab);
    navigate(`${pathname}?${queryString}`);
  };

  useEffect(() => {
    const pathname = location.pathname;

    let tab = searchParams.get(TAB_QUERY_KEY) as TAB_HISTORY;

    if (!tab || ![TAB_HISTORY.ALL_BID, TAB_HISTORY.MY_BID].includes(tab)) {
      const { queryString } = getUrlString();
      setTab(TAB_HISTORY.MY_BID);
      navigate(`${pathname}?${queryString}`);
    } else {
      setTab(tab);
    }
  }, [location.search, location.pathname]);

  return {
    handleUpdateTabURL
  };
};

const useRoundRoute = (round: number, setRound: Dispatch<React.SetStateAction<number>>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getUrlString = (param?: string) => {
    const currentTab = searchParams.get(TAB_QUERY_KEY);
    const queryParams = new URLSearchParams();

    if (param) queryParams.set(ROUND_QUERY_KEY, param);

    if (currentTab) queryParams.set(TAB_QUERY_KEY, currentTab);

    const queryString = queryParams.toString();
    return { queryString };
  };

  const handleUpdateRoundURL = (roundArg: number) => {
    const pathname = location.pathname;
    const { queryString } = getUrlString(String(roundArg));
    navigate(`${pathname}?${queryString}`);
  };

  useEffect(() => {
    if (!round) {
      return;
    }

    const pathname = location.pathname;

    let roundQuery = searchParams.get(ROUND_QUERY_KEY);

    if (!roundQuery || !validateNumber(roundQuery) || Number(roundQuery) > round) {
      const { queryString } = getUrlString();
      setRound(round);
      navigate(`${pathname}?${queryString}`);
    } else {
      setRound(Number(roundQuery));
    }
  }, [location.search, location.pathname, round]);

  return {
    handleUpdateRoundURL
  };
};

export { useRoundRoute, useTabRoute };
