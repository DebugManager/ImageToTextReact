import React from 'react';
import { Modal, Box } from '@mui/material';
import styles from './ModalStyles.module.css';

export const FeedBackModal = ({ openFeedBackModal, handleCloseFeedBack, handleSubmitFeedBack }: { openFeedBackModal: boolean, handleCloseFeedBack: () => void, handleSubmitFeedBack: () => void }) => {
    return (
        <Modal
            open={openFeedBackModal}
            onClose={handleCloseFeedBack}
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
                <p className={styles.firstModaltext}>Please could you help us improve our platform by providing feedback why you are cancelling your package?</p>
                <textarea placeholder='Feedback' className={styles.inputFeedBack} />
                <div className={styles.btnWrapper}>
                    <div className={styles.btnWrapp}>
                        <button className={styles.cancelPackageBtn} onClick={handleCloseFeedBack}>Close</button>
                        <button className={styles.subMitBtn} onClick={handleSubmitFeedBack}>Submit</button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}
