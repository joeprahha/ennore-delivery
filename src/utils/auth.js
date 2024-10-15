import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Keep this at 


// Utility to check authentication before loading any page
export const requireAuth = (navigate) => {
    if (!isTokenValid()) {
        navigate('/signin');
    }
};



const TOKEN_KEY = 'authToken';

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const decodeToken = () => {
    const token = getToken();
    if (token) {
        return jwtDecode(token);
    }
    return {};
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const redirectUser = (navigate) => {
    const token = getToken();
    if (!token) return navigate('/signin');
    
    const decoded = jwtDecode(token);
    const scope = decoded.scope;
    switch (scope) {
        case 'customer':
            navigate('/stores');
            break;
        case 'owner':
            navigate(`/mystore/${decoded.id}`);
            break;
        case 'delivery_partner':
            navigate('/deliveries');
            break;
        default:
            navigate('/signin');
    }
};

export const getUserFromToken = (token) => {
    try {
        return jwtDecode(token); // Decode JWT token to get user data (like scope)
    } catch (error) {
        return null;
    }
};
export const logout = (navigate) => {
        removeToken();
                    navigate('/signin');
    };

