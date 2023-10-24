interface IUser {
    id: number;
    last_login: string;
    email: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    first_name: string;
    last_name: string;
    address_line1: string;
    city: string;
    zip_code: number;
    country: string;
    current_plan: any;
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
