import { format } from 'date-fns';
import userIcon from '../../assets/ticket/user.jpeg';

import styles from './MessageComponent.module.css';

interface IMessage {
  content: string;
  id: number;
  room: number;
  timestamp: string;
  user: number;
  avatar?: string;
  key: number;
}

const MessageComponent = ({ content, avatar, timestamp }: IMessage) => {
  const handleChangeDate = (data: string) => {
    const parsedDate = new Date(data);
    return format(parsedDate, 'MMMM d, yyyy HH:mm');
  };

  return (
    <div className={styles.messageWrapper}>
      <img
        src={avatar || userIcon}
        alt='avatar'
        className={styles.userAvatar}
      />
      <div className={styles.messageData}>
        <p className={styles.userName}>{'Jon Dow'}</p>
        <p className={styles.messageText}>{content}</p>
      </div>
      <p className={styles.date}>
        {timestamp && handleChangeDate(timestamp)}
      </p>
    </div>
  );
};

export default MessageComponent;
