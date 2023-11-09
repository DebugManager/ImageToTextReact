import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  buyPackage,
  getPricingById,
  getStripeInstance,
} from '../../services/pricing.service';
import { CircleLoader } from 'react-spinners';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { getUser } from '../../services/locastorage.service';
import { ChosePlanForm } from './ChosePlanForm/ChosePlanForm';
import { PersonalInformationForm } from './PersonalInformationForm/PersonalInformationForm';
import { PlanDetails } from './PlanDetails/PlanDetails';
import { getUserById } from '../../services/user.service';

import AE from '../../assets/planCard/AmericanExpress.svg';
import mc from '../../assets/planCard/mastercard.svg';
import safe from '../../assets/planCard/save.png';
import stripeIMG from '../../assets/planCard/stripe.svg';
import visa from '../../assets/planCard/visa.svg';

import styles from './OnePricePage.module.css';

interface Price {
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: number | null;
  id: string;
  livemode: boolean;
  lookup_key: string | null;
  metadata: Record<string, any>; // Об'єкт з будь-якими додатковими властивостями
  nickname: string | null;
  object: string;
  product: string;
  recurring: {
    aggregate_usage: string | null;
    interval: string;
    interval_count: number;
    trial_period_days: number | null;
  };
  aggregate_usage: string | null;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  usage_type: string;
  tax_behavior: string;
  tiers_mode: string | null;
  transform_quantity: string | null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
  product_name: string;
  price: any;
}

const validationSchema = Yup.object().shape({
  type: Yup.string().required('type is required'),
  planId: Yup.string().required('Plan is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postCode: Yup.string().required('Post Code is required'),
  country: Yup.string().required('Country is required'),
});

type PricingTypes = 'month' | 'year';

interface IChoosenPlan {
  type: string;
  planId: string;
}

interface IPersonalInfo {
  address: string;
  city: string;
  postCode: string;
  country: string;
  isError?: boolean;
}

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

const OnePricePage = () => {
  const { id } = useParams();

  const [plan, setPlan] = useState<Price | null | undefined>(null);
  const [typeOfPrice, setTypeOfPrice] = useState<PricingTypes>('month');
  const [choosenPlan, setChoosenPlan] = useState<IChoosenPlan | null>(null);
  const [personalInfo, setPersonalIngo] = useState<IPersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserID] = useState<string | number | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const elements = useElements();
  const stripe = useStripe();

  const fetchData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      try {
        const data = await getPricingById(id);
        setPlan(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  }, [id]);

  const fetchPriceByIdData = useCallback(
    async (id: number | string) => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await getPricingById(id);
          setPlan(data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [setPlan]
  );

  const fetchUpdatedUserData = useCallback(async (userID: number | string) => {
    try {
      const data = await getUserById(userID);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUpdatedUserData(userId);
    }
  }, [userId, fetchUpdatedUserData]);

  useEffect(() => {
    if (choosenPlan?.planId) {
      fetchPriceByIdData(choosenPlan.planId);
    } else {
      setPlan(null);
    }
  }, [fetchPriceByIdData, choosenPlan?.planId]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserID(user?.id);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (plan?.type === 'month' || plan?.type === 'year') {
      setTypeOfPrice(plan.type);
    }
  }, [plan, typeOfPrice]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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

  const handlePlanChange = (newValue: IChoosenPlan) => {
    setChoosenPlan({ type: newValue.type, planId: newValue.planId });
  };

  const handlePersonalInfo = (userData: IPersonalInfo) => {
    setPersonalIngo(userData);
  };

  const handleFormSubmit = async () => {
    if (choosenPlan?.planId) {
      if (
        personalInfo?.address.length &&
        personalInfo?.city.length &&
        personalInfo?.postCode.length &&
        personalInfo?.country.length
      ) {
        const data = {
          current_plan: choosenPlan.planId,
          address_line1: personalInfo.address,
          city: personalInfo.city,
          zip_code: personalInfo.postCode,
          country: personalInfo.country,
        };

        console.log(data);

        if (userId) {
          console.log(data, userId);
          const res = await buyPackage(data, userId);
          if (res === 'ok') {
            setButtonLoading(false);
            window.location.href = '/pricing';
          } else {
            setButtonLoading(false);
          }
        }
      }
    } else {
      if (
        personalInfo?.address.length &&
        personalInfo?.city.length &&
        personalInfo?.postCode.length &&
        personalInfo?.country.length &&
        plan?.id
      ) {
        const data = {
          current_plan: plan?.id,
          address_line1: personalInfo.address,
          city: personalInfo.city,
          zip_code: personalInfo.postCode,
          country: personalInfo.country,
        };

        console.log(data);
        if (userId) {
          const res = await buyPackage(data, userId);
          if (res === 'ok') {
            setButtonLoading(false);
            window.location.href = '/pricing';
          } else {
            setButtonLoading(false);
          }
        }
      }
    }
  };

  const handlePaymantSubmit = async (e?: any) => {
    e.preventDefault();

    if (elements && user) {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement || !stripe) {
        console.error('Не вдалося отримати один з елементів картки');
        return;
      }

      setButtonLoading(true);

      const { error, token } = await stripe.createToken(cardNumberElement);

      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: `${user.first_name} ${user.last_name}`,
        },
      });

      const paymentId = paymentMethod?.id;

      console.log(token);

      if (token?.id && choosenPlan && paymentId) {
        const instance = await getStripeInstance(
          token.id,
          choosenPlan.planId,
          user.customer_id,
          user.payment_method_id ? user.payment_method_id : paymentId,
          user.subscription_id
        );
        const client_secret = instance.intent.client_secret;
        client_secret && handleFormSubmit();
      }

      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.topTitle}>Choose your Pricing plan</p>
      <p className={styles.topDescription}>
        To achieve this, it would be necessary to have uniform grammar,
        pronunciation and more common words If several languages coalesce
      </p>

      <div className={styles.infoWrapper}>
        <div className={styles.leftWrapper}>
          <ChosePlanForm
            onSubmit={handleSubmit(handleFormSubmit)}
            control={control}
            errors={errors}
            plan={plan}
            onPlanChange={handlePlanChange}
            typeOfPrice={typeOfPrice}
          />

          <PersonalInformationForm
            onSubmit={handleSubmit(handleFormSubmit)}
            onUserDataChange={handlePersonalInfo}
            control={control}
            errors={errors}
          />

          <div className={styles.paymantWrapper}>
            <p className={styles.paymantTitle}>Payment Metode</p>
            <div className={styles.paymentIcons}>
              <img
                alt='payment'
                src={stripeIMG}
                className={styles.paymentImg}
              />
              <img alt='payment' src={mc} className={styles.paymentImg} />
              <img alt='payment' src={visa} className={styles.paymentImg} />
              <img alt='payment' src={AE} className={styles.paymentImg} />
              <img alt='payment' src={safe} className={styles.paymentImg} />
            </div>
            <form onSubmit={handlePaymantSubmit}>
              <div className={styles.cardWrapper}>
                <label className={styles.cardNumberLabel}>Card Number</label>
                <CardNumberElement
                  className={styles.nameInput}
                  options={options}
                />
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
                  <CardCvcElement
                    className={styles.nameInput}
                    options={options}
                  />
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
                    'Confirm Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.rightWrapper}>
          <PlanDetails plan={plan} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default OnePricePage;
