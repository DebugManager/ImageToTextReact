import React from 'react';
import { Modal, Box } from '@mui/material';
import styles from './ModalStyles.module.css';

export const FinalModal = ({ openFinalModal, handleCloseAll }: { openFinalModal: boolean, handleCloseAll: () => void }) => {
    return (
        <Modal
            open={openFinalModal}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                width: '320px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'inline-flex',
                padding: '10px',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '4px',
                background: 'var(--text-color-10, #FFF)',
                boxShadow: '1px 4px 15px 4px rgba(0, 0, 0, 0.10)',
            }}>
                <p className={styles.firstModaltext}>Your membership will be cancelled on 25/12/2023 and you will no longer be billed. Any data saved in our platform will be automatically deleted.</p>
                <div className={styles.btnWrapper}>
                    <div className={styles.btnWrapp}>
                        <button className={styles.cancelPackageBtn} onClick={handleCloseAll}>Close</button>
                        <button className={styles.subMitBtn} onClick={handleCloseAll}>Submit</button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}
