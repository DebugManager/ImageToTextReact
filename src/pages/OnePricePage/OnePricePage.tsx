import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { buyPackage, getPricingById } from '../../services/pricing.service';
import { CircleLoader } from 'react-spinners';

import { ChosePlanForm } from './ChosePlanForm/ChosePlanForm';
import { PaymantForm } from './PaymantForm/PaymantForm';
import { PersonalInformationForm } from './PersonalInformationForm/PersonalInformationForm';
import { PlanDetails } from './PlanDetails/PlanDetails';

import styles from './OnePricePage.module.css';
import { getUser } from '../../services/locastorage.service';

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

const validationSchema = Yup.object().shape({
    type: Yup.string()
        .required('type is required'),
    planId: Yup.string()
        .required('Plan is required'),
    address: Yup.string()
        .required('Address is required'),
    city: Yup.string()
        .required('City is required'),
    postCode: Yup.string()
        .required('Post Code is required'),
    country: Yup.string()
        .required('Country is required'),

});

type PricingTypes = 'Mounthly' | 'Annual';

interface IChoosenPlan {
    type: string;
    planId: number;
}

interface IPersonalInfo {
    address: string;
    city: string;
    postCode: string;
    country: string;
    isError?: boolean;
}

interface ICardInfo {
    cardNumber: number | string;
    name: string;
    date: number | string;
    cvv: string;
    isError?: boolean;
}

const OnePricePage = () => {
    const { id } = useParams();

    const [plan, setPlan] = useState<Plan | null | undefined>(null);
    const [typeOfPrice, setTypeOfPrice] = useState<PricingTypes>('Mounthly');
    const [choosenPlan, setChoosenPlan] = useState<IChoosenPlan | null>(null);
    const [personalInfo, setPersonalIngo] = useState<IPersonalInfo | null>(null);
    const [cardInfo, setCardInfo] = useState<ICardInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userId, setUserID] = useState<string | number | null>(null);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)

    const fetchData = useCallback(async () => {
        if (id) {
            setIsLoading(true);
            try {
                const data = await getPricingById(id);
                setPlan(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
    }, [id]);

    const fetchPriceByIdData = useCallback(async (id: number | string) => {
        if (id) {
            setIsLoading(true);
            try {
                const data = await getPricingById(id);
                setPlan(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
    }, [getPricingById, setPlan]);

    useEffect(() => {
        if (choosenPlan?.planId) {
            fetchPriceByIdData(choosenPlan.planId);
        } else {
            setPlan(null);
        }
    }, [fetchPriceByIdData, choosenPlan?.planId]);

    useEffect(() => {
        const userID = getUser();
        userID && setUserID(userID?.id);
    }, []);

    useEffect(() => {
        if (plan?.type === 'Mounthly' || plan?.type === 'Annual') {
            setTypeOfPrice(plan.type);
        }
    }, [plan, typeOfPrice]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handlePlanChange = (newValue: IChoosenPlan) => {
        setChoosenPlan({ type: newValue.type, planId: newValue.planId });
    };

    const handlePersonalInfo = (userData: IPersonalInfo) => {
        setPersonalIngo(userData);
    }

    const handleCardInfo = (userData: ICardInfo) => {
        setCardInfo(userData);
    }

    const handleFormSubmit = async () => {
        setButtonLoading(true);
        if (choosenPlan?.planId) {
            if (personalInfo?.address.length &&
                personalInfo?.city.length &&
                personalInfo?.postCode.length &&
                personalInfo?.country.length &&
                cardInfo?.cardNumber?.toString().length &&
                cardInfo?.name?.toString().length &&
                cardInfo?.date?.toString().length &&
                cardInfo?.cvv?.toString().length) {
                const data = {
                    current_plan: choosenPlan.planId,
                    address_line1: personalInfo.address,
                    city: personalInfo.city,
                    zip_code: personalInfo.postCode,
                    country: personalInfo.country,
                    // cardNumber: cardInfo.cardNumber,
                    // name: cardInfo.name,
                    // date: cardInfo.date,
                    // cvv: cardInfo.cvv,
                };
                if (userId) {
                    const res = await buyPackage(data, userId);
                    if (res === 'ok') {
                        setButtonLoading(false);
                    } else {
                        setButtonLoading(false);
                    }
                }
            }
        }

        else {
            if (personalInfo?.address.length &&
                personalInfo?.city.length &&
                personalInfo?.postCode.length &&
                personalInfo?.country.length &&
                cardInfo?.cardNumber?.toString().length &&
                cardInfo?.name?.toString().length &&
                cardInfo?.date?.toString().length &&
                cardInfo?.cvv?.toString().length &&
                plan?.id) {
                const data = {
                    // typeOfPrice: typeOfPrice,
                    // plan: {
                    //     id: plan?.id
                    // },
                    // address: personalInfo.address,
                    // city: personalInfo.city,
                    // postCode: personalInfo.postCode,
                    // country: personalInfo.country,
                    // cardNumber: cardInfo.cardNumber,
                    // name: cardInfo.name,
                    // date: cardInfo.date,
                    // cvv: cardInfo.cvv,
                    current_plan: plan?.id,
                    address_line1: personalInfo.address,
                    city: personalInfo.city,
                    zip_code: personalInfo.postCode,
                    country: personalInfo.country,
                };
                if (userId) {
                    const res = await buyPackage(data, userId);
                    if (res === 'ok') {
                        setButtonLoading(false);
                    } else {
                        setButtonLoading(false);
                    }
                }
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.topTitle}>Choose your Pricing plan</p>
            <p className={styles.topDescription}>To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words If several languages coalesce</p>

            <div className={styles.infoWrapper}>
                <div className={styles.leftWrapper}>
                    <ChosePlanForm
                        onSubmit={handleSubmit(handleFormSubmit)}
                        control={control}
                        errors={errors}
                        plan={plan}
                        onPlanChange={handlePlanChange}
                        typeOfPrice={typeOfPrice}
                    />

                    <PersonalInformationForm
                        onSubmit={handleSubmit(handleFormSubmit)}
                        onUserDataChange={handlePersonalInfo}
                        control={control}
                        errors={errors}
                    />

                    <PaymantForm
                        onUserDataChage={handleCardInfo}
                        onSubmit={handleSubmit(handleFormSubmit)}
                        control={control}
                        errors={errors}
                    />

                    <div className={styles.confirmButtonWrapper}>
                        <button onClick={() => handleFormSubmit()} className={styles.confirmButton}>{buttonLoading ? <CircleLoader loading={buttonLoading} color={'#FFF'} size={10} /> : 'Confirm Order'}</button>
                    </div>
                </div>
                <div className={styles.rightWrapper}>
                    <PlanDetails plan={plan} isLoading={isLoading} />
                </div>
            </div>
        </div >
    )
}

export default OnePricePage;