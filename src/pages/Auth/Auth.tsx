import React, { useState, useEffect } from 'react';

import { LoginForm, SignUpForm, ResetPassForm } from '../../components';

import styles from './Auth.module.css';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';

const Auth: React.FC = () => {
    const [formName, setFormName] = useState<FormType>('signUpForm');

    const handleFormChange = (newForm: FormType) => {
        setFormName(newForm);
    };

    return (
        <div className={styles.wrapper}>
            {formName === 'loginForm' && <LoginForm changeForm={handleFormChange} />}
            {formName === 'signUpForm' && <SignUpForm changeForm={handleFormChange} />}
            {formName === 'resetPasswordForm' && <ResetPassForm changeForm={handleFormChange} />}
        </div>
    );
};

export default Auth;
