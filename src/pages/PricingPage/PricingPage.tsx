import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CircleLoader } from 'react-spinners';
import PlanCard from './PlanCard/PlanCard';
import { getPackages } from '../../services/pricing.service';
import { getUser, setUser } from '../../services/locastorage.service';

import styles from './PricingPage.module.css';

import arrow from '../../assets/header/arrow.svg';
import { getUserById } from '../../services/user.service';

interface Options {
  name: string;
}

interface Price {
  active: boolean;
  product_name: string;
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

type PricingTypes = 'year' | 'month';

const OnHoldId = 'price_1O9rhLDV4Z1ssWPD7vVu814B';

const PricingPage = () => {
  const [typeOfPrice, setTypeOfPrice] = useState<PricingTypes>('month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [plans, setPlans] = useState<Price[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [user, setStateUser] = useState<IUser | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getPackages(typeOfPrice);
      setPlans(data.prices);
    } catch (error) {
      console.error(error);
    }
  }, [typeOfPrice]);

  const fetchUpdatedUserData = useCallback(
    async (userID: number) => {
      try {
        const data = await getUserById(userID);
        setUser(data);
        setStateUser((u) => ({ ...u, ...data }));
        setCurrentPlan(data.current_plan);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (userID) {
      fetchUpdatedUserData(userID);
    }
  }, [userID, fetchUpdatedUserData]);

  useEffect(() => {
    const user = getUser();
    if (user?.current_plan && user?.id) {
      setUserID(user?.id);
      setCurrentPlan(user.current_plan);
    }
  }, []);

  const filteredPlans = useMemo(() => {
    return plans?.filter((plan) => plan.recurring.interval === typeOfPrice);
  }, [plans, typeOfPrice]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  filteredPlans?.sort((a, b) => a.unit_amount - b.unit_amount);

  return (
    <div className={styles.wrapper}>
      <p className={styles.pricingTitle}>PRICING</p>
      <p className={styles.centerTitle}>Choose your Pricing plan</p>
      <p className={styles.description}>
        To achieve this, it would be necessary to have uniform grammar,
        pronunciation and more common words If several languages coalesce
      </p>
      <div className={styles.filterWrapper}>
        <p className={styles.option}>View packages</p>
        <div className={styles.filter} onClick={toggleDropdown}>
          <p>{typeOfPrice}</p>
          <img alt='arrow' src={arrow} className={styles.arrow} />
        </div>
        {isDropdownOpen && (
          <div className={styles.optionWrapper}>
            <div
              onClick={() => setTypeOfPrice('month')}
              className={styles.optionFilter}
            >
              Mounthly
            </div>
            <div
              onClick={() => setTypeOfPrice('year')}
              className={styles.optionFilter}
            >
              Annual
            </div>
          </div>
        )}
      </div>
      <div className={styles.planWrapper}>
        {!filteredPlans?.length ? (
          <div className={styles.loaderWrapper}>
            <CircleLoader color={'#556EE6'} size={50} />
          </div>
        ) : (
          filteredPlans
            ?.filter((plan) => currentPlan === OnHoldId || plan.id !== OnHoldId)
            .map((plan) => (
              <div className={styles.cardWrapper}>
                <PlanCard
                  key={plan.id}
                  id={plan.id}
                  plan={plan}
                  currentPlanId={currentPlan}
                  userID={userID}
                  user={user}
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PricingPage;
