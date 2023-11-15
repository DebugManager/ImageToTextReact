import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';

import { setUser } from '../../../services/locastorage.service';
import { markAsReader } from '../../../services/notification.service';

import styles from './NotificationPopUp.module.css';

const myCustomStyles = {
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
};

const progressBarStyles = {
  background: '#556EE6',
};

const CustomCheckmark = () => <div style={{ color: '#556EE6' }}>✔</div>;

const CustomErrorIcon = () => <div style={{ color: 'red' }}>✘</div>;

interface INotification {
  id: number;
  text: string;
  data: string;
}

const NotificationPopUp = ({
  userId,
  userNotifications,
  isOpen,
  notifications,
  notificationIsLoading,
  updateNotifications,
}: {
  isOpen: boolean;
  notificationIsLoading: boolean;
  userId: number | undefined;
  userNotifications: number[] | null | undefined;
  notifications: INotification[] | null;
  updateNotifications: () => void;
}) => {
  const [style, setStyle] = useState(styles.notificationWrapper);
  const [loadingNotifications, setLoadingNotifications] = useState<
    Record<number, boolean>
  >({});

  const handleChangeDate = (data: string) => {
    const parsedDate = new Date(data);
    return format(parsedDate, 'MMMM d, yyyy HH:mm');
  };

  useEffect(() => {
    if (isOpen) {
      setStyle(
        `${styles.notificationWrapper} ${styles.notificationWrapperOpened}`
      );
    } else {
      setStyle(styles.notificationWrapper);
    }
  }, [isOpen]);

  const handleMarkAsReaded = async (id: number) => {
    setLoadingNotifications((prevLoading) => ({ ...prevLoading, [id]: true }));
    if (id && userId) {
      const data = {
        user_id: userId,
        notification_id: id,
      };
      const res = await markAsReader(data);
      if (res.user.id) {
        setUser(res.user);
        toast.success('Mark as readed', {
          position: 'top-right',
          autoClose: 3000,
          className: 'my-custom-toast',
          style: myCustomStyles,
          progressClassName: 'my-custom-progress-bar',
          progressStyle: progressBarStyles,
          icon: <CustomCheckmark />,
        });
        setLoadingNotifications((prevLoading) => ({
          ...prevLoading,
          [id]: false,
        }));
        updateNotifications();
      } else {
        toast.error('Something goes wrong', {
          position: 'top-right',
          autoClose: 3000,
          className: 'my-custom-toast-error',
          style: myCustomStyles,
          progressClassName: 'my-custom-progress-bar',
          progressStyle: progressBarStyles,
          icon: <CustomErrorIcon />,
        });
        setLoadingNotifications((prevLoading) => ({
          ...prevLoading,
          [id]: false,
        }));
      }
    }
  };

  const unreadNotifications = notifications?.filter(
    ({ id }) => !userNotifications?.includes(id)
  );
  const readNotifications = notifications?.filter(
    ({ id }) => userNotifications?.includes(id)
  );

  const orderedNotifications = unreadNotifications
    ? [...unreadNotifications, ...(readNotifications || [])]
    : readNotifications;

  const groupNotificationsByDate = (notificationList: INotification[]) => {
    const groupedNotifications: { [key: string]: INotification[] } = {};

    notificationList.forEach((notification) => {
      const notificationDate = new Date(notification.data);
      const dateKey = `${notificationDate.getFullYear()}-${
        notificationDate.getMonth() + 1
      }-${notificationDate.getDate()}`;

      if (!groupedNotifications[dateKey]) {
        groupedNotifications[dateKey] = [];
      }

      groupedNotifications[dateKey].push(notification);
    });

    return groupedNotifications;
  };

  const renderNotificationGroups = () => {
    if (!orderedNotifications || orderedNotifications.length === 0) {
      return <div>No notifications</div>;
    }

    const groupedNotifications = groupNotificationsByDate(orderedNotifications);

    const sortedDateKeys = Object.keys(groupedNotifications).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);

      if (dateA.toDateString() === dateB.toDateString()) return 0;
      return dateA > dateB ? -1 : 1;
    });

    return sortedDateKeys.map((dateKey) => {
      const notificationDate = new Date(dateKey);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let groupTitle = 'Earlier';
      if (notificationDate.toDateString() === today.toDateString()) {
        groupTitle = 'Today';
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (notificationDate.toDateString() === yesterday.toDateString()) {
          groupTitle = 'Yesterday';
        }
      }

      return (
        <div key={dateKey}>
          <p className={styles.dayStyles}>{groupTitle}</p>
          {groupedNotifications[dateKey].map(({ data, text, id }) => (
            <div
              onClick={() => handleMarkAsReaded(id)}
              className={`${styles.tasksWrapper} ${
                userNotifications && userNotifications.includes(id)
                  ? styles.specialNotification
                  : styles.notificationTextNotReaded
              }`}
              key={id}
            >
              <div className={styles.taskTextWrapper}>
                <p className={styles.textDescription}>{text}</p>
                <div className={styles.dateLoaderWrapper}>
                  <p className={styles.time}>{handleChangeDate(data)}</p>
                  {loadingNotifications[id] && (
                    <CircleLoader
                      loading={loadingNotifications[id]}
                      color={'#556EE6'}
                      size={20}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={style}>
      <p className={styles.notTitle}>Notifications</p>
      {notificationIsLoading ? (
        <div>Loading...</div>
      ) : (
        renderNotificationGroups()
      )}
    </div>
  );
};

export default NotificationPopUp;
