import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken } from '../services/locastorage.service';

interface AuthContextType {
    isAuthenticated: boolean;
}

const Context = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getToken();
        token?.length ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }, []);

    return <Context.Provider value={{ isAuthenticated }}>{children}</Context.Provider>;
}

export default AuthProvider;

export const useAuth = () => useContext(Context);
