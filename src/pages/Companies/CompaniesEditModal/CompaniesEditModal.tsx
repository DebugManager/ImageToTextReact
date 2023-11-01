import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { CircleLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { editCompany } from '../../../services/company.service';

import styles from '../CompanieModal/CompanieModal.module.css';


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

export default CustomErrorIcon;

interface IModal {
    isOpenEditModal: boolean;
    handleCloseEditModal: () => void;
    companyName?: string | null | undefined;
    companyId?: number | null | undefined;
    isEditLoading: boolean
}


export const CompaniesEditModal = ({ isOpenEditModal, handleCloseEditModal, companyName, companyId, isEditLoading }: IModal) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const createValidationSchema = Yup.object().shape({
        companieName: Yup.string()
            .required('Company Name is required'),
    });

    const { control, handleSubmit, reset, formState: { errors }, setValue,
    } = useForm({ resolver: yupResolver(createValidationSchema) });

    useEffect(() => {
        if (companyName) {
            setValue('companieName', companyName);
        }
    }, [companyName, setValue]);


    const onSubmit = async (data: any) => {
        setIsLoading(true);
        if (companyId) {
            const req = await editCompany(data.companieName, companyId);
            if (req.id) {
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
                handleCloseEditModal();
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
                reset();
                setIsLoading(false);
                handleCloseEditModal();
            }
        }
    }

    return (
        <Modal
            open={isOpenEditModal}
            onClose={handleCloseEditModal}
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
                // alignItems: 'flex-start',
                gap: '18px',
                borderRadius: '4px',
                background: 'var(--text-color-10, #FFF)',
                boxShadow: '1px 4px 15px 4px rgba(0, 0, 0, 0.10)',
            }}>
                {isEditLoading ?
                    <p>Loading...</p> :
                    <>
                        <p className={styles.modalTitle}>NEW COMPANY</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                                <label className={styles.label} htmlFor="companieName">Company name</label>
                                <Controller
                                    name="companieName"
                                    control={control}
                                    rules={{
                                        required: 'Company name is required',
                                    }}
                                    render={({ field }) => (
                                        <input
                                            defaultValue={companyName || ''}
                                            className={styles.input}
                                            type="text"
                                            placeholder="Enter List name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.companieName && <span className={styles.error}>{errors.companieName.message}</span>}
                            </div>
                            <div className={styles.btnWrapper}>
                                <button className={styles.cancelBtn} onClick={handleCloseEditModal}>Cancel</button>
                                <button className={styles.modalBtn} type='submit'>{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Save'}</button>
                            </div>
                        </form>
                    </>
                }
            </Box>
        </Modal>
    )
}

