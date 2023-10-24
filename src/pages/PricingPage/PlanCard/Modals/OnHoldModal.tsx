import React from 'react';
import { Modal, Box } from '@mui/material';
import styles from './ModalStyles.module.css';


export const OnHoldModal = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                width: '400px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'inline-flex',
                padding: '18px 10px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: '18px',
                borderRadius: '4px',
                background: 'var(--text-color-10, #FFF)',
                boxShadow: '1px 4px 15px 4px rgba(0, 0, 0, 0.10)',
            }}>
                <p className={styles.firstModaltext}>“You are about to cancel your membership. Once cancelled all posts and profiles you are watching will be deleted. You can put your account on hold for $14.99 a month that will keep all of your settings and watched profiles and posts. When you want to use our platform again, simply purchase a membership. Click here to put your account on hold.”</p>
                <div className={styles.btnWrapper}>
                    <div className={styles.btnWrapp}>
                        <button className={styles.cancelPackageBtn} onClick={handleClose}>Cancel Package</button>
                        <button className={styles.onHold}>Put Account on Hold</button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}
