import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import styles from './ResetPass.module.css';

import icon from '../../assets/auth/eye-off.svg';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

interface IReset {
    changeForm: (newForm: FormType) => void;
    onSubmit: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
}

const ResetPassForm = ({ changeForm, onSubmit, control, errors, formOptions }: IReset) => {
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
                            name="newPass"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="newPass">Create New Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            className={styles.input}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            id="newPass"
                                            {...field}
                                        />
                                        {errors.newPass && <span className={styles.error}>{errors.newPass.message}</span>}
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
                            name="confirmPass"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="confirmPass">Confirm Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            id="confirmPass"
                                            className={styles.input}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            {...field}
                                        />
                                        {errors.confirmPass && <span className={styles.error}>{errors.confirmPass.message}</span>}
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
                    <button className={styles.button} type="submit">
                        Reset
                    </button>
                </form>
            </div>

            <p className={styles.madedBy}>
                © 2023 crafted by <span className={styles.heart}></span> Outreach
            </p>
        </div>
    );
};

export default ResetPassForm;
