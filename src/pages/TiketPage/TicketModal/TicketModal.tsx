import React, { ChangeEvent, useState } from 'react';
import { Modal, Box } from '@mui/material';
import { CircleLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { createNewTickets } from '../../../services/ticket.service';

import styles from './TicketModal.module.css';

import link from '../../../assets/ticket/link.svg';


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
    currentUser: number | null;
}

type FileState = {
    selectedFile: File | null;
    fileName: string;
};

const initialState: FileState = {
    selectedFile: null,
    fileName: '',
};

export const TicketModal = ({ isOpen, handleClose, currentUser }: IModal) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fileState, setFileState] = useState<FileState>(initialState);
    const createValidationSchema = Yup.object().shape({
        subject: Yup.string()
            .required('Subject is required'),
        description: Yup.string()
            .required('Description is required'),
    });

    const { control, handleSubmit, reset, formState: { errors },
    } = useForm({ resolver: yupResolver(createValidationSchema) });

    const onSubmit = async (data: any) => {
        setIsLoading(true);

        if (currentUser) {
            const formData = new FormData();
            data.description && formData.append('description', data.description);
            data.subject && formData.append('subject', data.subject);
            if (fileState.selectedFile) {
                formData.append('picture', fileState.selectedFile);
                formData.append('user_id', currentUser.toString());
                formData.append('status', 'Pending');

                const req = await createNewTickets(formData);
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
            } else {
                formData.append('user_id', currentUser.toString());
                formData.append('status', 'Pending');
                const req = await createNewTickets(formData);
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
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            const name = selectedFile.name;
            const truncatedName = name.length > 8 ? name.substring(0, 8) + '...' : name;
            setFileState({
                selectedFile,
                fileName: truncatedName,
            });
        }
    };

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
                <p className={styles.modalTitle}>Add new ticket</p>
                <p className={styles.description}>Share the most important info with us. After you open a request, you can add updates via My support requests.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                        <label className={styles.label} htmlFor="subject">Subject</label>
                        <Controller
                            name="subject"
                            control={control}
                            rules={{
                                required: 'Subject name is required',
                            }}
                            render={({ field }) => (
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Subject"
                                    {...field}
                                />
                            )}
                        />
                        {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                    </div>

                    <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                        <label className={styles.label} htmlFor="description">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: 'Description name is required',
                            }}
                            render={({ field }) => (
                                <textarea
                                    className={styles.input}
                                    placeholder="Description"
                                    {...field}
                                />
                            )}
                        />
                        {errors.description && <span className={styles.error}>{errors.description.message}</span>}

                    </div>

                    <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                        <input
                            className={styles.inputFile}
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)}

                        />

                        <label
                            className={styles.uploadButton}
                            htmlFor="fileInput"
                        >
                            <img alt='upload' src={link} />
                            <span className={styles.fileName}>{fileState.fileName ? fileState.fileName : 'Attach Files'}</span>
                        </label>
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
