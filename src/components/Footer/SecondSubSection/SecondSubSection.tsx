import { useLanguage } from '../../../context/LanguageContext';

import styles from './SecondSubSection.module.css';

export const SecondSubSection = () => {
    const { t } = useLanguage();
    return (
        <div className={styles.infoWrapper}>
            <p className={styles.title}>{t('Menu')}</p>
            <p className={styles.description}>{t('Platform')}</p>
            <p className={styles.description}>{t('Pricing')}</p>
            <p className={styles.description}>{t('Sign_In')}</p>
            <p className={styles.description}>{t('Sign_Up')}</p>
            <p className={styles.description}>{t('Affiliates')}</p>
        </div>
    )
}
