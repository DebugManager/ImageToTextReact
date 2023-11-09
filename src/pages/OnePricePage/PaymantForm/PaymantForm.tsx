import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Controller } from 'react-hook-form';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';

import styles from './PaymantForm.module.css';

import AE from '../../../assets/planCard/AmericanExpress.svg';
import mc from '../../../assets/planCard/mastercard.svg';
import safe from '../../../assets/planCard/save.png';
import stripe from '../../../assets/planCard/stripe.svg';
import visa from '../../../assets/planCard/visa.svg';
import card from '../../../assets/planCard/card.svg';

interface ICardInfo {
  cardNumber: number | string;
  name: string;
  date: number | string;
  cvv: string;
  isError?: boolean;
}

type InputTouched = {
  cardNumber: boolean;
  name: boolean;
  date: boolean;
  cvv: boolean;
};

interface IChoosePlan {
  onSubmit?: (data: any) => void;
  control: any;
  errors: any;
  formOptions?: any;
  onUserDataChage: (data: ICardInfo) => void;
  handleSubmit: (e: any) => void;
}

const validationSchema = Yup.object().shape({
  cardNumber: Yup.string().required('Card number is required'),
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date Code is required'),
  cvv: Yup.string().required('Cvv is required'),
});

export const PaymantForm = ({
  control,
  errors,
  onUserDataChage,
  handleSubmit,
}: IChoosePlan) => {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const useOptions = () => {
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize: '7px',
            color: '#424770',
            // letterSpacing: '0.025em',
            fontFamily: 'Poppins',
            '::placeholder': {
              color: '#555B6D',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }),
      []
    );

    return options;
  };

  const options = useOptions();

  const handleCardDetailsChange = (event: any) => {
    console.log(event);

    event.error
      ? setCheckoutError(event.error.message)
      : setCheckoutError(null);
  };

  return (
    <div className={styles.paymantWrapper}>
      <p className={styles.paymantTitle}>Payment Metode</p>
      <div className={styles.paymentIcons}>
        <img alt='payment' src={stripe} className={styles.paymentImg} />
        <img alt='payment' src={mc} className={styles.paymentImg} />
        <img alt='payment' src={visa} className={styles.paymentImg} />
        <img alt='payment' src={AE} className={styles.paymentImg} />
        <img alt='payment' src={safe} className={styles.paymentImg} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.cardWrapper}>
          <label className={styles.cardNumberLabel}>Card Number</label>
          <CardNumberElement
            className={styles.nameInput}
            options={options}
            onChange={handleCardDetailsChange}
          />
        </div>

        <div className={styles.bottomInputsWrapper}>
          <div className={styles.inputLabelWrapper}>
            <label className={styles.cardNumberLabel}>Expiry Date</label>
            <CardExpiryElement
              className={styles.nameInput}
              options={options}
              onChange={handleCardDetailsChange}
            />
          </div>

          <div className={styles.inputLabelWrapper}>
            <label className={styles.cardNumberLabel}>CVV Code</label>
            <CardCvcElement
              className={styles.nameInput}
              options={options}
              onChange={handleCardDetailsChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
