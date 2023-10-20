import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Navigate } from "react-router-dom";

import { userRegistration, userLogin } from '../../services/auth.service';

import { LoginForm, SignUpForm, ResetPassForm } from '../../components';

import styles from './Auth.module.css';
import routes from '../../routes';

type FormType = 'loginForm' | 'signUpForm' | 'resetPasswordForm';



const validationSchema = Yup.object().shape({
    newPass: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPass: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('newPass')], 'Passwords must match'),
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
        else if (formName === 'resetPasswordForm') {
            setFormValidationSchema(validationSchema);
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

            userRegistration(userData);

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
            {formName === 'resetPasswordForm' &&
                <ResetPassForm
                    changeForm={handleFormChange}
                    onSubmit={handleSubmit(handleFormSubmit)}
                    control={control}
                    errors={errors}
                />
            }
            {isAuthenticated && <Navigate to={routes.pricing} />}
        </div>
    );
};

export default Auth;
