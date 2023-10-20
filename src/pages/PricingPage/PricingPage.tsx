import React from 'react';

import styles from './PricingPage.module.css';

import arrow from '../../assets/header/arrow.svg';
import PlanCard from './PlanCard/PlanCard';

type PlanOption = {
    id: number;
    name: string;
    isPresented: boolean;
};

type Plan = {
    id: number;
    type: string;
    name: string;
    price: string;
    option: PlanOption[];
};

const PlansArray: Plan[] = [
    {
        id: 1,
        type: 'Free',
        name: 'Neque quis est',
        price: '0',
        option: [
            {
                id: 1,
                name: 'Free Live Support',
                isPresented: true,
            },
            {
                id: 1,
                name: 'Unlimited User',
                isPresented: true,
            },
            {
                id: 1,
                name: 'No Time Tracking',
                isPresented: true,
            },
            {
                id: 1,
                name: ' Free Setup',
                isPresented: true,
            },
        ]

    },
    {
        id: 2,
        type: 'Starter',
        name: 'Neque quis est',
        price: '19',
        option: [
            {
                id: 1,
                name: 'Free Live Support',
                isPresented: true,
            },
            {
                id: 1,
                name: 'Unlimited User',
                isPresented: true,
            },
            {
                id: 1,
                name: 'No Time Tracking',
                isPresented: true,
            },
            {
                id: 1,
                name: ' Free Setup',
                isPresented: true,
            },
        ]

    },
    {
        id: 3,
        type: 'Professional',
        name: 'Neque quis est',
        price: '29',
        option: [
            {
                id: 1,
                name: 'Free Live Support',
                isPresented: true,
            },
            {
                id: 1,
                name: 'Unlimited User',
                isPresented: true,
            },
            {
                id: 1,
                name: 'No Time Tracking',
                isPresented: true,
            },
            {
                id: 1,
                name: ' Free Setup',
                isPresented: true,
            },
        ]

    },
    {
        id: 4,
        type: 'Unlimited',
        name: 'Neque quis est',
        price: '39',
        option: [
            {
                id: 1,
                name: 'Free Live Support',
                isPresented: true,
            },
            {
                id: 1,
                name: 'Unlimited User',
                isPresented: true,
            },
            {
                id: 1,
                name: 'No Time Tracking',
                isPresented: true,
            },
            {
                id: 1,
                name: ' Free Setup',
                isPresented: true,
            },
        ]

    },
]

const currentPlanId = 3;

const PricingPage = () => {


    return (
        <div className={styles.wrapper}>
            <p className={styles.pricingTitle}>PRICING</p>
            <p className={styles.centerTitle}>Choose your Pricing plan</p>
            <p className={styles.description}>To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words If several languages coalesce</p>
            <div className={styles.filterWrapper}>
                <p className={styles.option}>View packages</p>
                <div className={styles.filter}>
                    <p>Mouthtly</p>
                    <img alt='arrow' src={arrow} className={styles.arrow} />
                </div>
            </div>

            <div className={styles.planWrapper}>
                {
                    PlansArray.map((plan) => {
                        return (
                            // <Link to={`/pricing/${plan.id}`} className={styles.link}>
                            <PlanCard key={plan.id} plan={plan} currentPlanId={currentPlanId} />
                            // </Link>

                        )
                    })
                }
            </div>

        </div>
    )
}

export default PricingPage
