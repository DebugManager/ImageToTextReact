import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller } from 'react-hook-form';
import styles from './PaymantForm.module.css';

import AE from '../../../assets/planCard/AmericanExpress.svg';
import mc from '../../../assets/planCard/mastercard.svg';
import safe from '../../../assets/planCard/save.png';
import stripe from '../../../assets/planCard/stripe.svg';
import visa from '../../../assets/planCard/visa.svg';
import card from '../../../assets/planCard/card.svg';

interface ICardInfo {
    cardNumber: number | string;
    name: string;
    date: number | string;
    cvv: string;
    isError?: boolean;
}

type InputTouched = {
    cardNumber: boolean;
    name: boolean;
    date: boolean;
    cvv: boolean;
};

interface IChoosePlan {
    onSubmit?: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
    onUserDataChage: (data: ICardInfo) => void;
}

const validationSchema = Yup.object().shape({
    cardNumber: Yup.string().required('Card number is required'),
    name: Yup.string().required('Name is required'),
    date: Yup.string().required('Date Code is required'),
    cvv: Yup.string().required('Cvv is required'),
});

export const PaymantForm = ({ control, errors, onUserDataChage }: IChoosePlan) => {
    const [formData, setFormData] = useState<ICardInfo>({
        cardNumber: '',
        name: '',
        date: '',
        cvv: '',
    });

    const [inputTouched, setInputTouched] = useState<InputTouched>({
        cardNumber: false,
        name: false,
        date: false,
        cvv: false,
    });

    useEffect(() => {
        const validateData = async () => {
            try {
                await validationSchema.validate(formData, { abortEarly: false });
            } catch (error: any) {
                if (Yup.ValidationError.isError(error)) {
                    error.inner.forEach((e: Yup.ValidationError) => {
                        if (e.path) {
                            errors[e.path] = { type: e.type, message: e.message };
                        }
                    });
                }
            }
        };

        validateData();
        onUserDataChage(formData);

    }, [formData, inputTouched, errors, onUserDataChage]);

    const handleFieldChange = (field: keyof ICardInfo, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        setInputTouched((prevTouched) => ({
            ...prevTouched,
            [field]: true,
        }));

        if (errors[field]) {
            delete errors[field];
        }

        const errorCount = Object.keys(errors).length;
        if (errorCount > 0) {
            onUserDataChage({ ...formData, isError: true });
        } else {
            onUserDataChage(formData);
        }
    };
    return (
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
                <Controller
                    name="cardNumber"
                    control={control}
                    rules={{
                        required: 'Card Number is required',
                    }}
                    render={({ field }) => (
                        <>
                            <input
                                className={styles.cardInput}
                                type="text"
                                placeholder="9657 8364 6252 7422"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange('cardNumber', e.target.value);
                                }}
                                onFocus={() => {
                                    setInputTouched((prevTouched) => ({
                                        ...prevTouched,
                                        cardNumber: true,
                                    }));
                                }}
                            />
                            <img alt='card' src={card} className={styles.cardImg} />
                        </>
                    )}
                />
                {errors.cardNumber && inputTouched.cardNumber && <span className={styles.error}>{errors.cardNumber.message}</span>}
            </div>

            <div className={styles.bottomInputsWrapper}>
                <div className={styles.inputLabelWrapper}>
                    <label className={styles.cardNumberLabel}>Name On Card</label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Name is required',
                        }}
                        render={({ field }) => (
                            <>
                                <input
                                    className={styles.nameInput}
                                    type="text"
                                    placeholder="9657 8364 6252 7422"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange('name', e.target.value);
                                    }}
                                    onFocus={() => {
                                        setInputTouched((prevTouched) => ({
                                            ...prevTouched,
                                            name: true,
                                        }));
                                    }}
                                />
                            </>
                        )}
                    />
                    {errors.name && inputTouched.name && <span className={styles.error}>{errors.name.message}</span>}
                    {/* <input className={styles.nameInput} placeholder='9657 8364 6252 7422' type='text' /> */}
                </div>

                <div className={styles.inputLabelWrapper}>
                    <label className={styles.cardNumberLabel}>Expiry Date</label>
                    <Controller
                        name="date"
                        control={control}
                        rules={{
                            required: 'Date is required',
                        }}
                        render={({ field }) => (
                            <>
                                <input
                                    className={styles.nameInput}
                                    type="text"
                                    placeholder="22/2"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange('date', e.target.value);
                                    }}
                                    onFocus={() => {
                                        setInputTouched((prevTouched) => ({
                                            ...prevTouched,
                                            date: true,
                                        }));
                                    }}
                                />
                            </>
                        )}
                    />
                    {errors.date && inputTouched.date && <span className={styles.error}>{errors.date.message}</span>}
                    {/* <input className={styles.nameInput} placeholder='22/2' type='text' /> */}
                </div>

                <div className={styles.inputLabelWrapper}>
                    <label className={styles.cardNumberLabel}>CVV Code</label>
                    <Controller
                        name="cvv"
                        control={control}
                        rules={{
                            required: 'Cvv is required',
                        }}
                        render={({ field }) => (
                            <>
                                <input
                                    className={styles.nameInput}
                                    type="text"
                                    placeholder="345"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleFieldChange('cvv', e.target.value);
                                    }}
                                    onFocus={() => {
                                        setInputTouched((prevTouched) => ({
                                            ...prevTouched,
                                            cvv: true,
                                        }));
                                    }}
                                />
                            </>
                        )}
                    />
                    {errors.cvv && inputTouched.cvv && <span className={styles.error}>{errors.cvv.message}</span>}
                    {/* <input className={styles.nameInput} placeholder='345' type='text' />/ */}
                </div>
            </div>
        </div>
    )
}
