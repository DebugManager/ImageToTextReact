import React from 'react';
import { useTable, Column } from 'react-table';
import { CircleLoader } from 'react-spinners';

import styles from './Table.module.css';

type Row = {
    [key: string]: any;
};

type TableProps = {
    columns: Column<Row>[];
    data: Row[];
    isLoading: boolean;
    resultsFound: boolean;
};

const TableComponent: React.FC<TableProps> = ({ columns, data, isLoading, resultsFound }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} className={styles.table}>
            <thead>
                {headerGroups?.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup?.headers?.map((column) => {
                            return (
                                <th
                                    {...column.getHeaderProps({
                                        style: {
                                            width: column.width, padding: '10px 7px',
                                            gap: '10px',
                                        },
                                    })}
                                >
                                    {column?.render('Header')}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>

            <tbody {...getTableBodyProps()}>
                {isLoading ? (
                    <div className={styles.loaderWrapper}>
                        <CircleLoader loading={isLoading} color={'#556EE6'} size={50} />
                    </div>
                ) : resultsFound ? (
                    rows?.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                {row.cells.map((cell, cellIndex) => {
                                    const columnHeader = headerGroups[0].headers[cellIndex];
                                    const cellStyles = {
                                        width: columnHeader.width,
                                        height: '70px',
                                        padding: '10px 7px',
                                        gap: '10px',
                                    };
                                    return (
                                        <td {...cell.getCellProps()} className={styles.cellStyles} style={cellStyles}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={columns.length}>
                            <p>Not found</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableComponent;
