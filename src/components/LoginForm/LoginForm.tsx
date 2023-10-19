import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import styles from './LoginForm.module.css';

import lock from '../../assets/auth/lock.svg';
import icon from '../../assets/auth/eye-off.svg';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

interface ILogin {
    changeForm: (newForm: FormType) => void;
    onSubmit: (data: any) => void;
    control: any;
    errors: any,
}

const LoginForm = ({ changeForm, onSubmit, control, errors }: ILogin) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Welcome back to SKOTE!  Please <br /> Sign In to Continue.</p>

                <form onSubmit={onSubmit}>
                    <div className={styles.emailWrapper}>
                        <div className={styles.inputWrapper}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                }}
                                render={({ field }) => (
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Enter Email"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </div>
                    </div>


                    <div className={styles.inputWrapper}>
                        <Controller
                            name="loginPassword"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="loginPassword">Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            className={styles.input}
                                            type={showPassword ? 'text' : 'password'}
                                            id="loginPassword"
                                            placeholder="Enter Password"
                                            {...field}
                                        />
                                        {errors.loginPassword && <span className={styles.error}>{errors.loginPassword.message}</span>}
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
                    <button className={styles.button} type='submit'>Login</button>
                </form>
            </div>
            <div className={styles.downDescription}>
                <div className={styles.imgWrapper}>
                    <img alt='lock' src={lock} className={styles.lockedImg} />
                </div>
                <span className={styles.link} onClick={() => changeForm('resetPasswordForm')}> Forgot Password?</span>
            </div>
            <p className={styles.downDescriptionText}>Don’t Have an account? <span className={styles.link} onClick={() => changeForm('signUpForm')}> Register.</span></p>

            <p className={styles.madedBy}>© 2023 crafted by <span className={styles.heart}></span> Outreach</p>
        </div>
    )
}

export default LoginForm;