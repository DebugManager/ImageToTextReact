import React from 'react';
import { Column } from 'react-table';

import styles from './TableHeader.module.css';

type Row = {
    Type: string;
    LastLogin: string;
    Name: string;
    Joined: string;
    LastActive: string;
    Company: string;
    id: number;
};

type ColumnWithCustomHeader = Column<Row> & {
    customHeader: React.ReactNode;
};


type TableHeaderProps = {
    columns: ColumnWithCustomHeader[];
};

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
    return (
        <div className={styles.wrapper}>
            {columns?.map((column, index) => (
                <div className={styles.elemWrapper} key={index} style={{ width: column?.width }}>
                    {column?.customHeader}
                </div>
            ))}
        </div>
    );
};

export default TableHeader;
