import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { CircleLoader } from 'react-spinners';
import styles from './SignUpForm.module.css';

import icon from '../../assets/auth/eye-off.svg';

type FormType = 'loginForm' | 'signUpForm' | 'forgotPasswordForm';

interface ISignUp {
    changeForm: (newForm: FormType) => void;
    onSubmit: (data: any) => void;
    control: any;
    errors: any,
    isLoading: boolean,
}

const SignUpForm = ({ changeForm, onSubmit, control, errors, isLoading }: ISignUp) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRepPassword, setShowRepPassword] = useState<boolean>(false);

    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Create your account, and start to using SKOTE now!</p>

                <form onSubmit={onSubmit}>

                    <div className={styles.nameWrapper}>
                        <div className={styles.inputWrapper}>
                            <label className={styles.label} htmlFor="firstName">First Name</label>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{
                                    required: 'First Name is required',
                                }}
                                render={({ field }) => (
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="firstName"
                                        placeholder="Enter Name"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                        </div>

                        <div className={styles.inputWrapper}>
                            <label className={styles.label} htmlFor="lastName">Last Name</label>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{
                                    required: 'Last Name is required',
                                }}
                                render={({ field }) => (
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="lastName"
                                        placeholder='Enter Name'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                        </div>
                    </div>




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
                                    type="email"
                                    id="email"
                                    placeholder='Enter Email'
                                    {...field}
                                />
                            )}
                        />
                        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.inputWrapper}>
                        <Controller
                            name="createPassword"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="createPassword">Create Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            className={styles.input}
                                            type={showPassword ? 'text' : 'password'}
                                            id="createPassword"
                                            placeholder="Enter Password"
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
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            }}
                            render={({ field }) => (
                                <div className={styles.inputWrapper}>
                                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                                    <div className={styles.passInptWrapper}>
                                        <input
                                            className={styles.input}
                                            type={showRepPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            placeholder='Enter Password'
                                            {...field}
                                        />
                                        {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}

                                        <div className={styles.iconWrapper}>
                                            <img
                                                alt="icon"
                                                src={icon}
                                                className={styles.eyeIcon}
                                                onClick={() => setShowRepPassword(!showRepPassword)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    <button className={styles.button} type="submit">{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Sign Up'}</button>
                </form>
            </div>
            <p className={styles.downDescription}>Have an account?<span className={styles.link} onClick={() => changeForm('loginForm')}> Login</span>.</p>
            <p className={styles.madedBy}>© 2023 crafted by <span className={styles.heart}></span> Outreach</p>

        </div>
    )
}

export default SignUpForm
