import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './PlanCard.module.css';

import line from '../../../assets/planCard/line.svg';
import checkBox from '../../../assets/planCard/presentedPlan.svg';
import { OnHoldModal } from './Modals/OnHoldModal';
import { FeedBackModal } from './Modals/FeedBackModal';
import { FinalModal } from './Modals/FinalModal';
import { buyPackage } from '../../../services/pricing.service';

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
    userID: number | null;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentPlanId, userID }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openFeedBackModal, setOpenFeedBackModal] = useState<boolean>(false);
    const [openFinalModal, setOpenFinalModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        if (userID) {
            setIsLoading(true);
            const data = {
                current_plan: null
            }
            const res = await buyPackage(data, userID);
            if (res === 'ok') {
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        setOpen(false);
        setOpenFeedBackModal(true);
    };

    const handleCloseFeedBack = () => {
        setOpenFeedBackModal(false);
        window.location.href = '/pricing';
    }

    const handleSubmitFeedBack = () => {
        setOpenFeedBackModal(false);
        setOpenFinalModal(true);
    }

    const handleCloseAll = () => {
        setOpenFinalModal(false);
        window.location.href = '/pricing';
    }

    return (
        <div>
            <div className={styles.planWrapper} style={currentPlanId && currentPlanId === plan.id ? { padding: '0' } : { padding: '10px 12px' }}>
                {currentPlanId && currentPlanId === plan.id && (
                    <div className={currentPlanId === 11 ? `${styles.curPlan} ${styles.backgroundOnHold}` : styles.curPlan}>
                        Current Plan
                    </div>
                )}
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
                        currentPlanId === plan.id && <button className={styles.cancelBtn} onClick={handleOpen}>Cancel</button>
                    }
                </div>
            </div>

            <OnHoldModal
                open={open}
                handleClose={handleClose}
                userID={userID}
                isCancelLoading={isLoading}
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

        </div >
    );
}


export default PlanCard;
