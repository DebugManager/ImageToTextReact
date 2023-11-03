import axios from "axios";
import { toast } from 'react-toastify';

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

const GET_USER_BY_ID = process.env.GET_USER_BY_ID || 'http://157.230.50.75:8000/v1/users';
const CREATE_USER = process.env.CREATE_USER || 'http://157.230.50.75:8000/v1/user-create-with-permissions/';
const SEARCH_USERS = process.env.SEARCH_USERS || 'http://157.230.50.75:8000/v1/users?search=';
const SEARCH_USER_WITH_SORTOPTION = process.env.SEARCH_USER_WITH_SORTOPTION || 'http://157.230.50.75:8000/v1/users/?ordering=';

interface ICreateUser {
    first_name: string;
    last_name: string;
    email: string;
    password?: string | number;
    is_superuser?: boolean;
    is_staff?: boolean;
    user_permissions: number[];
}

export const getUserById = async (id: string | number) => {
    try {
        const response = await axios.get(`${GET_USER_BY_ID}/${id}/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${GET_USER_BY_ID}/users/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getAllUsersWithSort = async (sortOption: string) => {
    try {
        const response = await axios.get(`${SEARCH_USER_WITH_SORTOPTION}${sortOption}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteUserById = async (id: string | number) => {
    try {
        const response = await axios.delete(`${GET_USER_BY_ID}/${id}/`);
        if (response.status === 204) {
            toast.success('The user has been successfully deleted', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
        }
        return response;
    } catch (error) {
        toast.error('Something goes wrong', {
            position: 'top-right',
            autoClose: 3000,
            className: 'my-custom-toast-error',
            style: myCustomStyles,
            progressClassName: 'my-custom-progress-bar',
            progressStyle: progressBarStyles,
            icon: <CustomErrorIcon />,
        });
        console.error(error);
    }
}

export const createUser = async (data: ICreateUser) => {
    try {
        const response = await axios.post(`${CREATE_USER}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const editUserById = async (data: ICreateUser, userId: number) => {
    if (userId) {
        try {
            const response = await axios.patch(`${CREATE_USER}${userId}/`, data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

export const searchUsers = async (searchParam: string) => {
    try {
        const response = await axios.get(`${SEARCH_USERS}${searchParam}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
