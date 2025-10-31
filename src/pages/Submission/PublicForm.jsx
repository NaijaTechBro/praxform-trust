// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CryptoJS from 'crypto-js';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Spinner from '../../components/Common/Spinner';
// import { FiFile } from 'react-icons/fi';

// // A recursive function to render any field, including those nested in layout rows
// const renderField = (field, formData, handleChange, handleFileChange) => {
//     if (!field) return null;

//     const commonProps = {
//         id: field.id,
//         name: field.id,
//         required: field.isRequired,
//     };

//     // In-line Content Image (informational only, not an input)
//     if (field.type === 'image') {
//         return (
//             <div key={field.id}>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
//                 <img src={field.url} alt={field.altText || 'Form image'} className="max-w-md h-auto rounded-md border border-gray-200 dark:border-gray-700" />
//             </div>
//         );
//     }
    
//     // Layout Row (renders children recursively)
//     if (field.type === 'layout-row') {
//         const columnClass = `grid-cols-${field.columns || 2}`;
//         return (
//             <div key={field.id} className="p-4 border-t border-b border-gray-100 dark:border-gray-700 -mx-6 px-6">
//                 <label className="block text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">{field.label}</label>
//                 <div className={`grid ${columnClass} gap-6`}>
//                     {(field.children || []).map(child => renderField(child, formData, handleChange, handleFileChange))}
//                 </div>
//             </div>
//         );
//     }

//     // File Upload field
//     if (field.type === 'file') {
//         const fileInfo = formData[field.id];
//         return (
//              <div key={field.id}>
//                 <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     {field.label} {field.isRequired && <span className="text-red-500">*</span>}
//                 </label>
//                 <label htmlFor={field.id} className="cursor-pointer mt-2 flex items-center justify-center space-x-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                     <FiFile className="text-gray-500 dark:text-gray-400" />
//                     <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
//                         {fileInfo?.status === 'uploading' ? 'Uploading...' : (fileInfo?.fileName || field.placeholder || 'Choose a file')}
//                     </span>
//                 </label>
//                 <input id={field.id} name={field.id} type="file" className="hidden" onChange={handleFileChange} disabled={fileInfo?.status === 'uploading'} />
//             </div>
//         );
//     }

//     // All other standard field types
//     return (
//         <div key={field.id}>
//             <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 {field.label} {field.isRequired && <span className="text-red-500">*</span>}
//             </label>
//             {['text', 'email', 'number', 'ssn', 'date', 'tel'].includes(field.type) ? (
//                 <input {...commonProps} type={field.type} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
//             ) : field.type === 'textarea' ? (
//                 <textarea {...commonProps} placeholder={field.placeholder} rows={field.rows || 4} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
//             ) : field.type === 'select' ? (
//                 <select {...commonProps} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
//                     <option value="">{field.placeholder || 'Select an option'}</option>
//                     {(field.options || []).map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
//                 </select>
//             ) : field.type === 'checkbox' ? (
//                 <div className="flex items-center mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                     <input {...commonProps} type="checkbox" checked={!!formData[field.id]} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
//                     <label htmlFor={field.id} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{field.value || 'I agree'}</label>
//                 </div>
//             ) : field.type === 'radio-group' ? (
//                 <div className="space-y-3 mt-2">
//                     {(field.options || []).map((opt, i) => (
//                         <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                             <input {...commonProps} type="radio" id={`${field.id}-${i}`} value={opt.value} checked={formData[field.id] === opt.value} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
//                             <label htmlFor={`${field.id}-${i}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{opt.label}</label>
//                         </div>
//                     ))}
//                 </div>
//             ) : null}
//         </div>
//     );
// };

