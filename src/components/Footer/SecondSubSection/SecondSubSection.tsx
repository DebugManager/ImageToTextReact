import styles from './SecondSubSection.module.css';

export const SecondSubSection = () => {
    return (
        <div className={styles.infoWrapper}>
            <p className={styles.title}>Menu</p>
            <p className={styles.description}>Platform</p>
            <p className={styles.description}>Pricing</p>
            <p className={styles.description}>Sign in</p>
            <p className={styles.description}>Sign Up</p>
            <p className={styles.description}>Affiliates</p>
        </div>
    )
}
