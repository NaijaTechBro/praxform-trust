// import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// // Create the Auth Context
// const AuthContext = createContext();

// // Create a custom hook to use the Auth Context
// export const useAuth = () => {
//     return useContext(AuthContext);
// };

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem('userToken'));
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState('signIn');

//     const axiosInterceptor = useRef(null);
//     const isRefreshing = useRef(false);
//     const subscribers = useRef([]);

//     const API_BASE_URL = import.meta.env.VITE_API_URL;

//     // Helper function to process queued requests after token refresh
//     const subscribeTokenRefresh = (cb) => {
//         subscribers.current.push(cb);
//     };

//     const onRefreshed = (newToken) => {
//         subscribers.current.forEach(cb => cb(newToken));
//         subscribers.current = [];
//     };

//     const logout = (redirect = true) => {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem('userToken');
//         if (redirect) {
//             window.location.href = '/signin';
//         }
//     };

// useEffect(() => {
//     // This part sets up the request interceptor to add the auth token to every request.
//     // It remains unchanged.
//     const requestInterceptor = axios.interceptors.request.use(
//         (config) => {
//             if (token && !config.headers['Authorization']) {
//                 config.headers['Authorization'] = `Bearer ${token}`;
//             }
//             return config;
//         },
//         (err) => Promise.reject(err)
//     );

//     // This is the updated response interceptor with the smarter logic.
//     const responseInterceptor = axios.interceptors.response.use(
//         (response) => response,
//         async (err) => {
//             const originalRequest = err.config;

//             // Check if the error is a 401 and we haven't already retried this specific request.
//             if (err.response?.status === 401 && !originalRequest._retry) {
                
//                 originalRequest._retry = true;

//                 // List of API paths where a 401 should NOT trigger a refresh.
//                 const urlsToExclude = [
//                     '/auth/login',
//                     '/auth/verify-mfa',
//                     '/auth/register',
//                     '/auth/refresh-token' // Exclude the refresh endpoint itself.
//                 ];

//                 if (urlsToExclude.some(url => originalRequest.url.endsWith(url))) {
//                     return Promise.reject(err);
//                 }
//                 // If a token refresh is already in progress, queue this request.
//                 if (isRefreshing.current) {
//                     return new Promise(resolve => {
//                         subscribeTokenRefresh(newToken => {
//                             originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//                             resolve(axios(originalRequest));
//                         });
//                     });
//                 }

//                 // If we get here, it's a genuine session expiry, so attempt to refresh the token.
//                 isRefreshing.current = true;
//                 try {
//                     const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
//                     const newAccessToken = response.data.accessToken;

//                     localStorage.setItem('userToken', newAccessToken);
//                     setToken(newAccessToken);
//                     onRefreshed(newAccessToken);

//                     // Update the header of the original failed request with the new token.
//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
//                     // Retry the original request with the new token.
//                     return axios(originalRequest);

//                 } catch (refreshErr) {
//                     toast.error('Session expired. Please log in again.');
//                     logout(); // Your existing logout function
//                     return Promise.reject(refreshErr);
//                 } finally {
//                     isRefreshing.current = false;
//                 }
//             }
            
//             // For any other errors, just reject the promise.
//             return Promise.reject(err);
//         }
//     );
    
//     // Cleanup function to remove interceptors when the component unmounts.
//     return () => {
//         axios.interceptors.request.eject(requestInterceptor);
//         axios.interceptors.response.eject(responseInterceptor);
//     };
// }, [token, API_BASE_URL]);


// useEffect(() => {
//         const fetchMe = async () => {
//             if (token) {
//                 setLoading(true);
//                 setError(null);
//                 try {
//                     const response = await axios.get(`${API_BASE_URL}/auth/me`);
                    
//                     setUser(response.data);

//                 } catch (err) {
//                     setError(err.response?.data?.message || 'Failed to fetch user data. Please log in again.');
//                     logout();
//                 } finally {
//                     setLoading(false);
//                 }
//             } else {
//                 setLoading(false);
//                 setUser(null);
//             }
//         };
//         fetchMe();
//     }, [token, API_BASE_URL]);

//     const register = async (userData) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
//             if (response.status === 201) {
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Registration failed.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (credentials) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
//             const data = response.data;

//             // MFA is now mandatory, so we always expect mfaRequired
//             if (data.mfaRequired) {
//                 return { success: true, mfaRequired: true, message: data.message };
//             }
            
