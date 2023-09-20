import { ReactNode } from 'react';
import styles from './Table.module.scss';


export type TableHeaderProps<T extends object> = Record<string, {
    name: string;
    accessor: (data: T) => ReactNode | string | undefined;
    width: string;
    align: 'left' | 'right' | 'center';
}>
export type TableProps<T extends object> = {
    headers: TableHeaderProps<T>
    data: T[]
    stylesColumn: Object
}

const Table = <T extends object>({ headers, data, stylesColumn }: TableProps<T>) => {
    return (
        <table className={styles.table}>
            <thead className={styles.tableHeader}>
                <tr style={stylesColumn}>
                    {Object.keys(headers).map((key, index) => {
                        return (
                            <th scope="col" key={index} style={{ width: headers[key].width, textAlign: headers[key].align }}>
                                {headers[key].name}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody className={styles.tableBody}>
                {data.map((datum, index) => {
                    return (
                        <tr key={index} style={stylesColumn}>
                            {Object.keys(headers).map((key, index) => {
                                return (
                                    <td key={index} style={{ width: headers[key].width, textAlign: headers[key].align }}>
                                        {headers[key].accessor(datum)}
                                    </td>
                                )
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default Table