// const PublicForm = () => {
//     const { formId, accessCode } = useParams();
//     const [form, setForm] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [pageStep, setPageStep] = useState('loading');
//     const [verificationEmail, setVerificationEmail] = useState('');
//     const [verificationCode, setVerificationCode] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [organizationName, setOrganizationName] = useState('');
//     const API_BASE_URL = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const fetchFormOrStartVerification = async () => {
//             if (!formId || !accessCode) {
//                 setError('Invalid form URL.'); setPageStep('error'); setLoading(false); return;
//             }
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/submissions/${formId}/${accessCode}`);
//                 if (response.data.verificationRequired) {
//                     setVerificationEmail(response.data.recipientEmail);
//                     setPageStep('verifying');
//                 } else {
//                     setForm(response.data);
//                     setOrganizationName(response.data.organizationName);
//                     setPageStep('filling');
//                 }
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Failed to load form.');
//                 setPageStep('error');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchFormOrStartVerification();
//     }, [formId, accessCode, API_BASE_URL]);

//     const handleVerifyAccess = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             const payload = { formId, accessCode, verificationCode };
//             const response = await axios.post(`${API_BASE_URL}/submissions/verify-access`, payload);
//             setForm(response.data);
//             setOrganizationName(response.data.organizationName);
//             setPageStep('filling');
//             toast.success("Verification successful.");
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Verification failed.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         const requiredFields = form.fields.filter(field => field.isRequired);
//         if (requiredFields.some(field => !formData[field.id])) {
//             toast.error('Please fill out all required fields.');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const dataToEncrypt = {};
//             const filesForSubmission = [];

//             form.fields.flat().forEach(field => {
//                 if (field.children) {
//                     field.children.forEach(child => {
//                         const value = formData[child.id];
//                         if (child.type === 'file' && value && value.url) {
//                             filesForSubmission.push({ fieldId: child.id, ...value });
//                         } else if (value !== undefined) {
//                             dataToEncrypt[child.id] = value;
//                         }
//                     });
//                 } else {
//                     const value = formData[field.id];
//                     if (field.type === 'file' && value && value.url) {
//                         filesForSubmission.push({ fieldId: field.id, ...value });
//                     } else if (value !== undefined) {
//                         dataToEncrypt[field.id] = value;
//                     }
//                 }
//             });

//             const encryptedString = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), form.encryptionKey).toString();
            
//             const payload = { 
//                 formId, 
//                 accessCode, 
//                 encryptedData: { data: encryptedString },
//                 files: filesForSubmission
//             };
            
//             await axios.post(`${API_BASE_URL}/submissions`, payload);
//             setPageStep('success');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Submission failed.');
//             setIsSubmitting(false); // Ensure button is re-enabled on error
//         }
//     };
    
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//     };
    
//     const handleFileChange = async (e) => {
//         const { name: fieldId, files } = e.target;
//         const file = files[0];
//         if (!file) return;

//         setFormData(prev => ({ ...prev, [fieldId]: { name: file.name, status: 'uploading' } }));
        
//         try {
//             const sigResponse = await axios.post(`${API_BASE_URL}/uploads/public-signature`, {
//                 formId, accessCode, folder: `submissions/${formId}`
//             });
//             const sigData = sigResponse.data;

//             const uploadFormData = new FormData();
//             uploadFormData.append('file', file);
//             uploadFormData.append('api_key', sigData.apiKey);
//             uploadFormData.append('timestamp', sigData.timestamp);
//             uploadFormData.append('signature', sigData.signature);
//             uploadFormData.append('folder', sigData.folder);
//             uploadFormData.append('upload_preset', sigData.uploadPreset);
            
//             const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
//             const cloudinaryAxios = axios.create();
//             delete cloudinaryAxios.defaults.headers.common['Authorization'];
//             const cloudinaryResponse = await cloudinaryAxios.post(cloudinaryUrl, uploadFormData);
            
//             const fileData = {
//                 public_id: cloudinaryResponse.data.public_id,
//                 url: cloudinaryResponse.data.secure_url,
//                 fileName: file.name,
//                 fileSize: file.size,
//                 fileType: file.type,
//             };
//             setFormData(prev => ({ ...prev, [fieldId]: fileData }));
//             toast.success(`Uploaded ${file.name}`);
//         } catch (err) {
//             toast.error("File upload failed. Please try again.");
//             console.error("Upload Error:", err.response?.data || err);
//             setFormData(prev => ({ ...prev, [fieldId]: null }));
//         }
//     };

//     if (loading || pageStep === 'loading') {
//         return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;
//     }

//     if (pageStep === 'error') {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//                 <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//                     <h2 className="text-xl font-bold text-red-500 mb-4">Access Denied</h2>
//                     <p className="text-gray-600 dark:text-gray-300">{error}</p>
//                 </div>
//             </div>
//         );
//     }
    
//     if (pageStep === 'success') {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//                 <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//                     <h2 className="text-2xl font-bold text-green-500 mb-4">Success!</h2>
//                     <p className="text-gray-600 dark:text-gray-300">Your form has been submitted. Thank you.</p>
//                 </div>
//             </div>
//         );
//     }
    
//     if (pageStep === 'verifying') {
//         return (
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
//                 <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
//                     <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Verification Required</h1>
//                     <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
//                         To view this secure form, please enter the 6-digit code sent to <span className="font-bold text-gray-800 dark:text-gray-200">{verificationEmail}</span>.
//                     </p>
//                     <form onSubmit={handleVerifyAccess}>
//                         <input
//                             type="text" value={verificationCode}
//                             onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
//                             maxLength="6" placeholder="______"
//                             className="w-full text-center text-3xl tracking-[1rem] font-mono p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
//                             required
//                         />
//                         <button type="submit" disabled={isSubmitting} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
//                             {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
    
//     if (pageStep === 'filling' && form) {
//         return (
//             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
//                 <div className="watermark-container" data-watermark-text={organizationName}></div>
//                 <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl z-10">
//                     {form.headerImage?.url && (
//                         <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex justify-center">
//                             <img src={form.headerImage.url} alt="Form Header" className="max-w-xs max-h-24 h-auto object-contain" />
//                         </div>
//                     )}
//                     <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">{form.name}</h1>
//                     <p className="text-gray-600 dark:text-gray-400 text-center mb-8">{form.description}</p>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {form.fields.map(field => renderField(field, formData, handleChange, handleFileChange))}
//                         <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
//                             {isSubmitting ? 'Submitting...' : 'Submit Form'}
//                         </button>
//                     </form>
//                 </div>
//                 <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 z-10">Powered by PraxForm</footer>
//                 <style>{`
//                     .watermark-container::before {
//                         content: attr(data-watermark-text);
//                         position: absolute; top: 50%; left: 50%;
//                         transform: translate(-50%, -50%) rotate(-45deg);
//                         font-size: 10vw; font-weight: bold;
//                         color: rgba(0, 0, 0, 0.05);
//                         white-space: nowrap; pointer-events: none; z-index: 5;
//                     }
//                     .dark .watermark-container::before { color: rgba(255, 255, 255, 0.05); }
//                 `}</style>
//             </div>
//         );
//     }
// };

