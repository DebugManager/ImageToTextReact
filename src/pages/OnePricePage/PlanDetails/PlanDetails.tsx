import React from 'react';
import { CircleLoader } from 'react-spinners';
import styles from './PlanDetails.module.css';

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


export const PlanDetails = ({ plan, isLoading }: { plan?: Plan | null | undefined, isLoading: boolean }) => {
    return (
        <div className={styles.wrapper}>
            {plan?.id ? (<><p className={styles.planType}>{plan?.type}</p>
                <p className={styles.planName}>{plan?.name}</p>
                <div className={styles.priceWrapper}>
                    <div className={styles.price}>
                        <p className={styles.valute}>$</p>
                        <p className={styles.priceData}>{plan?.price}/</p>
                    </div>
                    <p className={styles.payFor}>Per month</p>
                </div>

                <div className={styles.optionWrapper}>
                    {plan?.option1 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option1}</p>
                        </div>)}

                    {plan?.option2 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option2}</p>
                        </div>)}

                    {plan?.option3 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option3}</p>
                        </div>)}

                    {plan?.option4 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option4}</p>
                        </div>)}

                    {plan?.option5 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option5}</p>
                        </div>)}

                    {plan?.option6 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option6}</p>
                        </div>)}

                    {plan?.option7 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option7}</p>
                        </div>)}

                    {plan?.option8 && (
                        <div className={styles.options}>
                            <img alt='checkbox' src={checkBox} />
                            <p className={styles.optionName}>{plan.option8}</p>
                        </div>)}
                </div></>)
                :
                (
                    <>
                        {isLoading &&
                            <div className={styles.messageWrapper}>
                                <CircleLoader color={'#556EE6'} size={50} />
                            </div>
                        }
                        {!isLoading &&
                            <div className={styles.messageWrapper}>
                                <p className={styles.message}>Please choose the plan</p>
                            </div>
                        }
                    </>
                )
            }
        </div>
    )
}
