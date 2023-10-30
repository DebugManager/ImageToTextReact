import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { CircleLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { createNewFeature } from '../../../services/feature.servise';

import styles from '../../Companies/CompanieModal/CompanieModal.module.css';

const myCustomStyles = {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
};

const progressBarStyles = {
    background: '#556EE6',
};

const CustomCheckmark = () => (
    <div style={{ color: '#556EE6' }}>✔</div>
);

const CustomErrorIcon = () => (
    <div style={{ color: 'red' }}>✘</div>
);


interface IModal {
    isOpen: boolean;
    handleClose: () => void;
}

export const FeaturesModal = ({ isOpen, handleClose }: IModal) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const createValidationSchema = Yup.object().shape({
        featureName: Yup.string()
            .required('Feature Name is required'),
    });

    const { control, handleSubmit, reset, formState: { errors },
    } = useForm({ resolver: yupResolver(createValidationSchema) });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        const req = await createNewFeature(data);
        if (req?.id) {
            setIsLoading(false);
            toast.success('The company has been successfully created', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
            reset();
            handleClose();
        } else {
            toast.error('Something goes wrong', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast-error',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomErrorIcon />,
            });
            setIsLoading(false);
            reset();
            handleClose();
        }

    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                width: '220px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'inline-flex',
                padding: '18px 10px',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: '4px',
                background: 'var(--text-color-10, #FFF)',
                boxShadow: '1px 4px 15px 4px rgba(0, 0, 0, 0.10)',
            }}>
                <p className={styles.modalTitle}>Add new feature</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                        <label className={styles.label} htmlFor="featureName">Company name</label>
                        <Controller
                            name="featureName"
                            control={control}
                            rules={{
                                required: 'Feature name is required',
                            }}
                            render={({ field }) => (
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Feature"
                                    {...field}
                                />
                            )}
                        />
                        {errors.featureName && <span className={styles.error}>{errors.featureName.message}</span>}
                    </div>
                    <div className={styles.btnWrapper}>
                        <button className={styles.cancelBtn} onClick={handleClose}>Cancel</button>
                        <button className={styles.modalBtn} type='submit'>{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Save'}</button>
                    </div>
                </form>
            </Box>
        </Modal>
    )
}
