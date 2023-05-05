import React from 'react';
import classNames from 'classnames';
import styles from './SearchInput.module.scss';
import SearchSvg from 'assets/images/search-svg.svg';
import Input, { InputProps } from './Input';

const Search: React.FC<InputProps> = ({ className, isBorder, ...props }) => (
  <Input
    className={classNames(className, isBorder ? styles.universalSearch : styles.search)}
    placeholder="Search by pools or tokens name"
    style={{
      paddingLeft: 40,
      backgroundImage: `url(${SearchSvg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '10px center',
    }}
    {...props}
  />
);

export default Search;
