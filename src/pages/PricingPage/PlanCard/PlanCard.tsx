import React from 'react';
import { Link } from 'react-router-dom';

import styles from './PlanCard.module.css';

import line from '../../../assets/planCard/line.svg';
import checkBox from '../../../assets/planCard/presentedPlan.svg';

type Plan = {
    id: number;
    type: string;
    name: string;
    price: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    option6: string;
    option7: string;
    option8: string;
};

interface PlanCardProps {
    plan: Plan;
    currentPlanId?: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentPlanId }) => {
    return (
        <div>
            <div className={styles.planWrapper} style={currentPlanId && currentPlanId === plan.id ? { padding: '0' } : { padding: '10px 12px' }}>
                {currentPlanId && currentPlanId === plan.id && <div className={styles.curPlan}>Current Plan</div>}
                <div style={currentPlanId && currentPlanId === plan.id ? { padding: '10px 12px' } : { padding: '0' }}>
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
                        {plan.option1 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option1}</p>
                            </div>)}

                        {plan.option2 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option2}</p>
                            </div>)}

                        {plan.option3 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option3}</p>
                            </div>)}

                        {plan.option4 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option4}</p>
                            </div>)}

                        {plan.option5 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option5}</p>
                            </div>)}

                        {plan.option6 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option6}</p>
                            </div>)}

                        {plan.option7 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option7}</p>
                            </div>)}

                        {plan.option8 && (
                            <div className={styles.options}>
                                <img alt='checkbox' src={checkBox} />
                                <p className={styles.optionName}>{plan.option8}</p>
                            </div>)}
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
