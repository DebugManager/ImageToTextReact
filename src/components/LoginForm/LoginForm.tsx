import styles from './LoginForm.module.css';

import lock from '../../assets/auth/lock.svg';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

interface ILogin {
    changeForm: (newForm: FormType) => void;
}

const LoginForm = ({ changeForm }: ILogin) => {
    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Welcome back to SKOTE!  Please Sign In to Continue.</p>

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
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <button className={styles.button}>Login</button>
            </div>
            <div className={styles.downDescription}>
                <div className={styles.imgWrapper}>
                    <img alt='lock' src={lock} className={styles.lockedImg} />
                </div>
                <span className={styles.link} onClick={() => changeForm('resetPasswordForm')}> Forgot Password?</span>
            </div>
            <p className={styles.madedBy}>© 2023 crafted by ❤ Outreach</p>
        </div>
    )
}

export default LoginForm;