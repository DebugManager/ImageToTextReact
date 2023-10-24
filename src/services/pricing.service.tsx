import axios from 'axios';
import { toast } from 'react-toastify';
import { removeUser, setUser } from './locastorage.service';
import { getUserById } from './user.service';

const myCustomStyles = {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
};

const progressBarStyles = {
    background: '#556EE6',
};

const CustomCheckmark = () => (
    <div style={{ color: '#556EE6' }}>✔</div>
);

const CustomErrorIcon = () => (
    <div style={{ color: 'red' }}>✘</div>
);

interface IUser {
    current_plan: string | number;
    address_line1: string;
    city: string;
    zip_code: string | number;
    country: string | number;
}

const GET_PRICING_PLANS = process.env.REACT_APP_API_URL || 'https://pdf-to-txt-back.onrender.com/v1/plan';
const BY_PACKAGE = process.env.BY_PACKAGE || 'https://pdf-to-txt-back.onrender.com/v1/choose-plan';

export const getPricing = async (type: string) => {
    try {
        const response = await axios.get(`${GET_PRICING_PLANS}?type=${type}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getPricingById = async (id: string | number) => {
    try {
        const response = await axios.get(`${GET_PRICING_PLANS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const buyPackage = async (userData: IUser, userid: string | number) => {
    try {
        const response = await axios.put(`${BY_PACKAGE}/${userid}`, userData);

        if (response.data.current_plan) {
            const user = await getUserById(userid);
            if (user.current_plan) {
                removeUser();
                setUser(user);
            }

            toast.success('The package has been processed successfully', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });

            return 'ok';
        }



    } catch (error) {
        console.error(error);
        toast.error('Oppps... Something goes wrong', {
            position: 'top-right',
            autoClose: 3000,
            className: 'my-custom-toast-error',
            style: myCustomStyles,
            progressClassName: 'my-custom-progress-bar',
            progressStyle: progressBarStyles,
            icon: <CustomErrorIcon />,
        });
        return 'error';
    }
}