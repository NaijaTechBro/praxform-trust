import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Link as LinkIcon, Copy, Calendar, Info, CheckCircle, AlertTriangle, Phone } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Switch } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useForms } from '../../context/FormContext';
import Spinner from '../Common/Spinner';
import Tooltip from '../Common/Tooltip';

const SparkleIcon = ({ isSpinning }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isSpinning ? 'animate-spin' : ''}>
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SendFormModal = ({ show, onClose, formId, formName }) => {
    const { sendForm, getSecureLink } = useForms();
    const navigate = useNavigate();

    const [recipients, setRecipients] = useState([]);
    const [manualEmail, setManualEmail] = useState('');
    const [manualPhone, setManualPhone] = useState('')
    const [file, setFile] = useState(null);
    const [oneTimeUse, setOneTimeUse] = useState(true);
    const [smsCode, setSmsCode] = useState(true);
    const [emailAuth, setEmailAuth] = useState(false);
    const [dueDate, setDueDate] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [secureLink, setSecureLink] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddRecipient = () => {
        const email = manualEmail.trim();
        const phone = manualPhone.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (recipients.every(r => r.email !== email)) {
            setRecipients(prev => [
                ...prev, 
                { 
                    email: email, 
                    name: email.split('@')[0], 
                    phone: phone || null // Add phone, default to null if empty
                }
            ]);
            setManualEmail('');
            setManualPhone(''); 
        } else {
            toast.warn("Recipient email already added.");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: ["email", "name", "phone"] });
                    const importedRecipients = json.map(row => ({
                        email: row.email?.toLowerCase().trim(),
                        name: row.name || row.email?.split('@')[0] || '',
                        phone: row.phone?.toString().trim() || null
                    })).filter(r => r.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email));

                    if (importedRecipients.length === 0) {
                        toast.error("No valid emails found in the file. Ensure the first column is 'email'.");
                        return;
                    }

                    let newRecipients = [];
                    setRecipients(prev => {
                        const currentEmails = new Set(prev.map(r => r.email));
                        newRecipients = importedRecipients.filter(r => !currentEmails.has(r.email));
                        return [...prev, ...newRecipients];
                    });
                    toast.success(`${newRecipients.length} new recipients imported successfully!`);
                } catch (error) {
                    toast.error("Failed to read the file. Please check the format.");
                } finally {
                    e.target.value = null;
                    setFile(null);
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleRemoveRecipient = (index) => {
        setRecipients(prev => prev.filter((_, i) => i !== index));
    };

    const handleGenerateLink = async () => {
        setIsGeneratingLink(true);
        try {
            const link = await getSecureLink(formId);
            setSecureLink(link);
            toast.success("Secure link generated!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate link.");
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(secureLink);
        toast.info("Link copied to clipboard!");
    };

    const handleSubmit = async () => {
        if (recipients.length === 0) {
            toast.error('Please add at least one recipient.');
            return;
        }
        if (smsCode && recipients.some(r => !r.phone)) {
            toast.error('SMS Code is enabled, but one or more recipients are missing a phone number.');
            return;
        }

        setIsSending(true);
        const options = { recipients, oneTimeUse, smsCode, emailAuth, dueDate };
        try {
            await sendForm(formId, options);
            setSubmissionStatus('success');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An unexpected error occurred.');
            setSubmissionStatus('error');
        } finally {
            setIsSending(false);
        }
    };
    
    const handleDone = () => {
        onClose();
        navigate('/forms');
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
                
                {submissionStatus === 'idle' && (
                    <>
                        <div className="flex-shrink-0 p-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Share "{formName}"</h2>
                            <div className="flex items-center space-x-4">
                                <button onClick={handleGenerateLink} disabled={isGeneratingLink} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center disabled:opacity-50">
                                    <LinkIcon className="mr-1.5 h-4 w-4" />
                                    {isGeneratingLink ? 'Generating...' : 'Get Secure Link'}
                                </button>
                                <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
                            {secureLink && (
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
                                    <input type="text" readOnly value={secureLink} className="flex-grow bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none" />
                                    <button onClick={handleCopyLink} className="ml-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipient's Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={manualEmail}
                                            onChange={(e) => setManualEmail(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
                                            className="w-full pl-4 pr-12 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors"
                                            placeholder="johndoe@gmail.com"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <SparkleIcon isSpinning={manualEmail.length > 0} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Recipient's Phone (Optional)
                                        <Tooltip content="Required if SMS Code is enabled. Use E.164 format (e.g., +14155552671).">
                                            <Info size={14} className="ml-1.5 text-gray-400 cursor-pointer inline" />
                                        </Tooltip>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={manualPhone}
                                            onChange={(e) => setManualPhone(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
                                            className="w-full pl-4 pr-12 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors"
                                            placeholder="+14155552671"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                    </div>
                                </div>
                                <label htmlFor="file-upload" className="cursor-pointer text-sm text-blue-600 hover:underline mt-2 inline-block">
                                    or upload a list (CSV/XLSX)
                                </label>
                                <input id="file-upload" type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileChange} />
                            </div>

                            {recipients.length > 0 && (
                                <div className="space-y-3">
                                    {recipients.map((r, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-semibold text-md">
                                                    {r.name ? r.name.charAt(0).toUpperCase() : r.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{r.email}</p>
                                                    {r.phone && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                                                            <Phone size={12} className="mr-1" /> {r.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveRecipient(index)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-5">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
        Add                         Security and Access Control
    </h3>
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-600 dark:text-gray-300 font-medium flex items-center">
                                        One Time Use
                                        <Tooltip content="Recipient can only open the link once.">
                                            <Info size={14} className="ml-1.5 text-gray-400 cursor-pointer" />
                                        </Tooltip>
                                    </label>
                                    <Switch checked={oneTimeUse} onChange={setOneTimeUse} className={`${oneTimeUse ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${oneTimeUse ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-600 dark:text-gray-300 font-medium">SMS Code</label>
                                    <Switch checked={smsCode} onChange={setSmsCode} className={`${smsCode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${smsCode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-600 dark:text-gray-300 font-medium">Email Authentication</label>
                                    <Switch checked={emailAuth} onChange={setEmailAuth} className={`${emailAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${emailAuth ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                                <div className="relative mt-2">
                                    <DatePicker
                                        selected={dueDate}
                                        onChange={(date) => setDueDate(date)}
                                        className="w-full pl-4 pr-10 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors"
                                        placeholderText="Choose Date"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Calendar size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                            <button onClick={onClose} disabled={isSending} className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleSubmit} disabled={recipients.length === 0 || isSending} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 dark:disabled:text-gray-400 transition-colors flex items-center justify-center w-36">
                                {isSending ? <Spinner /> : 'Send Form'}
                            </button>
                        </div>
                    </>
                )}

                {submissionStatus === 'success' && (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Form Sent!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Your form has been successfully sent to all recipients.</p>
                        <button onClick={handleDone} className="mt-6 w-full px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
                            Done
                        </button>
                    </div>
                )}
                
                {submissionStatus === 'error' && (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">An Error Occurred</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{errorMessage}</p>
                        <div className="mt-6 flex w-full space-x-4">
                            <button onClick={onClose} className="w-1/2 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">
                                Cancel
                            </button>
                            <button onClick={() => setSubmissionStatus('idle')} className="w-1/2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SendFormModal;