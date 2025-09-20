import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, File as FileIcon, Link as LinkIcon, Copy } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Switch } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useForms } from '../../context/FormContext';
import Spinner from '../Common/Spinner';

const SendFormModal = ({ show, onClose, formId, formName }) => {
    const { sendForm, getSecureLink } = useForms();
    const navigate = useNavigate();

    const [recipients, setRecipients] = useState([]);
    const [manualEmail, setManualEmail] = useState('');
    const [file, setFile] = useState(null);
    const [oneTimeUse, setOneTimeUse] = useState(false);
    const [smsCode, setSmsCode] = useState(false);
    const [emailAuth, setEmailAuth] = useState(false);
    const [dueDate, setDueDate] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [secureLink, setSecureLink] = useState('');

    const handleAddEmail = () => {
        if (manualEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manualEmail.trim())) {
            if (recipients.every(r => r.email !== manualEmail.trim())) {
                setRecipients(prev => [...prev, { email: manualEmail.trim(), name: '' }]);
                setManualEmail('');
            } else {
                toast.warn("Recipient email already added.");
            }
        } else {
            toast.error("Please enter a valid email address.");
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
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: ["email", "name"] });
                    const importedRecipients = json.map(row => ({
                        email: row.email?.toLowerCase().trim(),
                        name: row.name || ''
                    })).filter(r => r.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)); 

                    if (importedRecipients.length === 0) {
                        toast.error("No valid emails found in the file. Ensure the first column is 'email'.");
                        setFile(null);
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
        if (!formId) {
            toast.error("Form must be saved before generating a link.");
            return;
        }
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

        setIsSending(true);
        const options = { 
            recipients, 
            message: "You have been invited to fill out a form.",
            oneTimeUse, 
            smsCode, 
            emailAuth, 
            dueDate 
        };

        try {
            await sendForm(formId, options);
            toast.success('Form sent successfully!');
            onClose(); 
            navigate('/forms');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send form.');
        } finally {
            setIsSending(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]"> {/* Dark mode fix */}

                <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"> {/* Dark mode fix */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Share "{formName}"</h2> {/* Dark mode fix */}
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"> {/* Dark mode fix */}
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Invite via Email</h3> {/* Dark mode fix */}
                        <button 
                            onClick={handleGenerateLink}
                            disabled={isGeneratingLink}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center disabled:opacity-50" // Dark mode fix
                        >
                            <LinkIcon className="mr-1 h-4 w-4" />
                            {isGeneratingLink ? 'Generating...' : 'Get Secure Link'}
                        </button>
                    </div>

                    {secureLink && (
                        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center"> {/* Dark mode fix */}
                            <input type="text" readOnly value={secureLink} className="flex-grow bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"/> {/* Dark mode fix */}
                            <button onClick={handleCopyLink} className="ml-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"> {/* Dark mode fix */}
                                <Copy className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                    
                    <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Recipient's Email</label> {/* Dark mode fix */}
                         <div className="relative">
                            <input
                                type="email"
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                                className="w-full pl-4 pr-12 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors" // Dark mode fix
                                placeholder="example@company.com"
                            />
                            <button onClick={handleAddEmail} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"> {/* Dark mode fix */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12.75 12.75H16.5C16.9142 12.75 17.25 12.4142 17.25 12C17.25 11.5858 16.9142 11.25 16.5 11.25H12.75V7.5C12.75 7.08579 12.4142 6.75 12 6.75C11.5858 6.75 11.25 7.08579 11.25 7.5V11.25H7.5C7.08579 11.25 6.75 11.5858 6.75 12C6.75 12.4142 7.08579 12.75 7.5 12.75H11.25V16.5C11.25 16.9142 11.5858 17.25 12 17.25C12.4142 17.25 12.75 16.9142 12.75 16.5V12.75Z"></path></svg>
                            </button>
                        </div>
                    </div>

                    {recipients.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {recipients.map((r, index) => (
                                <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full pr-3 py-1 pl-1"> {/* Dark mode fix */}
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-1 text-xs">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.email}</span> {/* Dark mode fix */}
                                    <button onClick={() => handleRemoveRecipient(index)} className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"> {/* Dark mode fix */}
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Upload Recipient List (CSV/XLSX)</label> {/* Dark mode fix */}
                        <label className="flex items-center justify-center space-x-2 cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"> {/* Dark mode fix */}
                            <FileIcon size={20} className="text-gray-400 dark:text-gray-500" /> {/* Dark mode fix */}
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium"> {/* Dark mode fix */}
                                {file ? file.name : 'Click to browse or drag & drop'}
                            </span>
                            <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="space-y-4 border-t dark:border-gray-700 pt-4"> {/* Dark mode fix */}
                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">Security & Access Rules</h3> {/* Dark mode fix */}
                        <div className="flex justify-between items-center">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">One Time Use</label> {/* Dark mode fix */}
                            <Switch checked={oneTimeUse} onChange={setOneTimeUse} className={`${oneTimeUse ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${oneTimeUse ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">SMS Code</label> {/* Dark mode fix */}
                            <Switch checked={smsCode} onChange={setSmsCode} className={`${smsCode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${smsCode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-gray-700 dark:text-gray-300 font-medium">Email Authentication</label> {/* Dark mode fix */}
                            <Switch checked={emailAuth} onChange={setEmailAuth} className={`${emailAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}><span className={`${emailAuth ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} /></Switch>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Due Date</label> {/* Dark mode fix */}
                        <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} className="w-full mt-2 pl-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition-colors" placeholderText="Choose Date" /> {/* Dark mode fix */}
                    </div>

                </div>

                <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3"> {/* Dark mode fix */}
                    <button onClick={onClose} disabled={isSending} className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button> {/* Dark mode fix */}
                    <button onClick={handleSubmit} disabled={recipients.length === 0 || isSending} className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 dark:disabled:text-gray-400 transition-colors flex items-center justify-center w-36"> {/* Dark mode fix */}
                        {isSending ? <Spinner /> : <>Send Form</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendFormModal;