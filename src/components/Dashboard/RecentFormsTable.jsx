import React, { useState, useEffect } from 'react';
import { useForms } from '../../context/FormContext';
import { FiEye, FiDownload, FiMoreVertical } from 'react-icons/fi';
import { FaFileAlt, FaFileContract, FaFileSignature } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/NewForm/ConfirmationModal';
import Spinner from '../Common/Spinner';
import { toast } from 'react-toastify';

const iconEye = <FiEye size={20} />;
const iconDownload = <FiDownload size={20} />;
const iconDelete = <FiMoreVertical size={20} />;

const getFormIcon = (formName) => {
    if (formName.includes('Tax')) return <FaFileAlt size={20} className="text-yellow-500" />;
    if (formName.includes('Agreement')) return <FaFileContract size={20} className="text-blue-500" />;
    if (formName.includes('Authorization')) return <FaFileSignature size={20} className="text-green-500" />;
    return <FaFileAlt size={20} className="text-purple-500" />;
};

const getStatusClass = (status) => {
    switch (status) {
        case 'archived': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10';
        case 'active': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10';
        case 'draft': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10';
        case 'paused': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10';
        default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-400/10';
    }
};

const RecentFormsTable = ({ limit = 5 }) => {
    const { forms, getForms, deleteForm } = useForms();
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);

    useEffect(() => {
        getForms();
    }, [getForms]);

    const recentForms = Array.isArray(forms)
        ? forms
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit)
        : [];

    const handleEditForm = (formId) => {
        navigate(`/forms/edit/${formId}`);
    };

    const confirmDelete = (formId) => {
        const form = forms.find(f => f._id === formId);
        if (form) {
            setFormToDelete(form);
            setShowDeleteModal(true);
        } else {
            toast.error("Could not find the form to delete.");
        }
    };

const handleDeleteForm = async () => {
    if (!formToDelete) return;

    setIsDeleting(true);
    try {
        await deleteForm(formToDelete._id, formToDelete.name);
        toast.success(`Form "${formToDelete.name}" deleted successfully!`);
        
    } catch (err) {
        console.error('Failed to delete form:', err);
        toast.error(err.response?.data?.message || 'Failed to delete form.');
    } finally {
        setShowDeleteModal(false);
        setFormToDelete(null);
        setIsDeleting(false);
        getForms();
    }
};
    
    const handleDownloadForm = (formId, formName) => {
        toast.info(`Download for "${formName}" will be implemented soon.`);
        //console.log(`Placeholder: Download form with ID ${formId}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Forms</h2>
                <button
                    onClick={() => navigate('/forms')}
                    className="text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">FORM NAME</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CREATED BY</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CREATED AT</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentForms.length > 0 ? (
                            recentForms.map(form => (
                                <tr key={form._id} className="dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                                {getFormIcon(form.name)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{form.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(form.status)}`}>
                                            {form.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.createdBy?.firstName || 'N/A'} {form.createdBy?.lastName || ''}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(form.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditForm(form._id)}
                                                className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                title="View/Edit Form"
                                            >
                                                {iconEye}
                                            </button>
                                            <button
                                                onClick={() => handleDownloadForm(form._id, form.name)}
                                                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                                                title="Download Data"
                                            >
                                                {iconDownload}
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(form._id)}
                                                className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                                                title="Delete Form"
                                            >
                                                {iconDelete}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                    {"No recent forms found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
<ConfirmationModal
    show={showDeleteModal}
    title="Confirm Form Deletion"
    message={`Are you sure you want to delete the form "${formToDelete?.name}"? All of its submissions will also be permanently deleted.`}
    onConfirm={handleDeleteForm}
    onCancel={() => {
        if (isDeleting) return;
        setShowDeleteModal(false);
        setFormToDelete(null);
    }}
    confirmText={isDeleting ? <Spinner /> : "Delete"} 
    confirmDisabled={isDeleting} 
/>
        </div>
    );
};

export default RecentFormsTable;