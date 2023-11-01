import React from 'react';

import styles from './ChatStatusComponent.module.css';

const ChatStatusComponent = () => {
    return (
        <div className={styles.rightWrapper}>
            <p className={styles.status}>Status</p>
            <p className={styles.statusChips}>In Progress</p>
            <p className={styles.reason}>Reason:</p>
            <p className={styles.reasonDescription}>amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue</p>
        </div>
    )
}

export default ChatStatusComponent;