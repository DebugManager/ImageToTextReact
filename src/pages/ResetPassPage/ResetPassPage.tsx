import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { ResetPassForm } from '../../components';

import styles from './ResetPassPage.module.css';
import { userResetPassword } from '../../services/auth.service';
import routes from '../../routes';

interface IUserReset {
    uid: string,
    token: string,
    new_password: string,
}

const validationSchema = Yup.object().shape({
    createPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('createPassword')], 'Passwords must match'),
});

const ResetPassPage = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const { uuid, token } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleFormSubmit = async (data: any) => {
        if (data?.createPassword && data?.confirmPassword && uuid && token) {
            setIsLoading(true);
            const userData: IUserReset = {
                uid: uuid,
                token: token,
                new_password: data.createPassword,
            };
            try {
                const response = await userResetPassword(userData);
                response === 'ok' && setIsLoading(false);
                setRedirect(true);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <ResetPassForm
                onSubmit={handleSubmit(handleFormSubmit)}
                control={control}
                errors={errors}
                isLoading={isLoading}
            />
            {redirect && <Navigate to={routes.index} />}
        </div>
    )
}


export default ResetPassPage;