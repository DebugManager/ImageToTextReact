import { useLanguage } from '../../../context/LanguageContext';

import styles from './FirstSubSection.module.css';

const FirstSubSection = () => {
    const { t } = useLanguage();

    return (
        <div className={styles.infoWrapper}>
            <p className={styles.mainTitle}>SKOTE</p>
            <p className={styles.description}>{t('footer_title')}</p>
            <p className={styles.infoText}>{t('footer_desctiption')}</p>
            <button className={styles.startTrialBtn}>{t('Start_Free_Trial')}</button>
        </div>
    )
}

export default FirstSubSection
