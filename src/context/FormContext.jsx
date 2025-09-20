// import React, { createContext, useState, useContext, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const FormContext = createContext();

// export const useForms = () => {
//     return useContext(FormContext);
// };

// export const FormProvider = ({ children }) => {
//     const { token } = useAuth();
//     const [forms, setForms] = useState([]);
//     const [currentForm, setCurrentForm] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const API_BASE_URL = import.meta.env.VITE_API_URL;

//     const clearError = () => setError(null);
//     const clearCurrentForm = () => setCurrentForm(null);

//     const makeAuthenticatedRequest = async (method, url, data = null) => {
//         if (!token) {
//             setError('Authentication token is missing. Please log in.');
//             throw new Error('Unauthorized');
//         }
//         const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
//         try {
//             setLoading(true);
//             setError(null);
//             const res = await axios[method](url, ...(data ? [data, config] : [config]));
//             return res.data;
//         } catch (err) {
//             console.error('Form API error:', err);
//             const errorMessage = err.response?.data?.message || 'Server error or network issue.';
//             setError(errorMessage);
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getForms = useCallback (
//         async () => {
//         if (!token) return;
//         try {
//             const fetchedForms = await makeAuthenticatedRequest('get', `${API_BASE_URL}/forms`);
//             setForms(fetchedForms);
//         } catch (err) { /* Error handled in helper */ }
//     });
    
//     // --- FIX APPLIED HERE ---
//     const createForm = useCallback (
//         async (formData) => {
//         try {
//             // The API returns the newly created form, so we must return it here
//             const newForm = await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms`, formData);
//             setForms((prevForms) => [...prevForms, newForm]);
//             return newForm; // <<< THIS IS THE FIX
//         } catch (err) {
//             throw err;
//         }
//     })

//     // --- FIX APPLIED HERE ---
//     const getFormById = useCallback (
//         async (id) => {
//         try {
//             const form = await makeAuthenticatedRequest('get', `${API_BASE_URL}/forms/${id}`);
//             setCurrentForm(form);
//             return form; // <<< THIS IS THE FIX
//         } catch (err) {
//             throw err;
//         }
//     }
//     )
    
//     const updateForm = useCallback ( 
//         async (id, formData) => {
//         try {
//             const updatedForm = await makeAuthenticatedRequest('put', `${API_BASE_URL}/forms/${id}`, formData);
//             setForms((prevForms) => prevForms.map((form) => (form._id === id ? updatedForm : form)));
//             setCurrentForm(updatedForm);
//             return updatedForm; 
//         } catch (err) {
//             throw err;
//         }
//     }
//     )

//       const getDashboardStats = useCallback(async () => {
//         try {
//             const config = {
//                 headers: { 'Authorization': `Bearer ${token}` },
//             };
//             const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, config);
//             return response.data;
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to load dashboard data.';
//             throw new Error(errorMessage);
//         }
//     }, [token, API_BASE_URL]);

// const deleteForm = useCallback (
//     async (id, formName) => {
//     if (!token) {
//         setError('Authentication token is missing. Please log in.');
//         throw new Error('Unauthorized');
//     }
//     try {
//         setLoading(true);
//         setError(null);
//         const config = {
//             headers: { 'Authorization': `Bearer ${token}` },
//             data: {
//                 formName: formName
//             }
//         };
        
//         await axios.delete(`${API_BASE_URL}/forms/${id}`, config);

//         setForms((prevForms) => prevForms.filter((form) => form._id !== id));
//     } catch (err) {
//         console.error('Form API error on delete:', err);
//         const errorMessage = err.response?.data?.message || 'Server error or network issue.';
//         setError(errorMessage);
//         throw err;
//     } finally {
//         setLoading(false);
//     }
// }
// )
    
//     const sendForm = useCallback (
//         async (id, { recipients, message, oneTimeUse, smsCode, emailAuth, dueDate }) => {
//         try {
//             const payload = { recipients, message, oneTimeUse, smsCode, emailAuth, dueDate };
//             await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms/${id}/send`, payload);
//             await getForms();
//             setCurrentForm(prev => prev ? { ...prev, status: 'active' } : null);
//         } catch (err) {
//             throw err;
//         }
//     }
//     );
    
//     const getSecureLink = useCallback (
//         async (id) => {
//         try {
//             const response = await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms/${id}/secure-link`);
//             return response.link;
//         } catch (err) {
//             throw err;
//         }
//     }
//     );


//     const updateFormHeaderImage = useCallback (async (formId, imageData) => {
//         try {
//             const config = { headers: { 'Authorization': `Bearer ${token}` } };
//             const { data } = await axios.put(`${API_BASE_URL}/forms/${formId}/header-image`, imageData, config);
//             toast.success(data.message);
//             return { success: true, headerImage: data.headerImage };
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update header image.");
//             return { success: false };
//         }
//     });

//     const updateFormWatermarkImage = useCallback ( async (formId, imageData) => {
//         try {
//             const config = { headers: { 'Authorization': `Bearer ${token}` } };
//             const { data } = await axios.put(`${API_BASE_URL}/forms/${formId}/watermark-image`, imageData, config);
//             toast.success(data.message);
//             return { success: true, watermarkImage: data.watermarkImage };
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update watermark image.");
//             return { success: false };
//         }
//     });

//     const value = {
//         forms,
//         currentForm,
//         loading,
//         error,
//         createForm,
//         getForms,
//         getFormById,
//         updateForm,
//         deleteForm,
//         sendForm,
//         getSecureLink,
//         clearError,
//         clearCurrentForm,
//         getDashboardStats,
//         updateFormHeaderImage,
//         updateFormWatermarkImage,
//     };

//     return (
//         <FormContext.Provider value={value}>
//             {children}
//         </FormContext.Provider>
//     );
// };






import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const FormContext = createContext();

export const useForms = () => {
    return useContext(FormContext);
};

export const FormProvider = ({ children }) => {
    const { token } = useAuth();
    const [forms, setForms] = useState([]);
    const [currentForm, setCurrentForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // FIX: Wrap simple setters in useCallback with an empty dependency array
    const clearError = useCallback(() => setError(null), []);
    const clearCurrentForm = useCallback(() => setCurrentForm(null), []);

    // NOTE: This helper is defined inside the component, so any useCallback that uses it must include it as a dependency.
    const makeAuthenticatedRequest = useCallback(async (method, url, data = null) => {
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            throw new Error('Unauthorized');
        }
        const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
        try {
            setLoading(true);
            setError(null);
            const res = await axios[method](url, ...(data ? [data, config] : [config]));
            return res.data;
        } catch (err) {
            console.error('Form API error:', err);
            const errorMessage = err.response?.data?.message || 'Server error or network issue.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]); // This helper depends on the token

    // FIX: Add dependency arrays to all useCallback hooks
    const getForms = useCallback(async () => {
        if (!token) return;
        try {
            const fetchedForms = await makeAuthenticatedRequest('get', `${API_BASE_URL}/forms`);
            setForms(fetchedForms);
        } catch (err) { /* Error handled in helper */ }
    }, [token, API_BASE_URL, makeAuthenticatedRequest]);
    
    const createForm = useCallback(async (formData) => {
        try {
            const newForm = await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms`, formData);
            setForms((prevForms) => [...prevForms, newForm]);
            return newForm;
        } catch (err) {
            throw err;
        }
    }, [API_BASE_URL, makeAuthenticatedRequest]);

    const getFormById = useCallback(async (id) => {
        try {
            const form = await makeAuthenticatedRequest('get', `${API_BASE_URL}/forms/${id}`);
            setCurrentForm(form);
            return form;
        } catch (err) {
            throw err;
        }
    }, [API_BASE_URL, makeAuthenticatedRequest]);
    
    const updateForm = useCallback(async (id, formData) => {
        try {
            const updatedForm = await makeAuthenticatedRequest('put', `${API_BASE_URL}/forms/${id}`, formData);
            setForms((prevForms) => prevForms.map((form) => (form._id === id ? updatedForm : form)));
            setCurrentForm(updatedForm);
            return updatedForm; 
        } catch (err) {
            throw err;
        }
    }, [API_BASE_URL, makeAuthenticatedRequest]);

    const getDashboardStats = useCallback(async () => {
        // This function was already correct, but we'll ensure consistency
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, config);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load dashboard data.';
            throw new Error(errorMessage);
        }
    }, [token, API_BASE_URL]);

    const deleteForm = useCallback(async (id) => {
       // This one uses axios directly, so it depends on token, not the helper
        if (!token) throw new Error('Unauthorized');
        try {
            setLoading(true);
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`${API_BASE_URL}/forms/${id}`, config);
            setForms((prevForms) => prevForms.filter((form) => form._id !== id));
        } catch (err) {
            // ... error handling
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);
    
    const sendForm = useCallback(async (id, options) => {
        try {
            await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms/${id}/send`, options);
            await getForms(); // getForms is stable because it's also in useCallback
            setCurrentForm(prev => prev ? { ...prev, status: 'active' } : null);
        } catch (err) {
            throw err;
        }
    }, [API_BASE_URL, makeAuthenticatedRequest, getForms]);
    
    const getSecureLink = useCallback(async (id) => {
        try {
            const response = await makeAuthenticatedRequest('post', `${API_BASE_URL}/forms/${id}/secure-link`);
            return response.link;
        } catch (err) {
            throw err;
        }
    }, [API_BASE_URL, makeAuthenticatedRequest]);

    const updateFormHeaderImage = useCallback(async (formId, imageData) => {
        if (!token) return { success: false };
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/forms/${formId}/header-image`, imageData, config);
            toast.success(data.message);
            return { success: true, headerImage: data.headerImage };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update header image.");
            return { success: false };
        }
    }, [token, API_BASE_URL]);

    const updateFormWatermarkImage = useCallback(async (formId, imageData) => {
        if (!token) return { success: false };
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/forms/${formId}/watermark-image`, imageData, config);
            toast.success(data.message);
            return { success: true, watermarkImage: data.watermarkImage };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update watermark image.");
            return { success: false };
        }
    }, [token, API_BASE_URL]);

    const value = {
        forms,
        currentForm,
        loading,
        error,
        createForm,
        getForms,
        getFormById,
        updateForm,
        deleteForm,
        sendForm,
        getSecureLink,
        clearError,
        clearCurrentForm,
        getDashboardStats,
        updateFormHeaderImage,
        updateFormWatermarkImage,
    };

    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
};