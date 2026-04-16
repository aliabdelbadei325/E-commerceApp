import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {object} - { success, error, user }
     */
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    /**
     * Register new user
     * @param {object} userData - { firstName, lastName, email, password }
     * @returns {object} - { success, error, user }
     */
    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optional: Call logout endpoint if you want to blacklist token on server
        // api.post('/auth/logout').catch(console.error);
    };

    /**
     * Check if user has specific role
     * @param {string|string[]} roles - Required role(s)
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    };

    /**
     * Get dashboard path based on role
     */
    const getDashboardPath = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/admin';
            case 'staff': return '/staff';
            default: return '/dashboard';
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
        getDashboardPath
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
