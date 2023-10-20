import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { SideBar } from '../SideBar';
import styles from './Layout.module.css';

const Layout = () => {
    const location = useLocation();
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.rowWrapper}>
                {!location.pathname && <SideBar />}
                <Outlet />
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>

        </div>
    )
}

export default Layout;