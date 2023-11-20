import { useCallback, useEffect, useRef, useState } from 'react';

import NotificationPopUp from './NotificationPopUp/NotificationPopUp';
import ProfilePopUp from './ProfilePopUp/ProfilePopUp';

import { useLanguage } from '../../context/LanguageContext';
import { getUser } from '../../services/locastorage.service';
import { getNotification } from '../../services/notification.service';

import styles from './Header.module.css';

import moon from '../../assets/header/moon.svg';
import flag from '../../assets/header/flag.png';
import arrow from '../../assets/header/arrow.svg';
import bell from '../../assets/header/bell.svg';
import spain from '../../assets/header/spain.svg';
import german from '../../assets/header/german.svg';
import italian from '../../assets/header/italian.svg';
import china from '../../assets/header/china.svg';

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

const LanguagesList = [
  {
    id: 'en',
    value: 'English',
  },
  {
    id: 'es',
    value: 'Spanish',
  },
  {
    id: 'ge',
    value: 'German',
  },
  {
    id: 'it',
    value: 'Italian',
  },
  {
    id: 'ch',
    value: 'China',
  },
];

const Header = () => {
  const notificationPopUpRef = useRef<HTMLImageElement | null>(null);
  const profilePopUpRef = useRef<HTMLDivElement | null>(null);
  const languagesListRef = useRef<HTMLImageElement | null>(null);

  const [style, setStyle] = useState(styles.languageWrapper);
  const [openLanguage, setOpenLanguage] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openPorfile, setOpenProfile] = useState<boolean>(false);
  const [isNotification, setIsNotification] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<null | INotification[]>(
    null
  );
  const [notificationIsLoading, setNotificationIsLoading] =
    useState<boolean>(false);
  const [settedUser, setSettedUser] = useState<null | IUser>(null);

  const { setEN, setES, setGE, setIT, setCH, language } = useLanguage();

  const fetchData = useCallback(async (lang: string) => {
    setNotificationIsLoading(true);
    try {
      const data = await getNotification(lang);
      setNotifications(data.notifications);
      setNotificationIsLoading(false);
    } catch (error) {
      console.error(error, 'error');
      setNotificationIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (openLanguage) {
      setStyle(`${styles.languageWrapper} ${styles.languageWrapperOpened}`);
    } else {
      setStyle(styles.languageWrapper);
    }
  }, [openLanguage]);

  const updateNotifications = () => {
    setNotificationIsLoading(true);
    const user = getUser();
    if (user?.id) {
      setSettedUser(user);
      setNotificationIsLoading(false);
    }
  };

  useEffect(() => {
    if (settedUser?.readed_notification && notifications?.length) {
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
    fetchData(language);
  }, [fetchData, language]);

  const handleProfilePopUp = () => {
    setOpenProfile(!openPorfile);
    setOpenLanguage(false);
    setOpenNotification(false);
  };

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
    setOpenLanguage(false);
    setOpenProfile(false);
  };

  const handleOpenlanguage = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    setOpenLanguage(!openLanguage);
    setOpenNotification(false);
    setOpenProfile(false);
  };

  const handleChangeLanguage = (id: string): void => {
    switch (id) {
      case 'en':
        setEN(id);
        break;
      case 'es':
        setES(id);
        break;
      case 'ge':
        setGE(id);
        break;
      case 'it':
        setIT(id);
        break;
      case 'ch':
        setCH(id);
        break;
      default:
        console.error(`Not found`);
    }
  };

  const handleLanguagePopUp = () => {
    setOpenLanguage(false);
  };

  const handleLanguageClick = (id: string) => {
    handleChangeLanguage(id);
    handleLanguagePopUp();
    setStyle(styles.languageWrapper);
  };

  const getFlagImage = (lang: string) => {
    switch (lang) {
      case 'en':
        return flag;
      case 'es':
        return spain;
      case 'ge':
        return german;
      case 'it':
        return italian;
      case 'ch':
        return china;
      default:
        return flag;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profilePopUpRef.current &&
      !profilePopUpRef.current.contains(event.target as Node)
    ) {
      setOpenProfile(false);
    }
  };

  const handleClickOutsideNotification = (event: MouseEvent) => {
    if (
      notificationPopUpRef.current &&
      !notificationPopUpRef.current.contains(event.target as Node)
    ) {
      setOpenNotification(false);
    }
  };

  const handleClickOutsideLanguages = (event: MouseEvent) => {
    if (
      languagesListRef.current &&
      !languagesListRef.current.contains(event.target as Node)
    ) {
      setOpenLanguage(false);
      setStyle(styles.languageWrapper);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideLanguages);

    return () => {
      document.removeEventListener('click', handleClickOutsideLanguages);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideNotification);

    return () => {
      document.removeEventListener('click', handleClickOutsideNotification);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>SKOTE</p>
      <div className={styles.dataWrapper}>
        <div className={styles.moonWrapper}>
          <img src={moon} alt='moon' className={styles.moonImage} />
        </div>

        <div className={styles.flagWrapper}>
          <img
            src={getFlagImage(language)}
            alt='moon'
            className={styles.flagImage}
            onClick={handleOpenlanguage}
          />

          <img
            src={arrow}
            alt='moon'
            className={styles.arrowImage}
            onClick={handleOpenlanguage}
          />

          <div className={style} ref={languagesListRef}>
            <div>
              {LanguagesList.map(({ id, value }) => (
                <div
                  key={id}
                  className={`${styles.languageStyle} ${
                    language === id ? styles.languageStyleActive : ''
                  }`}
                  onClick={() => handleLanguageClick(id)}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bellWrapper}>
          <img
            src={bell}
            alt='moon'
            className={styles.bellImage}
            ref={notificationPopUpRef}
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
          <div
            className={styles.userData}
            onClick={handleProfilePopUp}
            ref={profilePopUpRef}
          >
            <p className={styles.userName}>{settedUser?.first_name}</p>
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
