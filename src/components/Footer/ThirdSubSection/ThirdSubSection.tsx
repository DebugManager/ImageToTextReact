import { useLanguage } from '../../../context/LanguageContext';

import styles from './ThirdSubSection.module.css';

export const ThirdSubSection = () => {
    const { t } = useLanguage();
    return (
        <div className={styles.infoWrapper}>
            <p className={styles.title}>{t('About')}</p>
            <p className={styles.description}>{t('Company')}</p>
            <p className={styles.description}>{t('support')}</p>
            <p className={styles.description}>{t('Terms_Conditions')}</p>
            <p className={styles.description}>{t('Privacy_Policy')}</p>
            <p className={styles.description}>{t('Cookie_Notice')}</p>
        </div>
    )
}
