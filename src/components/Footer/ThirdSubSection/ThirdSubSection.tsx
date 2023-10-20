import styles from './ThirdSubSection.module.css';

export const ThirdSubSection = () => {
    return (
        <div className={styles.infoWrapper}>
            <p className={styles.title}>About</p>
            <p className={styles.description}>Company</p>
            <p className={styles.description}>Support</p>
            <p className={styles.description}>Terms & Conditions</p>
            <p className={styles.description}>Privacy Policy</p>
            <p className={styles.description}>Cookie Notice</p>
        </div>
    )
}
