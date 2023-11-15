import { useCallback, useEffect, useState } from 'react';

import NotificationPopUp from './NotificationPopUp/NotificationPopUp';
import ProfilePopUp from './ProfilePopUp/ProfilePopUp';

import { getUser } from '../../services/locastorage.service';
import { getNotification } from '../../services/notification.service';

import styles from './Header.module.css';

import moon from '../../assets/header/moon.svg';
import flag from '../../assets/header/flag.png';
import arrow from '../../assets/header/arrow.svg';
import bell from '../../assets/header/bell.svg';

interface INotification {
  id: number;
  text: string;
  data: string;
}

interface IUser {
  readed_notification: null | number[];
  address_line1: string;
  affiliate: boolean;
  affiliate_code: null | string;
  city: string;
  company: any[];
  country: string;
  current_plan: string;
  customer_id: string;
  email: string;
  first_name: string;
  groups: any[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  joined: string;
  last_login: string;
  last_name: string;
  password: string;
  phone: null | string;
  status: string;
  type: string;
  user_permissions: any[];
  zip_code: number;
  payment_method_id: string;
  subscription_id: string;
  affiliate_id: string | number;
}

const Header = () => {
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openPorfile, setOpenProfile] = useState<boolean>(false);
  const [isNotification, setIsNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<null | INotification[]>(
    null
  );
  const [notificationIsLoading, setNotificationIsLoading] =
    useState<boolean>(false);
  const [settedUser, setSettedUser] = useState<null | IUser>(null);

  const fetchData = useCallback(async () => {
    setNotificationIsLoading(true);
    try {
      const data = await getNotification();
      setNotifications(data);
      setNotificationIsLoading(false);
    } catch (error) {
      console.error(error, 'error');
      setNotificationIsLoading(false);
    }
  }, []);

  const updateNotifications = () => {
    setNotificationIsLoading(true);
    const user = getUser();
    if (user?.id) {
      setSettedUser(user);
      setNotificationIsLoading(false);
    }
  };

  useEffect(() => {
    if (settedUser?.readed_notification?.length && notifications?.length) {
      const hasUnreadNotification = notifications?.some(
        ({ id }) => !settedUser?.readed_notification?.includes(id)
      );
      setIsNotification(hasUnreadNotification);
    }
  }, [notifications, settedUser]);

  useEffect(() => {
    const user = getUser();
    if (user?.id) {
      setSettedUser(user);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProfilePopUp = () => {
    setOpenProfile(!openPorfile);
  };

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>SKOTE</p>
      <div className={styles.dataWrapper}>
        <div className={styles.moonWrapper}>
          <img src={moon} alt='moon' className={styles.moonImage} />
        </div>

        <div className={styles.flagWrapper}>
          <img src={flag} alt='moon' className={styles.flagImage} />

          <img src={arrow} alt='moon' className={styles.arrowImage} />
        </div>

        <div className={styles.bellWrapper}>
          <img
            src={bell}
            alt='moon'
            className={styles.bellImage}
            onClick={handleOpenNotification}
          />
          {isNotification && <div className={styles.notification} />}
          <NotificationPopUp
            notificationIsLoading={notificationIsLoading}
            updateNotifications={updateNotifications}
            userId={settedUser?.id}
            userNotifications={settedUser?.readed_notification}
            isOpen={openNotification}
            notifications={notifications ? notifications : null}
          />
        </div>

        <>
          <div className={styles.userData} onClick={handleProfilePopUp}>
            <p className={styles.userName}>henry</p>
            <img src={arrow} alt='moon' className={styles.arrowImage} />
          </div>
          <ProfilePopUp
            isOpen={openPorfile}
            handleProfilePopUp={handleProfilePopUp}
          />
        </>
      </div>
    </div>
  );
};

export default Header;
