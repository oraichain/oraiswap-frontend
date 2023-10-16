import { useEffect, useState } from 'react';
import { fetchTaxRate } from 'rest/api';

export const useTaxRate = () => {
  const [taxRate, setTaxRate] = useState('');

  const queryTaxRate = async () => {
    const data = await fetchTaxRate();
    setTaxRate(data?.rate);
  };

  useEffect(() => {
    queryTaxRate();
  }, []);

  return taxRate;
};
