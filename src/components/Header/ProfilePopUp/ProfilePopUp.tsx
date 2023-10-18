import { useState, useEffect } from 'react';

import styles from './ProfilePopUp.module.css';

const ProfilePopUp = ({ isOpen }: { isOpen: boolean }) => {
    const [style, setStyle] = useState(styles.profileWrapper);
    useEffect(() => {
        if (isOpen) {
            setStyle(`${styles.profileWrapper} ${styles.profileWrapperOpened}`);
        } else {
            setStyle(styles.profileWrapper);
        }
    }, [isOpen]);

    return (
        <div className={style}>
            <p className={styles.optionStyles}>Profile</p>
            <p className={styles.optionStyles}>Package</p>
            <p className={styles.optionStyles}>Buy Credits / Adds Ons</p>
            <p className={styles.optionStyles}>Feature Request</p>
            <p className={styles.optionStyles}>Affiliates</p>
            <p className={styles.optionStyles}>Guide</p>
            <p className={styles.optionStyles}>Support</p>
        </div>
    )
}

export default ProfilePopUp;