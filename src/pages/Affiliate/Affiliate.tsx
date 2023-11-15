import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircleLoader } from 'react-spinners';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { createAffiliate } from '../../services/affiliates.service';
import { getUser } from '../../services/locastorage.service';

import styles from './Affiliate.module.css';

import icon from '../../assets/auth/eye-off.svg';


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

// export default CustomErrorIcon;

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().required('Email is required'),
  password: Yup.number().required('Password is required'),
  promotion_plan: Yup.string().required('Description is required'),
  twitter: Yup.string().required('Twitter is required'),
  instagram: Yup.string().required('Instagram is required'),
  tiktok: Yup.string().required('TikTok is required'),
  linkedin: Yup.string().required('LinkedIn is required'),
  facebook: Yup.string().required('Facebook is required'),
  paypal_email: Yup.string().required('Paypal payment email is required'),
  btc_adress: Yup.string().required('BTC payment address is required'),
});

interface IAffiliate {
  first_name: string;
  last_name: string;
  email: string;
  password: number;
  promotion_plan: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  facebook: string;
  paypal_email: string;
  btc_adress: string;
}

const Affiliate: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAffiliate>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const user = getUser();
    if (user?.id) {
      setUserId(user?.id);
    }
  }, []);

  const onSubmit: SubmitHandler<IAffiliate> = async (data) => {
    setButtonLoading(true);
    if (userId) {
      try {
        const response = await createAffiliate(data, userId);
        if (response) {
            toast.success('Your application was succesfully sended', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
          setButtonLoading(false);
          reset();
        }
      } catch (error) {
        console.error(error);
        setButtonLoading(false);
        reset();
        toast.error('Somethink goes wrong', {
            position: 'top-right',
            autoClose: 3000,
            className: 'my-custom-toast-error',
            style: myCustomStyles,
            progressClassName: 'my-custom-progress-bar',
            progressStyle: progressBarStyles,
            icon: <CustomErrorIcon />,
        });
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>
        Apply to become an affiliate and earn from every sale
      </p>
      <p className={styles.description}>
        Please fill out the form to apply to become an affiliate. If you are
        successful we will email your unique tracking URL within the next 5
        working days.
      </p>
      <form className={styles.fromWrapper} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.nameWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='first_name'>
              First Name
            </label>
            <Controller
              name='first_name'
              control={control}
              rules={{
                required: 'First Name is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='first_name'
                  placeholder='Enter Name'
                  {...field}
                />
              )}
            />
            {errors.first_name && (
              <span className={styles.error}>{errors.first_name.message}</span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='last_name'>
              Last Name
            </label>
            <Controller
              name='last_name'
              control={control}
              rules={{
                required: 'Last Name is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='last_name'
                  placeholder='Enter Name'
                  {...field}
                />
              )}
            />
            {errors.last_name && (
              <span className={styles.error}>{errors.last_name.message}</span>
            )}
          </div>
        </div>

        <div className={styles.nameWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='email'>
              Email
            </label>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='email'
                  placeholder='Enter Email'
                  {...field}
                />
              )}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='password'>
              Password
            </label>
            <Controller
              name='password'
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({ field }) => (
                <div className={styles.passInptWrapper}>
                  <input
                    className={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='Enter Password'
                    {...field}
                  />
                  {errors.password && (
                    <span className={styles.error}>
                      {errors.password.message}
                    </span>
                  )}
                  <div className={styles.iconWrapper}>
                    <img
                      alt='icon'
                      src={icon}
                      className={styles.eyeIcon}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>
              )}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label} htmlFor='promotion_plan'>
            How will you promote our company?
          </label>
          <Controller
            name='promotion_plan'
            control={control}
            rules={{
              required: 'Description is required',
            }}
            render={({ field }) => (
              <input
                className={styles.input}
                type='text'
                id='promotion_plan'
                placeholder='Enter description'
                {...field}
              />
            )}
          />
          {errors.promotion_plan && (
            <span className={styles.error}>
              {errors.promotion_plan.message}
            </span>
          )}
        </div>

        <div className={styles.nameWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='twitter'>
              Your Twitter
            </label>
            <Controller
              name='twitter'
              control={control}
              rules={{
                required: 'twitter is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='twitter'
                  placeholder='Enter twitter'
                  {...field}
                />
              )}
            />
            {errors.twitter && (
              <span className={styles.error}>{errors.twitter.message}</span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='instagram'>
              Your Instagram
            </label>
            <Controller
              name='instagram'
              control={control}
              rules={{
                required: 'instagram is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='instagram'
                  placeholder='Enter instagram'
                  {...field}
                />
              )}
            />
            {errors.instagram && (
              <span className={styles.error}>{errors.instagram.message}</span>
            )}
          </div>
        </div>

        <div className={styles.nameWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='tiktok'>
              Your tikTok
            </label>
            <Controller
              name='tiktok'
              control={control}
              rules={{
                required: 'tiktok is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='tiktok'
                  placeholder='Enter tiktok'
                  {...field}
                />
              )}
            />
            {errors.tiktok && (
              <span className={styles.error}>{errors.tiktok.message}</span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='linkedin'>
              Your LinkedIn
            </label>
            <Controller
              name='linkedin'
              control={control}
              rules={{
                required: 'linkedin is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='linkedin'
                  placeholder='Enter linkedin'
                  {...field}
                />
              )}
            />
            {errors.linkedin && (
              <span className={styles.error}>{errors.linkedin.message}</span>
            )}
          </div>
        </div>

        <div className={styles.smallWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='facebook'>
              Your Facebook
            </label>
            <Controller
              name='facebook'
              control={control}
              rules={{
                required: 'facebook is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='facebook'
                  placeholder='Enter facebook'
                  {...field}
                />
              )}
            />
            {errors.facebook && (
              <span className={styles.error}>{errors.facebook.message}</span>
            )}
          </div>
        </div>

        <div className={styles.nameWrapper}>
          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='paypal_payment_email'>
              PayPal Payment email
            </label>
            <Controller
              name='paypal_email'
              control={control}
              rules={{
                required: 'PayPal Payment email is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='paypal_payment_email'
                  placeholder='Enter PayPal Payment email'
                  {...field}
                />
              )}
            />
            {errors.paypal_email && (
              <span className={styles.error}>
                {errors.paypal_email.message}
              </span>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='btc_payment_address'>
              BTC Payment address
            </label>
            <Controller
              name='btc_adress'
              control={control}
              rules={{
                required: 'lBTC Payment address is required',
              }}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='text'
                  id='btc_payment_address'
                  placeholder='Enter BTC Payment address'
                  {...field}
                />
              )}
            />
            {errors.btc_adress && (
              <span className={styles.error}>{errors.btc_adress.message}</span>
            )}
          </div>
        </div>

        <button type='submit' className={styles.submitBtn}>
          {buttonLoading ? (
            <CircleLoader loading={buttonLoading} color={'#FFF'} size={10} />
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default Affiliate;
