import { ReactComponent as SortDownIcon } from 'assets/icons/down_icon.svg';
import { ReactComponent as SortUpIcon } from 'assets/icons/up_icon.svg';
import { ReactNode, useEffect, useState } from 'react';
import styles from './Table.module.scss';

export type HeaderDataType<T extends object> = {
  name: string;
  accessor: (data: T) => ReactNode | string | undefined;
  width: string;
  align: 'left' | 'right' | 'center';
  padding?: string;
  sortField?: keyof T;
};

export type TableHeaderProps<T extends object> = Record<string, HeaderDataType<T>>;
export type TableProps<T extends object> = {
  defaultSorted?: keyof T;
  headers: TableHeaderProps<T>;
  data: T[];
  stylesColumn?: React.CSSProperties;
  handleClickRow?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, record: T) => void;
};

export enum SortType {
  DESC = 'desc',
  ASC = 'asc'
  // NONE = null
}

const CoefficientBySort = {
  [SortType.ASC]: 1,
  [SortType.DESC]: -1
};

export const sortDataSource = <T extends object>(data: T[], sort: Record<keyof T, SortType>) => {
  const [sortField, sortOrder] = Object.entries(sort)[0];

  return data.sort((a, b) => {
    const typeCheck = typeof a[sortField];
    switch (typeCheck) {
      case 'number':
      case 'bigint':
        // @ts-ignore
        return CoefficientBySort[sortOrder] * (b[sortField] - a[sortField]);
      case 'string':
        // @ts-ignore
        return CoefficientBySort[sortOrder] * b[sortField].localeCompare(a[sortField]);
    }

    return 0;
  });
};

export const Table = <T extends object>({
  defaultSorted,
  headers,
  data,
  handleClickRow,
  stylesColumn
}: TableProps<T>) => {
  const [sort, setSort] = useState<Record<keyof T, SortType>>({
    [defaultSorted]: SortType.DESC
  } as Record<keyof T, SortType>);

  const handleClickSort = (column: HeaderDataType<T>) => {
    const sortField = column.sortField || null;

    if (!sortField) {
      return;
    }

    if (sort[sortField] === SortType.DESC) {
      setSort(() => {
        return { [sortField]: SortType.ASC } as Record<keyof T, SortType>;
      });
      return;
    }

    if (sort[sortField] === SortType.ASC) {
      setSort(() => {
        return { [sortField]: SortType.DESC } as Record<keyof T, SortType>;
      });
      return;
    }

    setSort(() => {
      return { [sortField]: SortType.DESC } as Record<keyof T, SortType>;
    });
  };

  useEffect(() => {
    sortDataSource(data, sort);
  }, [sort, data]);

  return (
    <table className={styles.table}>
      <thead>
        <tr style={stylesColumn}>
          {Object.keys(headers).map((key, index) => {
            return (
              <th
                scope="col"
                key={index}
                style={{ width: headers[key].width, textAlign: headers[key].align, padding: headers[key].padding }}
                onClick={() => handleClickSort(headers[key])}
                className={`${headers[key].sortField ? styles.table_header_sorter : ''}${' '}${
                  sort[headers[key].sortField] ? styles.active_sort : ''
                }`}
              >
                {headers[key].name} &nbsp;
                {headers[key].sortField && (
                  <span>{sort[headers[key].sortField] === SortType.ASC ? <SortUpIcon /> : <SortDownIcon />}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => {
          return (
            <tr style={stylesColumn} key={index} onClick={(event) => handleClickRow && handleClickRow(event, datum)}>
              {Object.keys(headers).map((key, index) => {
                return (
                  <td
                    key={index}
                    style={{ width: headers[key].width, textAlign: headers[key].align, padding: headers[key].padding }}
                  >
                    {headers[key].accessor(datum)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
