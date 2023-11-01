import React, { useEffect, useState } from 'react';
import Select, { ActionMeta, StylesConfig } from 'react-select';
import { Controller } from 'react-hook-form';
import { getPricing } from '../../../services/pricing.service';

import styles from './ChosePlanForm.module.css';

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

interface IChoosePlan {
    onSubmit?: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
    plan?: Plan | undefined | null;
    onPlanChange: (data: any) => void;
    typeOfPrice: string;
}

const customStyles: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        height: '24px',
        display: 'flex',
        padding: '5px 10px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '4px',
        border: '1px solid var(--text-color-20, #EFF2F7)',
        background: 'var(--text-color-10, #FFF)',
        minHeight: 'none',
        fontSize: '7px',
        boxShadow: 'none',
        "&:hover": {
            borderColor: "none"
        }
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        padding: '0 6px'
    }),

    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '8px',
        width: '8px'
    }),

    dropdownIndicator: styles => ({
        ...styles,
        height: '8px',
        width: '8px',
        padding: '0px',
        marginBottom: '5px',
    }),

    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? "#EFF2F7" : "",
        color: '#495057',
        fontSize: '7px',
        "&:hover": {
            ...styles,
            backgroundColor: "#EFF2F7",
            fontSize: '7px',
            color: '#495057'
        }
    })
};

export const ChosePlanForm = ({ control, plan, onPlanChange, typeOfPrice }: IChoosePlan) => {
    const [selectedRadio, setSelectedRadio] = useState<string | null>(typeOfPrice);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null | undefined>(plan);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [planFromPropsSet, setPlanFromPropsSet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedRadio) {
            const fetchData = async () => {

                setIsLoading(true);
                try {
                    const data = await getPricing(typeOfPrice);
                    setPlans(data);
                    data && setIsLoading(false);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
        else {
            const fetchData = async () => {

                setIsLoading(true);
                try {
                    const data = await getPricing(selectedRadio);
                    setPlans(data);
                    data && setIsLoading(false);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }

    }, [typeOfPrice, selectedRadio]);

    useEffect(() => {
        if (plan && !planFromPropsSet) {
            setSelectedPlan(plan);
            setPlanFromPropsSet(true);
        }
    }, [plan, planFromPropsSet]);

    const handleRadioChange = (newValue: string) => {
        setSelectedRadio(newValue);
        onPlanChange({ type: newValue, planId: null });

        if (newValue === "Mounthly" || newValue === "Annual") {
            const newSelectedPlan = plans.find((plan) => plan.type === newValue);
            if (newSelectedPlan) {
                setSelectedPlan(newSelectedPlan);
                onPlanChange({ type: newValue, planId: newSelectedPlan.id });
            }
        }
    };

    const handleChangePackage = (selectedOption: { value: string, label: string }, actionMeta: ActionMeta<{ value: string, label: string }>) => {
        const selectedPackage = plans.find((pkg: Plan) => pkg.id.toString() === selectedOption.value);
        setSelectedPlan(selectedPackage);
        onPlanChange({ type: selectedRadio, planId: selectedPackage ? selectedPackage.id : null });
    };

    return (
        <div className={styles.choosePlanWrapper}>

            <p className={styles.choosePlanTitle}>1. Choose your plan</p>
            <p className={styles.choosePlanDesc}>Subscription Plan</p>
            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={plans.map((plan) => ({ value: plan.id.toString(), label: plan.name }))}
                        styles={customStyles}
                        value={
                            isLoading
                                ? { value: 'wait', label: 'Wait' }
                                : selectedPlan
                                    ? { value: selectedPlan.id.toString(), label: selectedPlan.name }
                                    : plan
                                        ? { value: plan.id.toString(), label: plan.name }
                                        : null
                        }
                        onChange={handleChangePackage as any}
                    />
                )}
            />
            <div className={styles.radiomainWrapper}>
                <div className={styles.radioWrapper}>
                    <div className={styles.btnWrapper}>
                        <Controller
                            name="subscriptionType"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="radio"
                                        id="monthlyRadioBtn"
                                        className={styles.radio}
                                        {...field}
                                        value="Mounthly"
                                        onChange={() => handleRadioChange("Mounthly")}
                                        checked={selectedRadio === "Mounthly" || (selectedRadio === null && typeOfPrice === 'Mounthly')}
                                    />
                                    <label htmlFor="monthlyRadioBtn" className={styles.label}>
                                        Mounthly
                                    </label>
                                </>
                            )}
                        />
                    </div>
                    <p className={styles.radioDescription}>To achieve this, it would be necessary to have uniform grammar</p>
                </div>
                <div className={styles.radioWrapper}>
                    <div className={styles.btnWrapper}>
                        <Controller
                            name="subscriptionType"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        type="radio"
                                        id="annualRadioBtn"
                                        className={styles.radio}
                                        {...field}
                                        value="Annual"
                                        checked={selectedRadio === "Annual" || (selectedRadio === null && typeOfPrice === 'Annual')}
                                        onChange={() => handleRadioChange("Annual")}
                                    />
                                    <label htmlFor="annualRadioBtn" className={styles.label}>
                                        Annual
                                    </label>
                                </>
                            )}
                        />
                    </div>
                    <p className={styles.radioDescription}>To achieve this, it would be necessary to have uniform grammar</p>
                </div>

            </div>
        </div >
    );
};

