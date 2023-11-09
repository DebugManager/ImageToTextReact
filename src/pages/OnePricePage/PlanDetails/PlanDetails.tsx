import React from 'react';
import { CircleLoader } from 'react-spinners';
import styles from './PlanDetails.module.css';

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
  product: any;
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

export const PlanDetails = ({
  plan,
  isLoading,
}: {
  plan?: Price | null | undefined;
  isLoading: boolean;
}) => {
  return (
    <div className={styles.wrapper}>
      {plan?.product?.id ? (
        <>
          <p className={styles.planType}>{plan?.product.name}</p>
          {/* <p className={styles.planName}>{plan?.product_name}</p> */}
          <div className={styles.priceWrapper}>
            <div className={styles.price}>
              <p className={styles.valute}>$</p>
              <p className={styles.priceData}>
                {plan?.price.unit_amount / 100}/
              </p>
            </div>
            <p className={styles.payFor}>Per month</p>
          </div>

          <div className={styles.optionWrapper}>
            {plan.product.features.map(({ name }: Options) => (
              <div className={styles.options}>
                <img alt='checkbox' src={checkBox} />
                <p className={styles.optionName}>{name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {isLoading && (
            <div className={styles.messageWrapper}>
              <CircleLoader color={'#556EE6'} size={50} />
            </div>
          )}
          {!isLoading && (
            <div className={styles.messageWrapper}>
              <p className={styles.message}>Please choose the plan</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
