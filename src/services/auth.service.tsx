import axios from 'axios';
import { toast } from 'react-toastify';
import { setToken } from './locastorage.service';

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

const USER_REGISTRATION_URL = process.env.REACT_APP_API_URL || 'https://pdf-to-txt-back.onrender.com/v1';
const USER_LOGIN_URL = process.env.REACT_APP_LOGIN_URL || 'https://pdf-to-txt-back.onrender.com/auth/token/login/'

interface IUserRegistration {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface IUserLogin {
    email: string;
    password: string;
}


export const userRegistration = async (userData: IUserRegistration) => {
    try {
        const response = await axios.post(`${USER_REGISTRATION_URL}/auth/users/`, userData);

        if (response.status === 201) {
            toast.success('The user has been successfully registered', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export const userLogin = async (userData: IUserLogin) => {
    try {
        const response = await axios.post(USER_LOGIN_URL, userData);

        if (response.status === 200) {
            const token = response.data.auth_token;

            if (token) {
                setToken(token);
            }

            return 'ok';
        }
    } catch (error) {
        console.error(error);
    }
};



