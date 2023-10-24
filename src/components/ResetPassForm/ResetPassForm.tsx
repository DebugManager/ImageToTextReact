import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { CircleLoader } from 'react-spinners';

import styles from './ResetPass.module.css';

import icon from '../../assets/auth/eye-off.svg';

interface IReset {
    onSubmit: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
    isLoading: boolean,
}

const ResetPassForm = ({ onSubmit, control, errors, formOptions, isLoading }: IReset) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Welcome back to SKOTE! Please <br /> Sign In to Continue.</p>

                <form onSubmit={onSubmit}>
                    <div className={styles.inputWrapper}>
                        <Controller
                            name="createPassword"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="createPassword">Create New Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            className={styles.input}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            id="createPassword"
                                            {...field}
                                        />
                                        {errors.createPassword && <span className={styles.error}>{errors.createPassword.message}</span>}
                                        <div className={styles.iconWrapper}>
                                            <img
                                                alt="icon"
                                                src={icon}
                                                className={styles.eyeIcon}
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            id="confirmPassword"
                                            className={styles.input}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            {...field}
                                        />
                                        {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
                                        <div className={styles.iconWrapper}>
                                            <img
                                                alt="icon"
                                                src={icon}
                                                className={styles.eyeIcon}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <button className={styles.button} type="submit">{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Reset'}</button>

                </form>
            </div>

            <p className={styles.madedBy}>
                © 2023 crafted by <span className={styles.heart}></span> Outreach
            </p>
        </div>
    );
};

export default ResetPassForm;
