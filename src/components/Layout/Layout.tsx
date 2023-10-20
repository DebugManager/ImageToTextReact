import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { SideBar } from '../SideBar';
import styles from './Layout.module.css';

const Layout = () => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.rowWrapper}>
                <SideBar />
                <Outlet />
            </div>

        </div>
    )
}

export default Layout;