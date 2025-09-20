import React, { useState, useEffect } from 'react';
import { FiX, FiLock, FiTrash, FiDownload, FiLink } from 'react-icons/fi';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSubmissions } from '../../context/SubmissionContext';
import { toast } from 'react-toastify';
import Spinner from '../Common/Spinner';

// Helper function to render each submitted field based on its type
const renderSubmittedField = (field, decryptedData, files = []) => {
    if (!field) return null;
    
    // Get the value from either decrypted data OR the files array
    const value = decryptedData[field.id];
    const fileInfo = field.type === 'file' ? files.find(f => f.fieldId === field.id) : null;

    // Don't render a field if it has no submitted value
    if (value === undefined && !fileInfo && !['layout-row', 'image'].includes(field.type)) {
        return null; 
    }

    const fieldWrapper = (content) => (
        <div key={field.id} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{field.label}</p>
            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 break-words">{content}</div>
        </div>
    );
    
    switch (field.type) {
        // This is for an image that is part of the form's design (display-only)
        case 'image':
            return fieldWrapper(<img src={field.url} alt={field.altText || 'Form Image'} className="max-w-sm h-auto rounded-md" />);
        
        // This is for a file UPLOADED by the user
        case 'file':
            if (!fileInfo || !fileInfo.url) {
                return fieldWrapper(<i className="text-gray-400">No file uploaded</i>);
            }
            // Check if the uploaded file is an image
            if (fileInfo.fileType && fileInfo.fileType.startsWith('image/')) {
                return fieldWrapper(<img src={fileInfo.url} alt={fileInfo.fileName} className="max-w-sm h-auto rounded-md mt-2 border border-gray-200 dark:border-gray-600" />);
            }
            // Otherwise, render a link to the file
            return fieldWrapper(
                <a href={fileInfo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                    <FiLink size={16} />
                    <span>{fileInfo.fileName || 'View File'}</span>
                </a>
            );

        case 'layout-row':
            return (
                <div key={field.id} className="py-4">
                    <p className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">{field.label}</p>
                    <div className="pl-4 border-l-2 border-blue-500 space-y-4">
                        {field.children.map(child => renderSubmittedField(child, decryptedData, files))}
                    </div>
                </div>
            );

        case 'checkbox':
            return fieldWrapper(value ? "Checked" : "Unchecked");

        case 'select':
        case 'radio-group':
            const selectedOption = (field.options || []).find(opt => opt.value === value);
            return fieldWrapper(selectedOption ? selectedOption.label : value);

        default:
            return fieldWrapper(value || <i className="text-gray-400">Not provided</i>);
    }
};

const SubmissionDetailModal = ({ submission, formFields, onClose, onSubmissionDeleted }) => {
    const { token } = useAuth();
    const { deleteSubmission, logSubmissionDownload } = useSubmissions();
    const [decryptedData, setDecryptedData] = useState(null);
    const [decryptionError, setDecryptionError] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchKeyAndDecrypt = async () => {
            if (!submission || !submission.form) {
                setDecryptionError('Could not find form ID for decryption.');
                setLoading(false);
                return;
            }
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const formResponse = await axios.get(`${API_BASE_URL}/forms/${submission.form}`, config);
                const formEncryptionKey = formResponse.data.encryptionKey;
                if (!formEncryptionKey) throw new Error('Form does not have an encryption key.');

                const encryptedString = submission.encryptedData?.data;
                if (!encryptedString) {
                    setDecryptedData({});
                    setLoading(false);
                    return;
                }
                const bytes = CryptoJS.AES.decrypt(encryptedString, formEncryptionKey);
                const originalData = bytes.toString(CryptoJS.enc.Utf8);
                if (!originalData) throw new Error('Failed to decrypt data. Key may be incorrect.');
                
                setDecryptedData(JSON.parse(originalData));
            } catch (err) {
                setDecryptionError(err.response?.data?.message || err.message || 'Failed to decrypt data.');
            } finally {
                setLoading(false);
            }
        };
        fetchKeyAndDecrypt();
    }, [submission, token, API_BASE_URL]);

    const handleConfirmDelete = async () => {
        if (window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
            try {
                await deleteSubmission(submission._id);
                toast.success('Submission deleted successfully!');
                onClose();
                if (onSubmissionDeleted) onSubmissionDeleted(submission._id);
            } catch (err) {
                toast.error(err.message || 'Failed to delete submission.');
            }
        }
    };

    const handleDownload = async () => {
        if (!decryptedData) {
            toast.error('No data to download.');
            return;
        }
        await logSubmissionDownload(submission._id);
        
        let content = `Submission Details for Form\n\n`;
        formFields.flat().forEach(field => {
            if (field.children) {
                field.children.forEach(child => {
                     const value = decryptedData[child.id];
                     if(value !== undefined) content += `${child.label}: ${value}\n`;
                });
            } else {
                const value = decryptedData[field.id];
                const fileValue = field.type === 'file' ? (submission.files || []).find(f => f.fieldId === field.id) : null;
                if (value !== undefined) {
                    content += `${field.label}: ${value}\n`;
                } else if (fileValue) {
                    content += `${field.label}: ${fileValue.fileName} (${fileValue.url})\n`;
                }
            }
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submission_${submission._id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Submission Details</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><FiX size={24} /></button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full"><Spinner /></div>
                    ) : decryptionError ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <FiLock size={32} className="mb-4" />
                            <p className="font-semibold">Decryption Failed</p>
                            <p className="text-sm">{decryptionError}</p>
                        </div>
                    ) : (
                        <div>
                           {formFields.map(field => renderSubmittedField(field, decryptedData, submission.files || []))}
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                    <button onClick={handleConfirmDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                        <FiTrash /> Delete
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <FiDownload /> Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;