import { useState } from 'react';

export const LIMIT_PAGE = 10;

const usePagination = ({ data }) => {
  const [limit, _setLimit] = useState(LIMIT_PAGE);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / limit);
  const indexOfLastItem = page * limit;
  const indexOfFirstItem = indexOfLastItem - limit;

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  return {
    setPage,
    page,
    limit,
    handleNext,
    handlePrev,
    totalPages,
    indexOfLastItem,
    indexOfFirstItem
  };
};

export default usePagination;
