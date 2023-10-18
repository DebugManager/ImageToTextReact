import React from 'react'
import styles from './SignUpForm.module.css'

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

interface ISignUp {
    changeForm: (newForm: FormType) => void;
}

const SignUpForm = ({ changeForm }: ISignUp) => {

    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Create your account, and start to using SKOTE now!</p>

                <div className={styles.inputWrapper}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        name="email"
                        required
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.label} htmlFor="password">Create Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                    />
                </div>
                <button className={styles.button}>Sign Up</button>
            </div>
            <p className={styles.downDescription}>Have an account?<span className={styles.link} onClick={() => changeForm('loginForm')}> Login</span>.</p>
            <p className={styles.madedBy}>© 2023 crafted by ❤ Outreach</p>
        </div>
    )
}

export default SignUpForm
