import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CircleLoader } from 'react-spinners';
import PlanCard from './PlanCard/PlanCard';
import { getPricing } from '../../services/pricing.service';
import { getUser } from '../../services/locastorage.service';

import styles from './PricingPage.module.css';

import arrow from '../../assets/header/arrow.svg';


type Plan = {
    id: number;
    name: string;
    price: number;
    type: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    option6: string;
    option7: string;
    option8: string;
};

type PricingTypes = 'Mounthly' | 'Annual';

const PricingPage = () => {
    const [typeOfPrice, setTypeOfPrice] = useState<PricingTypes>('Mounthly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentPlanId, setCurrentPlanId] = useState();
    const [userID, setUserID] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await getPricing(typeOfPrice);
            setPlans(data);

        } catch (error) {
            console.error(error);
        }
    }, [typeOfPrice]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const user = getUser();
        if (user?.current_plan && user?.id) {
            setUserID(user?.id);
            setCurrentPlanId(user.current_plan);
        }
    }, []);

    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => plan.type === typeOfPrice);
    }, [plans, typeOfPrice]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen((prev) => !prev);
    }, []);

    filteredPlans.sort((a, b) => a.price - b.price);

    return (
        <div className={styles.wrapper}>
            <p className={styles.pricingTitle}>PRICING</p>
            <p className={styles.centerTitle}>Choose your Pricing plan</p>
            <p className={styles.description}>
                To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words If several languages coalesce
            </p>
            <div className={styles.filterWrapper}>
                <p className={styles.option}>View packages</p>
                <div className={styles.filter} onClick={toggleDropdown}>
                    <p>{typeOfPrice}</p>
                    <img alt='arrow' src={arrow} className={styles.arrow} />
                </div>
                {isDropdownOpen && (
                    <div className={styles.optionWrapper}>
                        <div onClick={() => setTypeOfPrice('Mounthly')} className={styles.optionFilter}>
                            Mounthly
                        </div>
                        <div onClick={() => setTypeOfPrice('Annual')} className={styles.optionFilter}>
                            Annual
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.planWrapper}>
                {filteredPlans?.filter((plan) => currentPlanId === 11 || plan.id !== 11).map((plan) => (
                    <PlanCard key={plan.id} plan={plan} currentPlanId={currentPlanId} userID={userID} />
                ))}

                {!filteredPlans?.length &&
                    <div className={styles.loaderWrapper}>
                        <CircleLoader color={'#556EE6'} size={50} />
                    </div>
                }

            </div>
        </div>
    );
};

export default PricingPage;
