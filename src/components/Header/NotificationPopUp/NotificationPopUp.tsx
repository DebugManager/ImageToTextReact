import { useState, useEffect } from 'react';

import styles from './NotificationPopUp.module.css';

const NotificationPopUp = ({ isOpen }: { isOpen: boolean }) => {
    const [style, setStyle] = useState(styles.notificationWrapper);
    useEffect(() => {
        if (isOpen) {
            setStyle(`${styles.notificationWrapper} ${styles.notificationWrapperOpened}`);
        } else {
            setStyle(styles.notificationWrapper);
        }
    }, [isOpen]);
    return (
        <div className={style}>
            <p className={styles.notTitle}>Notifications</p>
            <p className={styles.dayStyles}>Today (2) </p>
            <div className={styles.tasksWrapper}>
                <input type='checkbox' className={styles.inputCheckBox} />
                <div className={styles.taskTextWrapper}>
                    <p className={styles.textDescription}>The new Alert has been successfully added, check the table for more details!</p>
                    <p className={styles.time}>08.53 p.m</p>
                </div>

            </div>
        </div>
    )
}

export default NotificationPopUp