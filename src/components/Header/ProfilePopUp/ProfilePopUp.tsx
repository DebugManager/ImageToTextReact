import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

import styles from './ProfilePopUp.module.css';

const ProfilePopUp = ({ isOpen, handleProfilePopUp}: { isOpen: boolean, handleProfilePopUp: () => void }) => {
    const [style, setStyle] = useState(styles.profileWrapper);
    useEffect(() => {
        if (isOpen) {
            setStyle(`${styles.profileWrapper} ${styles.profileWrapperOpened}`);
        } else {
            setStyle(styles.profileWrapper);
        }
    }, [isOpen]);

    const handleClose =() =>{
        setStyle(styles.profileWrapper);
        handleProfilePopUp();
    }

    return (
        <div className={style}>
            <p className={styles.optionStyles}>Profile</p>
            <Link to={routes.pricing} className={styles.optionStyles} onClick={handleClose}>Package</Link>
            <p className={styles.optionStyles}>Buy Credits / Adds Ons</p>
            <Link to={routes.newFeature} className={styles.optionStyles}  onClick={handleClose}>Feature Request</Link>
            <Link to={routes.users} className={styles.optionStyles}  onClick={handleClose}>Users</Link>
            <Link to={routes.tickets} className={styles.optionStyles}  onClick={handleClose}>Tickets</Link>
            <Link to={routes.companies} className={styles.optionStyles}  onClick={handleClose}>Companies</Link>
            <p className={styles.optionStyles}>Affiliates</p>
            <p className={styles.optionStyles}>Guide</p>
            <p className={styles.optionStyles}>Support</p>
        </div>
    )
}

export default ProfilePopUp;