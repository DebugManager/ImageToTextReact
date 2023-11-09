import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Controller } from 'react-hook-form';
import { getPackages } from '../../../services/pricing.service';

import styles from './ChosePlanForm.module.css';

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
  
interface IChoosePlan {
    onSubmit?: (data: any) => void;
    control: any;
    errors: any;
    formOptions?: any;
    plan?: Price | undefined | null;
    onPlanChange: (data: any) => void;
    typeOfPrice: string;
}

interface IPlanDate {
    id: string;
    value: string;
}

const customStyles: StylesConfig = {
    control: (provided) => ({
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

    valueContainer: (provided) => ({
        ...provided,
        padding: '0 6px'
    }),

    input: (provided) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    indicatorsContainer: (provided) => ({
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
    const [selectedPlan, setSelectedPlan] = useState<IPlanDate | null>({id: plan?.price.id, value: plan?.product.name});
    const [plans, setPlans] = useState<Price[]>([]);
    const [planFromPropsSet, setPlanFromPropsSet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedRadio) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await getPackages(typeOfPrice);
                    const filtereData = data.prices.filter((plan: Price) => plan.product_name !== 'On hold')
                    setPlans(filtereData);
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
                    const data = await getPackages(selectedRadio);
                    const filtereData = data.prices.filter((plan: Price) => plan.product_name !== 'On hold')
                    setPlans(filtereData);
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
            setSelectedPlan({id: plan.price.id, value: plan?.product.name});
            setPlanFromPropsSet(true);
        }
    }, [plan, planFromPropsSet]);

    const handleRadioChange = (newValue: string) => {
        setSelectedRadio(newValue);
        setSelectedPlan({id: '', value: ''});
        onPlanChange({ type: newValue, planId: null });
    };

    const handleChangePackage = (selectedOption: { value: string, label: string }) => {
        const selectedPackage = plans.find((pkg: Price) => pkg.id.toString() === selectedOption.value);
        if (selectedPackage) {
            setSelectedPlan({id: selectedPackage.id, value: selectedPackage.product_name});
            onPlanChange({ type: selectedRadio, planId: selectedPackage.id });
        }
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
                        options={plans.map((plan) => ({ value: plan.id, label: plan.product_name }))}
                        styles={customStyles}
                        value={
                            isLoading
                                ? { value: 'wait', label: 'Wait' }
                                : selectedPlan
                                    ? { value: selectedPlan.id, label: selectedPlan.value }
                                    : plan
                                        ? { value: plan.id, label: plan.product_name }
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
                                        value="month"
                                        onChange={() => handleRadioChange("month")}
                                        checked={selectedRadio === "month" || (selectedRadio === null && typeOfPrice === 'month')}
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
                                        value="year"
                                        checked={selectedRadio === "year" || (selectedRadio === null && typeOfPrice === 'year')}
                                        onChange={() => handleRadioChange("year")}
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