//             // This part is a fallback, but the backend should always require MFA now
//             if (response.status === 200 && data.accessToken) {
//                 const authToken = data.accessToken;
//                 localStorage.setItem('userToken', authToken);
//                 setToken(authToken);
//                 return { success: true };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Login failed.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyMfa = async (email, code) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/verify-mfa`, { email, code });
//             if (response.status === 200) {
//                 const data = response.data;
//                 const authToken = data.accessToken;
//                 localStorage.setItem('userToken', authToken);
//                 setToken(authToken);
//                 return { success: true };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'MFA verification failed.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const googleAuth = async (googleCode) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/google`, { code: googleCode });
//             if (response.status === 200 || response.status === 201) {
//                 const data = response.data;
//                 const authToken = data.accessToken;
//                 localStorage.setItem('userToken', authToken);
//                 setToken(authToken);
//                 return { success: true };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Google authentication failed.');
//             return { success: false, message: err.response?.data?.message || 'Google authentication failed.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resendVerification = async (email) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
//             if (response.status === 200) {
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Failed to resend verification email.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyEmail = async (tokenParam) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(`${API_BASE_URL}/auth/verifyemail/${tokenParam}`);
//             if (response.status === 200) {
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Email verification failed.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const forgotPassword = async (email) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
//             if (response.status === 200) {
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Failed to send password reset email.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetPassword = async (token, newPassword) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${token}`, { password: newPassword });
//             if (response.status === 200) {
//                 const newAccessToken = response.data.accessToken;
//                 localStorage.setItem('userToken', newAccessToken);
//                 setToken(newAccessToken);
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Failed to reset password.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const changePassword = async (oldPassword, newPassword) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.put(`${API_BASE_URL}/auth/change-password`, { oldPassword, newPassword });
//             if (response.status === 200) {
//                 return { success: true, message: response.data.message };
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Network error or server unavailable.');
//             return { success: false, message: err.response?.data?.message || 'Failed to change password.' };
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updatePersonalInfo = async (userData) => {
//         if (!user?._id) {
//             toast.error("Not logged in.");
//             return { success: false };
//         }
//         try {
//             const response = await axios.put(`${API_BASE_URL}/users/${user._id}`, userData);
//             // Update the user state within this context
//             setUser(prevUser => ({ ...prevUser, ...response.data }));
//             toast.success("Profile updated successfully!");
//             return { success: true };
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to update profile.';
//             toast.error(errorMessage);
//             return { success: false, message: errorMessage };
//         }
//     };


//     const toggleMfa = async (mfaEnabled, password) => {
//         if (!user?._id) {
//             toast.error("User not found. Please log in again.");
//             return { success: false };
//         }
        
//         try {
//             const response = await axios.put(`${API_BASE_URL}/users/${user._id}/mfa-toggle`, {
//                 mfaEnabled,
//                 password
//             });
            
//             if (response.data.success) {
//                 // IMPORTANT: Update the local user state to reflect the change instantly
//                 setUser(prevUser => ({
//                     ...prevUser,
//                     mfaEnabled: response.data.mfaEnabled
//                 }));
//                 toast.success(response.data.message);
//                 return { success: true };
//             }
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to update setting.';
//             toast.error(errorMessage);
//             return { success: false, message: errorMessage };
//         }
//     };
// /**
//      * Updates the current user's avatar.
//      * @param {object} avatarData - An object containing { public_id, url }.
//      * @returns {Promise<{success: boolean}>}
//      */
//     const updateUserAvatar = async (avatarData) => {
//         if (!token) {
//             toast.error("You must be logged in to update your avatar.");
//             return { success: false };
//         }
//         try {
//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             };
//             const { data } = await axios.put(`${API_BASE_URL}/users/me/avatar`, avatarData, config);
            
//             // Update user state immediately for instant UI feedback
//             setUser(prevUser => ({ ...prevUser, avatar: data.avatar }));
//             toast.success(data.message);
//             return { success: true };
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update avatar.");
//             return { success: false };
//         }
//     };


//     const clearError = () => {
//         setError(null);
//     };

//     const value = {
//         user,
//         token,
//         loading,
//         error,
//         setUser,
//         currentPage,
//         setCurrentPage,
//         register,
//         login,
//         logout,
//         verifyMfa,
//         googleAuth,
//         resendVerification,
//         verifyEmail,
//         forgotPassword,
//         resetPassword,
//         changePassword,
//         updatePersonalInfo,
//         toggleMfa,
//         updateUserAvatar,
//         clearError,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };



















import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
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
    const [currentPage, setCurrentPage] = useState('signIn');

    const isRefreshing = useRef(false);
    const subscribers = useRef([]);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Helper function to process queued requests after token refresh
    const subscribeTokenRefresh = (cb) => {
        subscribers.current.push(cb);
    };

    const onRefreshed = (newToken) => {
        subscribers.current.forEach(cb => cb(newToken));
        subscribers.current = [];
    };

    const logout = (redirect = true) => {
        setUser(null);
        setToken(null);
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
                        // We use a new axios instance to avoid interceptor loop
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
                        const newAccessToken = response.data.accessToken;

                        localStorage.setItem('userToken', newAccessToken);
                        setToken(newAccessToken);
                        onRefreshed(newAccessToken);

                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    } catch (refreshErr) {
                        toast.error('Session expired. Please log in again.');
                        logout();
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
            if (token) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`${API_BASE_URL}/auth/me`);
                    setUser(response.data);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch user data.');
                    logout();
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

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            if (response.status === 201) {
                return { success: true, message: response.data.message };
            }
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
                return { success: true, mfaRequired: true, message: data.message };
            }
            if (response.status === 200 && data.accessToken) {
                const authToken = data.accessToken;
                localStorage.setItem('userToken', authToken);
                setToken(authToken);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error.');
            return { success: false, message: err.response?.data?.message || 'Login failed.' };
        } finally {
            setLoading(false);
        }
    };

    const verifyMfa = async (email, code) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-mfa`, { email, code });
            if (response.status === 200) {
                const data = response.data;
                const authToken = data.accessToken;
                localStorage.setItem('userToken', authToken);
                setToken(authToken);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Network error.');
            return { success: false, message: err.response?.data?.message || 'MFA verification failed.' };
        } finally {
            setLoading(false);
        }
    };

    // New function to initiate Google OAuth by redirecting to our backend
    const loginWithGoogle = () => {
        setLoading(true);
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    // New function for the final step of Google registration
    const setupGoogleUserOrganization = async (orgData, setupToken) => {
        setLoading(true);
        setError(null);
        try {
            // This endpoint is hypothetical; you will need to create it on your backend.
            // It should verify the setupToken, create the organization, and return a final login token.
            const response = await axios.post(
                `${API_BASE_URL}/organizations/setup-google-user`,
                { organization: orgData },
                { headers: { Authorization: `Bearer ${setupToken}` } }
            );

            if (response.status === 201 || response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem('userToken', accessToken);
                setToken(accessToken);
                localStorage.removeItem('setupToken'); // Clean up temporary token
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

    const updatePersonalInfo = async (userData) => {
        if (!user?._id) {
            toast.error("Not logged in.");
            return { success: false };
        }
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${user._id}`, userData);
            // Update the user state within this context
            setUser(prevUser => ({ ...prevUser, ...response.data }));
            toast.success("Profile updated successfully!");
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile.';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };


    const toggleMfa = async (mfaEnabled, password) => {
        if (!user?._id) {
            toast.error("User not found. Please log in again.");
            return { success: false };
        }
        
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${user._id}/mfa-toggle`, {
                mfaEnabled,
                password
            });
            
            if (response.data.success) {
                // IMPORTANT: Update the local user state to reflect the change instantly
                setUser(prevUser => ({
                    ...prevUser,
                    mfaEnabled: response.data.mfaEnabled
                }));
                toast.success(response.data.message);
                return { success: true };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update setting.';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };
/**
     * Updates the current user's avatar.
     * @param {object} avatarData - An object containing { public_id, url }.
     * @returns {Promise<{success: boolean}>}
     */
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
            
            // Update user state immediately for instant UI feedback
            setUser(prevUser => ({ ...prevUser, avatar: data.avatar }));
            toast.success(data.message);
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update avatar.");
            return { success: false };
        }
    };



    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        setUser,
        setToken, // Exposed for the callback component
        currentPage,
        setCurrentPage,
        register,
        login,
        logout,
        verifyMfa,
        resendVerification,
        loginWithGoogle, // New Google login function
        setupGoogleUserOrganization, // New function for org setup
        forgotPassword,
        resetPassword,
        changePassword,
        updatePersonalInfo,
        toggleMfa,
        updateUserAvatar,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};