import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Create the Auth Context
const AuthContext = createContext();

// Create a custom hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mfaPendingEmail, setMfaPendingEmail] = useState(null);

    const navigate = useNavigate();
    const isRefreshing = useRef(false);
    const subscribers = useRef([]);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // --- Session Management (Token Refreshing) ---
    const subscribeTokenRefresh = (cb) => {
        subscribers.current.push(cb);
    };

    const onRefreshed = (newToken) => {
        subscribers.current.forEach(cb => cb(newToken));
        subscribers.current = [];
    };

    const handleAuthentication = (newToken) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);
    };

    const logout = (redirect = true) => {
        setUser(null);
        setToken(null);
        setMfaPendingEmail(null);
        localStorage.removeItem('userToken');
        if (redirect) {
            window.location.href = '/signin';
        }
    };

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const currentToken = localStorage.getItem('userToken');
                if (currentToken && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${currentToken}`;
                }
                return config;
            },
            (err) => Promise.reject(err)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (err) => {
                const originalRequest = err.config;

                if (err.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const urlsToExclude = [
                        '/auth/login',
                        '/auth/verify-mfa',
                        '/auth/register',
                        '/auth/refresh-token'
                    ];

                    if (urlsToExclude.some(url => originalRequest.url.endsWith(url))) {
                        return Promise.reject(err);
                    }
                    if (isRefreshing.current) {
                        return new Promise(resolve => {
                            subscribeTokenRefresh(newToken => {
                                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                                resolve(axios(originalRequest));
                            });
                        });
                    }

                    isRefreshing.current = true;
                    try {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
                        const newAccessToken = response.data.accessToken;

                        localStorage.setItem('userToken', newAccessToken);
                        setToken(newAccessToken);
                        onRefreshed(newAccessToken);

                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    } catch (refreshErr) {
                        toast.error('Session expired. Please log in again.');
                        logout(true); // Redirect on session expiry
                        return Promise.reject(refreshErr);
                    } finally {
                        isRefreshing.current = false;
                    }
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [API_BASE_URL]);


    useEffect(() => {
        const fetchMe = async () => {
            const isReauthFlow = new URLSearchParams(window.location.search).has('reauth_token');
            if (isReauthFlow) {
                setLoading(false);
                return;
            }

            if (token) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`${API_BASE_URL}/auth/me`);
                    setUser(response.data);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch user data.');
                    logout(false);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setUser(null);
            }
        };
        fetchMe();
    }, [token, API_BASE_URL]);

    // --- Core Authentication Functions ---

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            return { success: true, message: response.data.message };
        } catch (err) {
            setError(err.response?.data?.message || 'Network error.');
            return { success: false, message: err.response?.data?.message || 'Registration failed.' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            const data = response.data;
            if (data.mfaRequired) {
                setMfaPendingEmail(credentials.email);
                 navigate('/verify-login', { 
                    replace: true, 
                    state: { mfaMethod: data.mfaMethod } 
                });
                return { success: true, mfaRequired: true };

            }
            if (response.status === 200 && data.accessToken) {
                const authToken = data.accessToken;
                localStorage.setItem('userToken', authToken);
                setToken(authToken);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
            return { success: false, message: err.response?.data?.message || 'Login failed.' };
        } finally {
            setLoading(false);
        }
    };

    const verifyMfa = async (code, mfaToken = null) => {
        if (!mfaPendingEmail && !mfaToken)  {
             return { success: false, message: 'MFA verification process not started.' };
        }
        setLoading(true);
        setError(null);
        try {
            const payload = mfaToken 
                ? { code, mfaToken } 
                : { email: mfaPendingEmail, code };

            const response = await axios.post(`${API_BASE_URL}/auth/verify-mfa`, payload);
            if (response.status === 200) {
                const data = response.data;
                const authToken = data.accessToken;
                localStorage.setItem('userToken', authToken);
                setToken(authToken);
                setMfaPendingEmail(null);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'MFA verification failed.');
            return { success: false, message: err.response?.data?.message || 'MFA verification failed.' };
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => {
        setLoading(true);
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const setupGoogleUserOrganization = async (orgData, setupToken) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/organizations/setup-google-user`,
                { organization: orgData },
                { headers: { Authorization: `Bearer ${setupToken}` } }
            );

            if (response.status === 201 || response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem('userToken', accessToken);
                setToken(accessToken);
                localStorage.removeItem('setupToken');
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to set up organization.';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

        const verifyEmail = async (tokenParam) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/verifyemail/${tokenParam}`);
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or server unavailable.');
            return { success: false, message: err.response?.data?.message || 'Email verification failed.' };
        } finally {
            setLoading(false);
        }
    };
    
    const resendVerification = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or server unavailable.');
            return { success: false, message: err.response?.data?.message || 'Failed to resend verification email.' };
        } finally {
            setLoading(false);
        }
    };
    
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or server unavailable.');
            return { success: false, message: err.response?.data?.message || 'Failed to send password reset email.' };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${token}`, { password: newPassword });
            if (response.status === 200) {
                const newAccessToken = response.data.accessToken;
                localStorage.setItem('userToken', newAccessToken);
                setToken(newAccessToken);
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or server unavailable.');
            return { success: false, message: err.response?.data?.message || 'Failed to reset password.' };
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_BASE_URL}/auth/change-password`, { oldPassword, newPassword });
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error or server unavailable.');
            return { success: false, message: err.response?.data?.message || 'Failed to change password.' };
        } finally {
            setLoading(false);
        }
    };

    const updateUserAvatar = async (avatarData) => {
        if (!token) {
            toast.error("You must be logged in to update your avatar.");
            return { success: false };
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(`${API_BASE_URL}/users/me/avatar`, avatarData, config);
            
            setUser(prevUser => ({ ...prevUser, avatar: data.avatar }));
            toast.success(data.message);
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update avatar.");
            return { success: false };
        }
    };

    const updatePersonalInfo = async (userData) => {
        if (!user?._id) {
            toast.error("Not logged in.");
            return { success: false };
        }
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${user._id}`, userData);
            setUser(prevUser => ({ ...prevUser, ...response.data }));
            toast.success("Profile updated successfully!");
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile.';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };


    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        setUser, // Expose setUser to allow MfaContext to update the user object
        token,
        loading,
        error,
        logout,
        handleAuthentication,
        login,
        register,
        verifyMfa,
        loginWithGoogle,
        updatePersonalInfo,
        setupGoogleUserOrganization,
        verifyEmail,
        resendVerification,
        updateUserAvatar,
        forgotPassword,
        resetPassword,
        changePassword,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
