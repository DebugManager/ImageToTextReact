import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Navigate } from "react-router-dom";

import { userRegistration, userLogin, userResetPasswordLink } from '../../services/auth.service';

import { LoginForm, SignUpForm, ForgotPassForm } from '../../components';

import styles from './Auth.module.css';
import routes from '../../routes';

type FormType = 'loginForm' | 'signUpForm' | 'forgotPasswordForm';

const forgotPassSchema = Yup.object().shape({
    resetPassEmail: Yup.string().required('Email is required'),
});

const signInValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required'),
    createPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('createPassword')], 'Passwords must match'),
});

const loginValidationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    loginPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
});

const Auth: React.FC = () => {
    const [formName, setFormName] = useState<FormType>('signUpForm');
    const [formValidationSchema, setFormValidationSchema] = useState<Yup.AnyObjectSchema | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (formName === 'signUpForm') {
            setFormValidationSchema(signInValidationSchema);
        } else if (formName === 'loginForm') {
            setFormValidationSchema(loginValidationSchema);
        }
        else if (formName === 'forgotPasswordForm') {
            setFormValidationSchema(forgotPassSchema);
        }
    }, [formName]);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: formValidationSchema ? yupResolver(formValidationSchema) : undefined,
    });

    const handleFormSubmit = async (data: any) => {
        if (
            data?.confirmPassword &&
            data?.createPassword &&
            data?.email &&
            data?.firstName &&
            data?.lastName
        ) {
            setIsLoading(true);
            const userData = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                password: data.createPassword,
            };

            const res = await userRegistration(userData);
            if (res === 'ok') {
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }

        } else if (data?.loginPassword && data?.email) {
            setIsLoading(true);
            const userData = {
                email: data.email,
                password: data.loginPassword,
            };

            const res = await userLogin(userData);
            if (res === 'ok') {
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }

        } else if (data?.resetPassEmail) {
            setIsLoading(true);
            const userData = {
                email: data.resetPassEmail,
            };
            const res = await userResetPasswordLink(userData);
            if (res === 'ok') {
                setIsLoading(false);
            }
        }

    };

    const handleFormChange = (newForm: FormType) => {
        setFormName(newForm);
        reset();
    };


    return (
        <div className={styles.wrapper}>
            {formName === 'loginForm' &&
                <LoginForm
                    changeForm={handleFormChange}
                    onSubmit={handleSubmit(handleFormSubmit)}
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                />
            }
            {formName === 'signUpForm' &&
                <SignUpForm
                    changeForm={handleFormChange}
                    onSubmit={handleSubmit(handleFormSubmit)}
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                />
            }
            {formName === 'forgotPasswordForm' &&
                <ForgotPassForm
                    changeForm={handleFormChange}
                    onSubmit={handleSubmit(handleFormSubmit)}
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                />
            }
            {isAuthenticated && <Navigate to={routes.pricing} />}
        </div>
    );
};

export default Auth;
