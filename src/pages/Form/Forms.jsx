import React, { useState, useEffect } from 'react';
import { useForms } from '../../context/FormContext';
import { FiEye, FiSearch, FiDownload, FiMoreVertical } from 'react-icons/fi';
import { FaFileAlt, FaFileContract, FaFileSignature } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/NewForm/ConfirmationModal';
import { toast } from 'react-toastify';
import Spinner from '../../components/Common/Spinner';

const iconSearch = <FiSearch size={20} />;

const getFormIcon = (formName) => {
    if (formName.includes('Tax')) return <FaFileAlt size={20} className="text-yellow-500" />;
    if (formName.includes('Agreement')) return <FaFileContract size={20} className="text-blue-500" />;
    if (formName.includes('Authorization')) return <FaFileSignature size={20} className="text-green-500" />;
    return <FaFileAlt size={20} className="text-purple-500" />;
};

const getStatusClass = (status) => {
    switch (status) {
        case 'archived': return 'text-red-500 bg-red-100';
        case 'active': return 'text-green-500 bg-green-100';
        case 'draft': return 'text-blue-500 bg-blue-100';
        case 'paused': return 'text-orange-500 bg-orange-100';
        default: return 'text-gray-500 bg-gray-100';
    }
};

const Forms = () => {
    const { forms, getForms, loading: formsLoading, error: formsError, deleteForm } = useForms();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null); // This will store the full form object

    useEffect(() => {
        getForms();
    }, [getForms]);

    useEffect(() => {
        if (formsError) {
            toast.error(`Error fetching forms: ${formsError}`);
        }
    }, [formsError]);

    const filteredForms = Array.isArray(forms) ? forms.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.createdBy?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.createdBy?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const totalItems = filteredForms.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedForms = filteredForms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const confirmDelete = (form) => {
        setFormToDelete(form);
        setShowDeleteModal(true);
    };

// src/pages/Forms/Forms.jsx

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
    
    // Placeholder for download logic
    const handleDownloadForm = (formId, formName) => {
        toast.info(`Download for "${formName}" will be implemented soon.`);
        //console.log(`Placeholder: Download form with ID ${formId}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-7xl mx-auto">
            {/* Header with Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">All Forms</h1>
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                        {iconSearch}
                    </div>
                    <input
                        type="text"
                        placeholder="Search forms..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Forms Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">FORM NAME</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CREATED BY</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">CREATED AT</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">LAST MODIFIED</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedForms.length > 0 ? (
                            paginatedForms.map(form => (
                                <tr key={form._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">{getFormIcon(form.name)}</div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{form.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(form.status)}`}>{form.status}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.createdBy?.firstName || 'N/A'} {form.createdBy?.lastName || ''}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{new Date(form.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{new Date(form.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                            <button onClick={() => navigate(`/forms/edit/${form._id}`)} className="hover:text-gray-900 dark:hover:text-white transition-colors p-1" title="View/Edit Form"><FiEye size={20} /></button>
                                            <button onClick={() => handleDownloadForm(form._id, form.name)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1" title="Download Data"><FiDownload size={20} /></button>
                                            <button onClick={() => confirmDelete(form)} className="hover:text-red-700 dark:hover:text-red-400 transition-colors p-1" title="Delete Form"><FiMoreVertical size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                    {formsLoading ? "Loading forms..." : "No forms found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Showing {paginatedForms.length} of {totalItems}</div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                        {[...Array(totalPages).keys()].map(page => (
                            <button key={page + 1} onClick={() => handlePageChange(page + 1)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page + 1 ? 'z-10 bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                {page + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </button>
                    </nav>
                </div>
            )}

<ConfirmationModal
    show={showDeleteModal}
    title="Confirm Form Deletion"
    message={`Are you sure you want to delete the form "${formToDelete?.name}"? All of its submissions will also be permanently deleted.`}
    onConfirm={handleDeleteForm}
    onCancel={() => {
        if (isDeleting) return; 
        setShowDeleteModal(false);
    }}
    confirmText={isDeleting ? <Spinner /> : "Delete"}
    confirmDisabled={isDeleting}
/>
        </div>
    );
};

export default Forms;