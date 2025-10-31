import React, { useState, useEffect } from 'react';
import { useForms } from '../../context/FormContext';
import { useSubmissions } from '../../context/SubmissionContext';
import { toast } from 'react-toastify';
import SubmissionDetailModal from '../../components/Submission/SubmissionDetailModal';

const iconBackArrow = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const iconFile = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

const Submissions = () => {
    const { forms, getForms, error: formsError } = useForms();
    const { getSubmissionsByFormId, deleteSubmission, logSubmissionView, loading: submissionsLoading } = useSubmissions();
    const [selectedForm, setSelectedForm] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [submissionToView, setSubmissionToView] = useState(null);
    const [submissionToDelete, setSubmissionToDelete] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Color classes for form icons
    const formIconColors = [
        'bg-blue-100 text-blue-500 dark:bg-blue-900/40 dark:text-blue-400',
        'bg-green-100 text-green-500 dark:bg-green-900/40 dark:text-green-400',
        'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/40 dark:text-yellow-400',
        'bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400',
        'bg-purple-100 text-purple-500 dark:bg-purple-900/40 dark:text-purple-400',
    ];

    useEffect(() => {
        getForms();
    }, [getForms]);

    useEffect(() => {
        if (formsError) {
            toast.error(formsError);
        }
    }, [formsError]);

    const handleFormClick = async (form) => {
        setSelectedForm(form);
        try {
            const fetchedSubmissions = await getSubmissionsByFormId(form._id);
            setSubmissions(fetchedSubmissions);
        } catch (err) {
            toast.error(err.message);
            setSubmissions([]); // Clear submissions on error
        }
    };

     const handleViewSubmission = async (submission) => {
        try {
            await logSubmissionView(submission._id);
            setSubmissionToView(submission);
            setShowDetailModal(true);
        } catch (err) {
            toast.error("Could not log view action.");
        }
    };

    const handleDeleteClick = (submission) => {
        setSubmissionToDelete(submission);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!submissionToDelete) return;
        try {
            await deleteSubmission(submissionToDelete._id);
            toast.success("Submission deleted successfully!");
            setSubmissions(prev => prev.filter(sub => sub._id !== submissionToDelete._id));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setShowDeleteModal(false);
            setSubmissionToDelete(null);
        }
    };

    const handleDownload = () => {
       // console.log("Downloading submission data...");
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'complete': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400';
            case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400';
            case 'flagged': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
            case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div>
            {!selectedForm ? (
                // View 1: List of Forms
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Submissions</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Select a form to view its submissions.</p>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">FORM NAME</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SUBMISSIONS</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DATE CREATED</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {forms.map((form, index) => (
                                        <tr key={form._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg ${formIconColors[index % formIconColors.length]}`}>
                                                        {iconFile}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{form.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{form.submissionCount || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(form.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleFormClick(form)} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                                                    View &rarr;
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // View 2: List of Submissions for a Selected Form
                <div>
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <button onClick={() => setSelectedForm(null)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 mr-4 transition-colors" title="Back to forms list">
                            {iconBackArrow}
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Submissions for "{selectedForm.name}"</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Review individual entries for the selected form.</p>
                        </div>
                    </div>
                    {submissionsLoading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 p-6">Loading submissions...</div>
                    ) : submissions.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SUBMISSION ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">RECIPIENT EMAIL</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">DATE SUBMITTED</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {submissions.map(sub => (
                                            <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-mono">{sub._id.slice(-8)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sub.recipientEmail}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(sub.createdAt).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusStyle(sub.status)}`}>{sub.status}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => handleViewSubmission(sub)} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">View &rarr;</button>
                                                    <button onClick={() => handleDeleteClick(sub)} className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                            <p className="text-lg text-gray-500 dark:text-gray-400">No submissions found for this form.</p>
                        </div>
                    )}
                </div>
            )}
             {showDetailModal && (
                    <SubmissionDetailModal
                        submission={submissionToView}
                        formFields={selectedForm?.fields || []}
                        onClose={() => setShowDetailModal(false)}
                        onDownload={handleDownload}
                        onDelete={() => {
                            setShowDetailModal(false);
                            handleDeleteClick(submissionToView);
                        }}
                    />
                )}
            {showDeleteModal && (
                // Delete confirmation modal - Updated for dark mode
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this submission? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Submissions;