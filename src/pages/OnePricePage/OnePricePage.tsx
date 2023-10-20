import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Select, { StylesConfig } from 'react-select';

import styles from './OnePricePage.module.css';
import { colors } from 'react-select/dist/declarations/src/theme';

import AE from '../../assets/planCard/AmericanExpress.svg';
import mc from '../../assets/planCard/mastercard.svg';
import safe from '../../assets/planCard/save.png';
import stripe from '../../assets/planCard/stripe.svg';
import visa from '../../assets/planCard/visa.svg';
import card from '../../assets/planCard/card.svg';

const validationSchema = Yup.object().shape({
    type: Yup.string()
        .required('type is required'),
    timing: Yup.string()
        .required('Confirm Password is required'),

});

const customStyles: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        height: '24px',
        display: 'flex',
        padding: '5px 10px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '4px',
        border: '1px solid var(--text-color-20, #EFF2F7)',
        background: 'var(--text-color-10, #FFF)',
        minHeight: 'none',
        fontSize: '7px',
        boxShadow: 'none',
        "&:hover": {
            borderColor: "none"
        }
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        // height: '30px',
        padding: '0 6px'
    }),

    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '8px',
        width: '8px'
    }),

    dropdownIndicator: styles => ({
        ...styles,
        height: '8px',
        width: '8px',
        padding: '0px',
        marginBottom: '5px',
    }),

    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? "#EFF2F7" : "",
        "&:hover": {
            ...styles,
            backgroundColor: "#EFF2F7",
        }
    })
};

const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
];

const OnePricePage = () => {

    //TODO Make commponent smoler separate it!!! 
    const { id } = useParams();

    console.log(id);
    return (
        <div className={styles.wrapper}>
            <p className={styles.topTitle}>Choose your Pricing plan</p>
            <p className={styles.topDescription}>To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words If several languages coalesce</p>

            <div className={styles.infoWrapper}>
                <div className={styles.leftWrapper}>

                    <div className={styles.choosePlanWrapper}>

                        <p className={styles.choosePlanTitle}>1. Choose your plan</p>
                        <p className={styles.choosePlanDesc}>Subscription Plan</p>
                        <Select
                            options={options}
                            styles={customStyles}
                        />

                        <div className={styles.radiomainWrapper}>
                            <div className={styles.radioWrapper}>
                                <div className={styles.btnWrapper}>
                                    <input type='radio' id='monthlyRadioBtn' name='subscriptionType' className={styles.radio} />
                                    <label htmlFor='monthlyRadioBtn' className={styles.label}>Monthly</label>
                                </div>
                                <p className={styles.radioDescription}>To achieve this, it would be necessary to have uniform grammar</p>
                            </div>
                            <div className={styles.radioWrapper}>
                                <div className={styles.btnWrapper}>
                                    <input type='radio' id='annualRadioBtn' name='subscriptionType' className={styles.radio} />
                                    <label htmlFor='annualRadioBtn' className={styles.label}>Annual</label>
                                </div>
                                <p className={styles.radioDescription}>To achieve this, it would be necessary to have uniform grammar</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.paymantWrapper}>
                        <p className={styles.paymantTitle}>Payment Metode</p>
                        <div className={styles.paymentIcons}>
                            <img alt='payment' src={stripe} className={styles.paymentImg} />
                            <img alt='payment' src={mc} className={styles.paymentImg} />
                            <img alt='payment' src={visa} className={styles.paymentImg} />
                            <img alt='payment' src={AE} className={styles.paymentImg} />
                            <img alt='payment' src={safe} className={styles.paymentImg} />
                        </div>

                        <div className={styles.cardWrapper}>
                            <label className={styles.cardNumberLabel}>Card Number</label>
                            <input type='text' placeholder='9657 8364 6252 7422' className={styles.cardInput} />
                            <img alt='card' src={card} className={styles.cardImg} />
                        </div>

                        <div className={styles.bottomInputsWrapper}>
                            <div className={styles.inputLabelWrapper}>
                                <label className={styles.cardNumberLabel}>Name On Card</label>
                                <input className={styles.nameInput} placeholder='9657 8364 6252 7422' type='text' />
                            </div>

                            <div className={styles.inputLabelWrapper}>
                                <label className={styles.cardNumberLabel}>Expiry Date</label>
                                <input className={styles.nameInput} placeholder='22/2' type='text' />
                            </div>

                            <div className={styles.inputLabelWrapper}>
                                <label className={styles.cardNumberLabel}>CVV Code</label>
                                <input className={styles.nameInput} placeholder='345' type='text' />
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.rightWrapper}></div>
            </div>
        </div >
    )
}

export default OnePricePage;