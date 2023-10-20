import React from 'react';

import FirstSubSection from './FirstSubSection/FirstSubSection';
import { SecondSubSection } from './SecondSubSection/SecondSubSection';
import { ThirdSubSection } from './ThirdSubSection/ThirdSubSection';

import styles from './Footer.module.css';

import facebook from '../../assets/footer/facebook.svg';
import instagram from '../../assets/footer/instagram.svg';
import linkedin from '../../assets/footer/linkedin.svg';
import twitter from '../../assets/footer/twitter.svg';
import youtube from '../../assets/footer/youtube.svg';

const Footer = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <FirstSubSection />
                <SecondSubSection />
                <ThirdSubSection />
            </div>
            <div className={styles.subFooter}>
                <p className={styles.creator}>
                    © Copyright 2022 Skote | All Rights Reserved
                </p>

                <div className={styles.imgWrapper}>
                    <img alt='social' src={facebook} className={styles.img} />
                    <img alt='social' src={twitter} className={styles.img} />
                    <img alt='social' src={instagram} className={styles.img} />
                    <img alt='social' src={linkedin} className={styles.img} />
                    <img alt='social' src={youtube} className={styles.img} />
                </div>
            </div>
        </>
    )
}

export default Footer;