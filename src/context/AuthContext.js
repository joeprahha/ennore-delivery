import React, { createContext, useState, useEffect } from 'react';
import { getToken, getUserFromToken, removeToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            const userData = getUserFromToken(token);
            setUser(userData);
        }
    }, []);

    const login = (token) => {
        const userData = getUserFromToken(token);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
