import styles from './FirstSubSection.module.css';

const FirstSubSection = () => {
    return (
        <div className={styles.infoWrapper}>
            <p className={styles.mainTitle}>SKOTE</p>
            <p className={styles.description}>Start your free trial today</p>
            <p className={styles.infoText}>Try UpLead free for 7 days. Plans start at just $99/month with no contract. </p>
            <button className={styles.startTrialBtn}>Start Free trial</button>
        </div>
    )
}

export default FirstSubSection
