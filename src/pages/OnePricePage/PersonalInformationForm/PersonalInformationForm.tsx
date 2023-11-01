import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import * as Yup from 'yup';
import styles from './PersonalInformationForm.module.css';

interface IPersonalInfoData {
    address: string;
    city: string;
    postCode: string;
    country: string;
    isError?: boolean;
}

type InputTouched = {
    address: boolean;
    city: boolean;
    postCode: boolean;
    country: boolean;
};

interface IPersonalInfo {
    onSubmit?: (data: any) => void;
    control: any;
    errors: any;
    onUserDataChange: (data: IPersonalInfoData) => void;
}

const validationSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postCode: Yup.string().required('Post Code is required'),
    country: Yup.string().required('Country is required'),
});

export const PersonalInformationForm = ({ control, errors, onUserDataChange }: IPersonalInfo) => {
    const [formData, setFormData] = useState<IPersonalInfoData>({
        address: '',
        city: '',
        postCode: '',
        country: '',
    });

    const [inputTouched, setInputTouched] = useState<InputTouched>({
        address: false,
        city: false,
        postCode: false,
        country: false,
    });

    useEffect(() => {
        const validateData = async () => {
            try {
                await validationSchema.validate(formData, { abortEarly: false });
            } catch (error: any) {
                if (Yup.ValidationError.isError(error)) {
                    error?.inner?.forEach((e: Yup.ValidationError) => {
                        if (e.path) {
                            errors[e.path] = { type: e.type, message: e.message };
                        }
                    });
                }
            }
        };

        validateData();
        onUserDataChange(formData);

    }, [formData, inputTouched, errors, onUserDataChange]);

    const handleFieldChange = (field: keyof IPersonalInfoData, value: string) => {
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
            onUserDataChange({ ...formData, isError: true });
        } else {
            onUserDataChange(formData);
        }
    };


    return (
        <div className={styles.wrapper}>
            <p className={styles.choosePlanTitle}>2. Personal Informations</p>
            <p className={styles.choosePlanDesc}>Subscription Plan</p>
            <div className={styles.inputWrapper}>
                <div className={styles.cardWrapper}>
                    <label className={styles.cardNumberLabel}>Address Line 1</label>
                    <Controller
                        name="address"
                        control={control}
                        rules={{
                            required: 'Address is required',
                        }}
                        render={({ field }) => (
                            <input
                                className={styles.cardInput}
                                type="text"
                                placeholder="Address"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange('address', e.target.value);
                                }}
                                onFocus={() => {
                                    setInputTouched((prevTouched) => ({
                                        ...prevTouched,
                                        address: true,
                                    }));
                                }}
                            />
                        )}
                    />
                    {errors.address && inputTouched.address && <span className={styles.error}>{errors.address.message}</span>}
                </div>

                <div className={styles.cardWrapper}>
                    <label className={styles.cardNumberLabel}>City</label>
                    <Controller
                        name="city"
                        control={control}
                        rules={{
                            required: 'City is required',
                        }}
                        render={({ field }) => (
                            <input
                                className={styles.cardInput}
                                type="text"
                                placeholder="New York"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange('city', e.target.value);
                                }}
                                onFocus={() => {
                                    setInputTouched((prevTouched) => ({
                                        ...prevTouched,
                                        city: true,
                                    }));
                                }}
                            />
                        )}
                    />
                    {errors.city && inputTouched.city && <span className={styles.error}>{errors.city.message}</span>}
                </div>
            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.cardWrapper}>
                    <label className={styles.cardNumberLabel}>Post / Zip code</label>
                    <Controller
                        name="postCode"
                        control={control}
                        rules={{
                            required: 'Post / Zip code is required',
                        }}
                        render={({ field }) => (
                            <input
                                className={styles.cardInput}
                                type="text"
                                placeholder="5335"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange('postCode', e.target.value);
                                }}
                                onFocus={() => {
                                    setInputTouched((prevTouched) => ({
                                        ...prevTouched,
                                        postCode: true,
                                    }));
                                }}
                            />
                        )}
                    />
                    {errors.postCode && inputTouched.postCode && <span className={styles.error}>{errors.postCode.message}</span>}
                </div>

                <div className={styles.cardWrapper}>
                    <label className={styles.cardNumberLabel}>Country</label>
                    <Controller
                        name="country"
                        control={control}
                        rules={{
                            required: 'Country is required',
                        }}
                        render={({ field }) => (
                            <input
                                className={styles.cardInput}
                                type="text"
                                placeholder="United State"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleFieldChange('country', e.target.value);
                                }}
                                onFocus={() => {
                                    setInputTouched((prevTouched) => ({
                                        ...prevTouched,
                                        country: true,
                                    }));
                                }}
                            />
                        )}
                    />
                    {errors.country && inputTouched.country && <span className={styles.error}>{errors.country.message}</span>}
                </div>
            </div>
        </div>
    );
};
