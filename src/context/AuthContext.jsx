import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Use environment variable for API URL - allows configuration for deployed environments
// In development, fallback to localhost:3001
// For production, set VITE_API_URL in your deployment environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'somba-auth-token';
const USER_KEY = 'somba-auth-user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // API helper with auth
    const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) { logout(); }
            throw new Error(data.error || 'Request failed');
        }
        return data;
    }, [token]);

    const login = async (email, password) => {
        const data = await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    };

    const register = async (email, password, name, cohort) => {
        const data = await fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, cohort })
        });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isActiveStudent: user?.role === 'active_student',
        isCompletedStudent: user?.role === 'completed_student',
        login,
        register,
        logout,
        fetchWithAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
