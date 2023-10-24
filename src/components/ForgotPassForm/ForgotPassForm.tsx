import React from 'react';
import { Controller } from 'react-hook-form';
import { CircleLoader } from 'react-spinners';

import styles from './ForgotPassForm.module.css';

type FormType = 'loginForm' | 'signUpForm' | 'forgotPasswordForm';

interface IReset {
    changeForm: (newForm: FormType) => void;
    onSubmit: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
    isLoading: boolean,
}

const ForgotPassForm = ({ changeForm, onSubmit, control, errors, formOptions, isLoading }: IReset) => {
    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Welcome back to SKOTE! Please <br /> Sign In to Continue.</p>

                <form onSubmit={onSubmit}>
                    <div className={styles.inputWrapper}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <Controller
                            name="resetPassEmail"
                            control={control}
                            rules={{
                                required: 'Email is required',
                            }}
                            render={({ field }) => (
                                <input
                                    className={styles.input}
                                    type="email"
                                    id="rresetPassEmail"
                                    placeholder='Enter Email'
                                    {...field}
                                />
                            )}
                        />
                        {errors.resetPassEmail && <span className={styles.error}>{errors.resetPassEmail.message}</span>}
                    </div>
                    <button className={styles.button} type="submit">{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Sign Up'}</button>

                </form>
            </div>

            <p className={styles.downDescription}>Have an account?<span className={styles.linkBottom} onClick={() => changeForm('loginForm')}>  Login</span>.</p>

            <p className={styles.madedBy}>
                © 2023 crafted by <span className={styles.heart}></span> Outreach
            </p>
        </div>
    );
};

export default ForgotPassForm;
