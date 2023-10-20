import React from 'react';
import { Link } from 'react-router-dom';

import styles from './PlanCard.module.css';

import line from '../../../assets/planCard/line.svg';
import checkBox from '../../../assets/planCard/presentedPlan.svg';

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

interface PlanCardProps {
    plan: Plan;
    currentPlanId: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentPlanId }) => {
    return (
        <div>
            <div className={styles.planWrapper} style={currentPlanId === plan.id ? { padding: '0' } : { padding: '10px 12px' }}>
                {currentPlanId === plan.id && <div className={styles.curPlan}>Current Plan</div>}
                <div style={currentPlanId === plan.id ? { padding: '10px 12px' } : { padding: '0' }}>
                    <p className={styles.planType}>{plan.type}</p>
                    <p className={styles.planName}>{plan.name}</p>
                    <div className={styles.priceWrapper}>
                        <div className={styles.price}>
                            <p className={styles.valute}>$</p>
                            <p className={styles.priceData}>{plan.price}/</p>
                        </div>
                        <p className={styles.payFor}>Per month</p>
                    </div>

                    <div className={styles.line}>
                        <img alt='line' src={line} className={styles.lineImg} />
                        <Link to={`/pricing/${plan.id}`} className={styles.btnSelect}>Select Plan</Link>
                    </div>

                    <div className={styles.optionWrapper}>
                        {
                            plan.option.map((option) =>
                            (
                                <div className={styles.options}>
                                    <img alt='checkbox' src={checkBox} />
                                    <p className={styles.optionName}>{option.name}</p>
                                </div>
                            ))
                        }
                    </div>

                    {
                        currentPlanId === plan.id && <button className={styles.cancelBtn}>Cancel</button>
                    }
                </div>
            </div>
        </div>
    );
}


export default PlanCard;
