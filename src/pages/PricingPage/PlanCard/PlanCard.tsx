import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { OnHoldModal } from './Modals/OnHoldModal';
import { FeedBackModal } from './Modals/FeedBackModal';
import { FinalModal } from './Modals/FinalModal';
import { useLanguage } from '../../../context/LanguageContext';

import styles from './PlanCard.module.css';

import line from '../../../assets/planCard/line.svg';
import checkBox from '../../../assets/planCard/presentedPlan.svg';

interface Options {
  name: string;
}

interface Price {
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: number | null;
  id: string;
  livemode: boolean;
  lookup_key: string | null;
  metadata: Record<string, any>;
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
  options: Options[];
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

interface PlanCardProps {
  plan: Price;
  currentPlanId?: string | null | undefined;
  userID: number | null;
  id: number | string;
  user: IUser | null;
  currency: number | null;
  currencyName: string | null;
}

const OnHoldId = 'price_1O9rhLDV4Z1ssWPD7vVu814B';

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  currentPlanId,
  userID,
  currency,
  currencyName,
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const [openFeedBackModal, setOpenFeedBackModal] = useState<boolean>(false);
  const [openFinalModal, setOpenFinalModal] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    setOpenFeedBackModal(true);
  };

  const handleCloseFeedBack = () => {
    setOpenFeedBackModal(false);
    window.location.href = '/pricing';
  };

  const handleSubmitFeedBack = () => {
    setOpenFeedBackModal(false);
    setOpenFinalModal(true);
  };

  const handleCloseAll = () => {
    setOpenFinalModal(false);
    window.location.href = '/pricing';
  };

  const convertToSelectedCurrency = (amount: string | number) => {
    if (currency) {
      return (+amount * +currency).toFixed(2);
    }
    return amount;
  };

  return (
    <div>
      <div
        className={styles.planWrapper}
        style={
          currentPlanId && currentPlanId === plan.id
            ? { padding: '0' }
            : { padding: '10px 12px' }
        }
      >
        {currentPlanId && currentPlanId === plan.id && (
          <div
            className={
              currentPlanId === OnHoldId
                ? `${styles.curPlan} ${styles.backgroundOnHold}`
                : styles.curPlan
            }
          >
            {t('Current_Plan')}
          </div>
        )}
        <div
          style={
            currentPlanId && currentPlanId === plan.id
              ? { padding: '10px 12px' }
              : { padding: '0' }
          }
        >
          <p className={styles.planType}>{plan.product_name}</p>
          <p className={styles.planName}>{plan.product_name}</p>
          <div className={styles.priceWrapper}>
            <div className={styles.price}>
              <p className={styles.valute}>
                {!currencyName || currencyName === 'USD' ? '$' : ''}
              </p>
              <p className={styles.priceData}>
                {convertToSelectedCurrency(plan.unit_amount / 100)}/
              </p>
            </div>
            <p className={styles.payFor}>{t('Per_month')}</p>
          </div>

          <div className={styles.line}>
            <img alt='line' src={line} className={styles.lineImg} />
            <Link to={`/pricing/${plan.id}`} className={styles.btnSelect}>
              {t('Select_Plan')}
            </Link>
          </div>

          <div className={styles.optionWrapper}>
            {plan.options.map(({ name }: Options) => (
              <div className={styles.options}>
                <img alt='checkbox' src={checkBox} />
                <p className={styles.optionName}>{name}</p>
              </div>
            ))}
          </div>

          {currentPlanId === plan.id && (
            <button className={styles.cancelBtn} onClick={handleOpen}>
              {t('cancel')}
            </button>
          )}
        </div>
      </div>

      <OnHoldModal
        open={open}
        handleClose={handleClose}
        userID={userID}
        // isCancelLoading={isLoading}
      />

      <FeedBackModal
        openFeedBackModal={openFeedBackModal}
        handleCloseFeedBack={handleCloseFeedBack}
        handleSubmitFeedBack={handleSubmitFeedBack}
      />

      <FinalModal
        openFinalModal={openFinalModal}
        handleCloseAll={handleCloseAll}
      />
    </div>
  );
};

export default PlanCard;
