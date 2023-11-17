import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import routes from '../../../routes';
import { getUser } from '../../../services/locastorage.service';

import styles from './ProfilePopUp.module.css';

const ProfilePopUp = ({
  isOpen,
  handleProfilePopUp,
}: {
  isOpen: boolean;
  handleProfilePopUp: () => void;
}) => {
  const [style, setStyle] = useState(styles.profileWrapper);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = getUser();
    if (userData?.id) {
      setUserId(userData?.id);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStyle(`${styles.profileWrapper} ${styles.profileWrapperOpened}`);
    } else {
      setStyle(styles.profileWrapper);
    }
  }, [isOpen]);

  const handleClose = () => {
    setStyle(styles.profileWrapper);
    handleProfilePopUp();
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className={style}>
      <Link
        to={routes.affiliate}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Affiliate
      </Link>
      <Link
        to={`/profile-setting/${userId}`}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Profile
      </Link>
      <Link
        to={routes.pricing}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Package
      </Link>
      <p className={styles.optionStyles}>Buy Credits / Adds Ons</p>
      <Link
        to={routes.newFeature}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Feature Request
      </Link>
      <Link
        to={routes.users}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Users
      </Link>
      <Link
        to={routes.tickets}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Tickets
      </Link>
      <Link
        to={routes.companies}
        className={styles.optionStyles}
        onClick={handleClose}
      >
        Companies
      </Link>
      <p className={styles.optionStyles}>Guide</p>
      <button className={styles.optionStyles} onClick={handleLogOut}>Log out</button>
    </div>
  );
};

export default ProfilePopUp;
