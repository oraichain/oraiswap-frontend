import { DuckDb } from 'libs/duckdb';
import { useEffect } from 'react';

const useInitialDuckDb = () => {
  const initDuckdb = async () => {
    window.duckDb = await DuckDb.create();
  };

  useEffect(() => {
    if (!window.duckDb) initDuckdb();
  }, [window.duckDb]);

  return {
    duckDb: window.duckDb
  };
};

export default useInitialDuckDb;