// export default PublicForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Common/Spinner';
import { FiFile } from 'react-icons/fi';
import SignaturePad from '../../components/NewForm/SignaturePad';

const renderField = (field, formData, handleChange, handleFileChange, handleSignatureChange) => {
    if (!field) return null;

    const commonProps = {
        id: field.id,
        name: field.id,
        required: field.isRequired,
    };

    // Handle display-only components first
    if (field.type === 'image') {
        return (
            <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <img src={field.url} alt={field.altText || 'Form image'} className="max-w-md h-auto rounded-md border border-gray-200 dark:border-gray-700" />
            </div>
        );
    }
    
    if (field.type === 'embed' && field.url) {
        return (
            <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <iframe
                    src={field.url}
                    className="w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={field.label || 'Embedded Content'}
                ></iframe>
            </div>
        )
    }

    if (field.type === 'layout-row') {
        const columnClass = `grid-cols-${field.columns || 2}`;
        return (
            <div key={field.id} className="p-4 border-t border-b border-gray-100 dark:border-gray-700 -mx-6 px-6">
                <label className="block text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">{field.label}</label>
                <div className={`grid ${columnClass} gap-6`}>
                    {(field.children || []).map(child => renderField(child, formData, handleChange, handleFileChange, handleSignatureChange))}
                </div>
            </div>
        );
    }

    // This return block handles all user-input fields
    return (
        <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
            </label>
            {(() => {
                const fileInfo = formData[field.id];
                switch (field.type) {
                    case 'file':
                        return (
                            <>
                                <label htmlFor={field.id} className="cursor-pointer mt-2 flex items-center justify-center space-x-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <FiFile className="text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        {fileInfo?.status === 'uploading' ? 'Uploading...' : (fileInfo?.fileName || field.placeholder || 'Choose a file')}
                                    </span>
                                </label>
                                <input id={field.id} name={field.id} type="file" className="hidden" onChange={handleFileChange} disabled={fileInfo?.status === 'uploading'} />
                            </>
                        );
                    case 'signature':
                        return <SignaturePad onChange={(dataUrl) => handleSignatureChange(field.id, dataUrl)} />;
                    case 'textarea':
                        return <textarea {...commonProps} placeholder={field.placeholder} rows={field.rows || 4} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />;
                    case 'select':
                        return (
                            <select {...commonProps} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                <option value="">{field.placeholder || 'Select an option'}</option>
                                {(field.options || []).map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                            </select>
                        );
                    case 'checkbox':
                        return (
                            <div className="flex items-center mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <input {...commonProps} type="checkbox" checked={!!formData[field.id]} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <label htmlFor={field.id} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{field.value || 'I agree'}</label>
                            </div>
                        );
                    case 'radio-group':
                        return (
                            <div className="space-y-3 mt-2">
                                {(field.options || []).map((opt, i) => (
                                    <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <input {...commonProps} type="radio" id={`${field.id}-${i}`} value={opt.value} checked={formData[field.id] === opt.value} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <label htmlFor={`${field.id}-${i}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{opt.label}</label>
                                    </div>
                                ))}
                            </div>
                        );
                    default: // Covers text, email, number, ssn, date, tel, etc.
                        return <input {...commonProps} type={field.type} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />;
                }
            })()}
        </div>
    );
};


const PublicForm = () => {
    const { formId, accessCode } = useParams();
    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState({});
    const [pageStep, setPageStep] = useState('loading');
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [organizationName, setOrganizationName] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFormOrStartVerification = async () => {
            if (!formId || !accessCode) {
                setError('Invalid form URL.'); setPageStep('error'); setLoading(false); return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/submissions/${formId}/${accessCode}`);
                if (response.data.verificationRequired) {
                    setVerificationEmail(response.data.recipientEmail);
                    setPageStep('verifying');
                } else {
                    setForm(response.data);
                    setOrganizationName(response.data.organizationName);
                    setPageStep('filling');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load form.');
                setPageStep('error');
            } finally {
                setLoading(false);
            }
        };
        fetchFormOrStartVerification();
    }, [formId, accessCode, API_BASE_URL]);

    const handleVerifyAccess = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { formId, accessCode, verificationCode };
            const response = await axios.post(`${API_BASE_URL}/submissions/verify-access`, payload);
            setForm(response.data);
            setOrganizationName(response.data.organizationName);
            setPageStep('filling');
            toast.success("Verification successful.");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const requiredFields = form.fields.flat().reduce((acc, field) => {
            if (field.children) return [...acc, ...field.children.filter(child => child.isRequired)];
            if (field.isRequired) return [...acc, field];
            return acc;
        }, []);

        if (requiredFields.some(field => !formData[field.id])) {
            toast.error('Please fill out all required fields.');
            setIsSubmitting(false);
            return;
        }

        try {
            const dataToEncrypt = {};
            const filesForSubmission = [];

            const processField = (field) => {
                const value = formData[field.id];
                if (field.type === 'file' && value && value.url) {
                    filesForSubmission.push({ fieldId: field.id, ...value });
                } else if (field.type === 'signature' && value) {
                    dataToEncrypt[field.id] = value;
                } else if (value !== undefined && field.type !== 'file') {
                    dataToEncrypt[field.id] = value;
                }
            };

            form.fields.forEach(field => {
                if (field.children) {
                    field.children.forEach(processField);
                } else {
                    processField(field);
                }
            });

            const encryptedString = CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), form.encryptionKey).toString();
            
            const payload = { 
                formId, 
                accessCode, 
                encryptedData: { data: encryptedString },
                files: filesForSubmission
            };
            
            await axios.post(`${API_BASE_URL}/submissions`, payload);
            setPageStep('success');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed.');
            setIsSubmitting(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSignatureChange = (fieldId, dataUrl) => {
        setFormData(prev => ({ ...prev, [fieldId]: dataUrl }));
    };
    
    const handleFileChange = async (e) => {
        const { name: fieldId, files } = e.target;
        const file = files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, [fieldId]: { name: file.name, status: 'uploading' } }));
        
        try {
            const sigResponse = await axios.post(`${API_BASE_URL}/uploads/public-signature`, {
                formId, accessCode, folder: `submissions/${formId}`
            });
            const sigData = sigResponse.data;

            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('api_key', sigData.apiKey);
            uploadFormData.append('timestamp', sigData.timestamp);
            uploadFormData.append('signature', sigData.signature);
            uploadFormData.append('folder', sigData.folder);
            uploadFormData.append('upload_preset', sigData.uploadPreset);
            
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
            const cloudinaryAxios = axios.create();
            delete cloudinaryAxios.defaults.headers.common['Authorization'];
            const cloudinaryResponse = await cloudinaryAxios.post(cloudinaryUrl, uploadFormData);
            
            const fileData = {
                public_id: cloudinaryResponse.data.public_id,
                url: cloudinaryResponse.data.secure_url,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            };
            setFormData(prev => ({ ...prev, [fieldId]: fileData }));
            toast.success(`Uploaded ${file.name}`);
        } catch (err) {
            toast.error("File upload failed. Please try again.");
            console.error("Upload Error:", err.response?.data || err);
            setFormData(prev => ({ ...prev, [fieldId]: null }));
        }
    };

    if (loading || pageStep === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;
    }

    if (pageStep === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-300">{error}</p>
                </div>
            </div>
        );
    }
    
    if (pageStep === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-green-500 mb-4">Success!</h2>
                    <p className="text-gray-600 dark:text-gray-300">Your form has been submitted. Thank you.</p>
                </div>
            </div>
        );
    }
    
    if (pageStep === 'verifying') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Verification Required</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                        To view this secure form, please enter the 6-digit code sent to <span className="font-bold text-gray-800 dark:text-gray-200">{verificationEmail}</span>.
                    </p>
                    <form onSubmit={handleVerifyAccess}>
                        <input
                            type="text" value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength="6" placeholder="______"
                            className="w-full text-center text-3xl tracking-[1rem] font-mono p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                            required
                        />
                        <button type="submit" disabled={isSubmitting} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                            {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    
    if (pageStep === 'filling' && form) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                <div className="watermark-container" data-watermark-text={organizationName}></div>
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl z-10">
                    {form.headerImage?.url && (
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                            <img src={form.headerImage.url} alt="Form Header" className="max-w-xs max-h-24 h-auto object-contain" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">{form.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8">{form.description}</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {form.fields.map(field => renderField(field, formData, handleChange, handleFileChange, handleSignatureChange))}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
                            {isSubmitting ? 'Submitting...' : 'Submit Form'}
                        </button>
                    </form>
                </div>
                <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 z-10">Powered by PraxForm</footer>
                <style>{`
                    .watermark-container::before {
                        content: attr(data-watermark-text);
                        position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 10vw; font-weight: bold;
                        color: rgba(0, 0, 0, 0.05);
                        white-space: nowrap; pointer-events: none; z-index: 5;
                    }
                    .dark .watermark-container::before { color: rgba(255, 255, 255, 0.05); }
                `}</style>
            </div>
        );
    }
};

export default PublicForm;