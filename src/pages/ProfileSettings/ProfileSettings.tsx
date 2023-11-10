import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import UserForm from './UserForm/UserForm';
import { getUser, setUser } from '../../services/locastorage.service';
import { updateUsers } from '../../services/user.service';

import styles from './ProfileSettings.module.css';

import AE from '../../assets/planCard/AmericanExpress.svg';
import mc from '../../assets/planCard/mastercard.svg';
import safe from '../../assets/planCard/save.png';
import stripeIMG from '../../assets/planCard/stripe.svg';
import invoce from '../../assets/profileSettings/invoce.svg';
import visa from '../../assets/planCard/visa.svg';

const validationSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string().required('Plan is required'),
  description: Yup.string().required('Address is required'),
  support: Yup.number().required('City is required'),
  email: Yup.string().required('Post Code is required'),
  changePassword: Yup.string().required('Country is required'),
});

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

interface IPersonalInfo {
  firstName: string;
  lastName: string;
  description: string;
  support: string;
  email: string;
  changePassword: string;
  payment_method_id?: string;
}

const ProfileSettings: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [user, setCurrentUser] = useState<IUser | null>(null);
  const [personalInfo, setPersonalInfo] = useState<IPersonalInfo>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    description: '',
    support: '',
    email: user?.email || '',
    changePassword: '',
    payment_method_id: user?.payment_method_id || '',
  });
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const elements = useElements();
  const stripe = useStripe();

  const useOptions = () => {
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize: '7px',
            color: '#424770',
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

  useEffect(() => {
    const userData = getUser();
    if (userData?.id) {
      setCurrentUser(userData);
      setPersonalInfo({
        firstName: userData?.first_name || '',
        lastName: userData?.last_name || '',
        description: '',
        support: '',
        email: userData?.email || '',
        changePassword: '',
        payment_method_id: userData.payment_method_id || '',
      });
    }
  }, []);

  const handlePersonalInfo = (userData: IPersonalInfo) => {
    setPersonalInfo((prevPersonalInfo: IPersonalInfo) => ({
      ...prevPersonalInfo,
      firstName: userData.firstName
        ? userData.firstName
        : prevPersonalInfo.firstName,
      lastName: userData.lastName
        ? userData.lastName
        : prevPersonalInfo.lastName,
      description: userData.description
        ? userData.description
        : prevPersonalInfo.description,
      support: userData.support ? userData.support : prevPersonalInfo.support,
      email: userData.email ? userData.email : prevPersonalInfo.email,
      changePassword: userData.changePassword
        ? userData.changePassword
        : prevPersonalInfo.changePassword,
    }));
  };

  const handleFormSubmit = async (
    data: IPersonalInfo | null,
    paymentId?: string
  ) => {
    const userData = {
      first_name: data?.firstName || '',
      last_name: data?.lastName || '',
      description: data?.description || '',
      support: data?.support || '',
      email: data?.email || '',
      changePassword: data?.changePassword || '',
      customer_id: user?.customer_id,
      payment_method_id: paymentId ? paymentId : null,
    };
    try {
      const response = await updateUsers(userData);
      if (response.status === 200) {
        setUser(response.data);
        setButtonLoading(false);
      }
    } catch (error) {
      console.error(error);
      setButtonLoading(false);
    }
  };

  const handlePaymantSubmit = async (e?: any) => {
    e.preventDefault();

    if (elements && user && stripe) {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (cardNumberElement) {
        setButtonLoading(true);
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
          billing_details: {
            name: `${user.first_name} ${user.last_name}`,
          },
        });

        const paymentId = paymentMethod?.id;

        if (paymentId) {
          handleFormSubmit(personalInfo, paymentId);
        } else if (!paymentId) {
          handleFormSubmit(personalInfo);
        }

        // if (error) {
        //   console.error(error);
        // }
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <p className={styles.headerTitle}>Setting</p>
        <div className={styles.invoceTitleWrapper}>
          <img alt='invoce' src={invoce} />
          <Link to={`/invoices/${user?.id}`} className={styles.invoceText}>
            View Invoices
          </Link>
        </div>
      </div>

      <UserForm
        user={user}
        control={control}
        errors={errors}
        onUserDataChange={handlePersonalInfo}
      />

      <div className={styles.paymantWrapper}>
        <p className={styles.paymantTitle}>Payment Metode</p>
        <div className={styles.paymentIcons}>
          <img alt='payment' src={stripeIMG} className={styles.paymentImg} />
          <img alt='payment' src={mc} className={styles.paymentImg} />
          <img alt='payment' src={visa} className={styles.paymentImg} />
          <img alt='payment' src={AE} className={styles.paymentImg} />
          <img alt='payment' src={safe} className={styles.paymentImg} />
        </div>
        <form onSubmit={handlePaymantSubmit}>
          <div className={styles.cardWrapper}>
            <label className={styles.cardNumberLabel}>Card Number</label>
            <CardNumberElement className={styles.nameInput} options={options} />
          </div>

          <div className={styles.bottomInputsWrapper}>
            <div className={styles.inputLabelWrapper}>
              <label className={styles.cardNumberLabel}>Expiry Date</label>
              <CardExpiryElement
                className={styles.nameInput}
                options={options}
              />
            </div>

            <div className={styles.inputLabelWrapper}>
              <label className={styles.cardNumberLabel}>CVV Code</label>
              <CardCvcElement className={styles.nameInput} options={options} />
            </div>
          </div>
          <div className={styles.confirmButtonWrapper}>
            <button type='submit' className={styles.confirmButton}>
              {buttonLoading ? (
                <CircleLoader
                  loading={buttonLoading}
                  color={'#FFF'}
                  size={10}
                />
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
