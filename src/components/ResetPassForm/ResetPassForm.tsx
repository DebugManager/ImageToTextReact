import styles from './ResetPass.module.css';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

interface IReset {
    changeForm: (newForm: FormType) => void;
}


const ResetPassForm = ({ changeForm }: IReset) => {
    return (
        <div className={styles.saveWrapper}>
            <div className={styles.wrapper}>
                <p className={styles.formTitle}>SKOTE</p>
                <p className={styles.formDescription}>Welcome back to SKOTE! Please Sign In to Continue.</p>

                <div className={styles.inputWrapper}>
                    <label className={styles.label} htmlFor="password">Create New Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.label} htmlFor="password">Confirm Password</label>
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

            <p className={styles.madedBy}>© 2023 crafted by ❤ Outreach</p>
        </div>
    )
}

export default ResetPassForm;
