import React from 'react';
import { Header } from '../Header';
import { SideBar } from '../SideBar';
import styles from './Layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.rowWrapper}>
                <SideBar />
                {children}
            </div>

        </div>
    )
}

export default Layout;