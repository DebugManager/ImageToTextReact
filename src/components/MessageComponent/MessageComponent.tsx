import React from 'react';

import userIcon from '../../assets/ticket/user.jpeg';

import styles from './MessageComponent.module.css';

const MessageComponent = () => {
    return (
        <div className={styles.messageWrapper}>
            <img src={userIcon} alt='avatar' className={styles.userAvatar} />
            <div className={styles.messageData}>
                <p className={styles.userName}>Jon Dow</p>
                <p className={styles.messageText}>consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue</p>

            </div>
            <p className={styles.date}>March 20, 2023 10:06</p>
        </div>
    )
}

export default MessageComponent;
