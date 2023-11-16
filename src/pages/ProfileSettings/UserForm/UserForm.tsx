import { useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';
import { Controller } from 'react-hook-form';

import { useLanguage } from '../../../context/LanguageContext';

import styles from './UserForm.module.css';

import camera from '../../../assets/profileSettings/camera.svg';
import avatar from '../../../assets/profileSettings/8928185db51121eeb6d9c08610937b16.jpeg';


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
}

interface UserFormProps {
  user: IUser | null;
  control: any;
  errors: any;
  formOptions?: any;
  onUserDataChange: (data: IPersonalInfo) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  control,
  errors,
  onUserDataChange,
}) => {
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IPersonalInfo>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    description: '',
    support: '',
    email: user?.email || '',
    changePassword: '',
  });

  const handleFieldChange = (field: keyof IPersonalInfo, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    onUserDataChange(formData);
  }, [formData, onUserDataChange]);

  useEffect(()=> {
    if(!user?.id){
      setIsLoading(true);
    } else{
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div className={styles.wrapper}>
      {!user ? (
        <CircleLoader loading={isLoading} color={'#556EE6'} size={50} />
      ) : (
        <>
          <div className={styles.avatarWrapper}>
            <img alt='avatar' src={avatar} className={styles.userAvatar} />
            <div className={styles.cameraWrapper}>
              <img alt='camera' src={camera} className={styles.cameraImg} />
            </div>
          </div>

          <div className={styles.nameWrapper}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor='firstName'>
                {t('firstName')}
              </label>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <input
                    defaultValue={user?.first_name || ''}
                    className={styles.input}
                    type='text'
                    id='firstName'
                    placeholder='Enter Name'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('firstName', e.target.value);
                    }}
                  />
                )}
              />
              {errors.firstName && (
                <span className={styles.error}>{errors.firstName.message}</span>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor='lastName'>
                {t('lastName')}
              </label>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <input
                    defaultValue={user?.last_name || ''}
                    className={styles.input}
                    type='text'
                    id='lastName'
                    placeholder='Enter Name'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('lastName', e.target.value);
                    }}
                  />
                )}
              />
              {errors.lastName && (
                <span className={styles.error}>{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label} htmlFor='description'>
              {t('description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <input
                  className={styles.input}
                  type='description'
                  id='description'
                  placeholder='description'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('description', e.target.value);
                  }}
                />
              )}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </div>

          <div className={styles.nameWrapper}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor='support'>
                {t('support')}
              </label>
              <Controller
                name='support'
                control={control}
                render={({ field }) => (
                  <input
                    className={styles.input}
                    type='support'
                    id='support'
                    placeholder='+62876-7678-0000'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('support', e.target.value);
                    }}
                  />
                )}
              />
              {errors.support && (
                <span className={styles.error}>{errors.support.message}</span>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor='email'>
                {t('email')}
              </label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <input
                    defaultValue={user?.email || ''}
                    className={styles.input}
                    type='email'
                    id='email'
                    placeholder='Enter Email'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('email', e.target.value);
                    }}
                  />
                )}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <Controller
              name='changePassword'
              control={control}
              rules={{
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <label className={styles.label} htmlFor='changePassword'>
                    {t('changePassword')}
                  </label>
                  <div className={styles.passInptWrapper}>
                    <input
                      className={styles.input}
                      // type={showPassword ? 'text' : 'password'}
                      id='changePassword'
                      placeholder='Enter Password'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange('changePassword', e.target.value);
                      }}
                    />
                    {errors.createPassword && (
                      <span className={styles.error}>
                        {errors.createPassword.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserForm;
