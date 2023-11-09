import axios from 'axios';
import { toast } from 'react-toastify';
import { setToken, setUser } from './locastorage.service';

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

export default CustomErrorIcon;

const USER_REGISTRATION_URL = process.env.REACT_APP_API_URL || 'http://157.230.50.75:8000/v1';
const USER_LOGIN_URL = process.env.REACT_APP_LOGIN_URL || 'http://157.230.50.75:8000/v1/auth/token/create/';
const USER_RESET_PASSWORD_LINK = process.env.REACT_APP_RESET_PASSWORD_LINK || 'http://157.230.50.75:8000/v1/auth/users/reset_password/';
const USER_RESET_PASSWORD = process.env.REACT_USER_RESET_PASSWORD || "http://157.230.50.75:8000/v1/auth/users/reset_password_confirm/";

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

interface IUserReset {
    uid: string,
    token: string,
    new_password: string,
}

interface IUserResetLink {
    email: string
}


export const userRegistration = async (userData: IUserRegistration) => {
    try {
        const response = await axios.post(`${USER_REGISTRATION_URL}/auth/register/`, userData);

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

            return 'ok';
        }
    } catch (error) {
        console.error(error);
        toast.error('User with this email already registered', {
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
};

export const userLogin = async (userData: IUserLogin) => {
    try {
        const response = await axios.post(USER_LOGIN_URL, userData);

        if (response.status === 200) {
            const token = response.data.token.auth_token;
            const user = response.data.user;
            setUser(user);

            if (token) {
                setToken(token);
            }

            return 'ok';
        }
    } catch (error) {
        console.error(error);
        toast.error('Email or password is not correct', {
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
};

export const userResetPasswordLink = async (userData: IUserResetLink) => {

    try {
        const response = await axios.post(USER_RESET_PASSWORD_LINK, userData);

        if (response.status === 204) {
            toast.success('Verification letter sended to your email', {
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
    }
}


export const userResetPassword = async (userData: IUserReset) => {
    try {
        const response = await axios.post(USER_RESET_PASSWORD, userData);

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
}


