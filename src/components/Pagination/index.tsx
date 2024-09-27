import styles from './index.module.scss';
const Pagination = ({ totalPages, paginate, currentPage, handleNext, handlePrev }) => {
  const pageNumbers = [];

  if (totalPages <= 5) {
    // Show all page numbers if total pages <= 5
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // For > 5 pages, show ellipsis and adjacent page numbers
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage > 3 && currentPage < totalPages - 2) {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    } else {
      pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    }
  }

  return (
    <nav>
      <ul className={styles.pagination}>
        <li>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </button>
        </li>

        {pageNumbers.map((number, index) => (
          <li key={index} className={number === currentPage ? styles.active : ''}>
            {number === '...' ? <span>{number}</span> : <button onClick={() => paginate(number)}>{number}</button>}
          </li>
        ))}

        <li>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
