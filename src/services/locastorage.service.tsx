interface IUser {
    readed_notification: null | number[];
    address_line1: string;
    affiliate: boolean;
    affiliate_code: null | string;
    city: string;
    company: any[];
    country: string;
    current_plan: string;
    customer_id: string;
    email: string;
    first_name: string;
    groups: any[];
    id: number;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    joined: string;
    last_login: string;
    last_name: string;
    password: string;
    phone: null | string;
    status: string;
    type: string;
    user_permissions: any[];
    zip_code: number;
    payment_method_id: string;
    subscription_id: string;
    affiliate_id: string | number;
  }

const TOKEN_KEY = 'authToken';
const USER = 'user';

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getUser = (): IUser | null => {
    const userStr = localStorage.getItem(USER);
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

export const setUser = (user: IUser): void => {
    localStorage.setItem(USER, JSON.stringify(user));
};

export const removeUser = (): void => {
    localStorage.removeItem(USER);
};
