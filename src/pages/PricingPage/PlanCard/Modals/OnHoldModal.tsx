import React, { useEffect, useState } from 'react';
import { Modal, Box } from '@mui/material';
import { CircleLoader } from 'react-spinners';

import {
  cancelSubscription,
  putAccountOnHold,
} from '../../../../services/pricing.service';
import { getUser } from '../../../../services/locastorage.service';

import styles from './ModalStyles.module.css';

interface IUser {
  address_line1: string;
  affiliate: boolean;
  affiliate_code: null | string;
  city: string;
  company: any[];
  country: string;
  current_plan: string;
  customer_id: string;
  email: string;
  first_name: string;
  groups: any[];
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  joined: string;
  last_login: string;
  last_name: string;
  password: string;
  phone: null | string;
  status: string;
  type: string;
  user_permissions: any[];
  zip_code: number;
  payment_method_id: string;
  subscription_id: string;
  affiliate_id: string | number;
}

export const OnHoldModal = ({
  open,
  handleClose,
  isCancelLoading,
}: {
  userID: number | null;
  open: boolean;
  isCancelLoading?: boolean;
  handleClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>();

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const handleCancelPackage = async () => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const res = await cancelSubscription(
          user.customer_id,
          user.subscription_id
        );
        if (res.success === true) {
          setIsLoading(false);
          handleClose();
        } else {
          setIsLoading(false);
          console.error(res);
          handleClose();
        }
      } catch (error) {
        setIsLoading(false);
        handleClose();
        console.error(error);
      }
    }
  };

  const handleSetPacksgeOnHold = async () => {
    setIsLoading(true);
    if (user) {
      const data = await putAccountOnHold(
        'price_1O9rhLDV4Z1ssWPD7vVu814B',
        user.customer_id,
        user.payment_method_id,
        user.subscription_id
      );

      if (data.success === true) {
        setIsLoading(false);
        window.location.href = '/pricing';
      } else {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
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
        }}
      >
        <p className={styles.firstModaltext}>
          “You are about to cancel your membership. Once cancelled all posts and
          profiles you are watching will be deleted. You can put your account on
          hold for $14.99 a month that will keep all of your settings and
          watched profiles and posts. When you want to use our platform again,
          simply purchase a membership. Click here to put your account on hold.”
        </p>
        <div className={styles.btnWrapper}>
          <div className={styles.btnWrapp}>
            <button
              className={styles.cancelPackageBtn}
              onClick={handleCancelPackage}
            >
              {isCancelLoading ? (
                <CircleLoader
                  loading={isCancelLoading}
                  color={'#34C38F'}
                  size={10}
                />
              ) : (
                'Cancel Package'
              )}
            </button>
            <button className={styles.onHold} onClick={handleSetPacksgeOnHold}>
              {isLoading ? (
                <CircleLoader loading={isLoading} color={'#FFF'} size={10} />
              ) : (
                'Put Account on Hold'
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
