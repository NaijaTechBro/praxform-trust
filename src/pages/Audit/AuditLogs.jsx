import React, { useState, useEffect } from 'react';
import { useAudit } from '../../context/AuditContext';
import { toast } from 'react-toastify';

// Inline SVG icons
const iconSearch = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const AuditLogs = () => {
    const { auditLogs, error, getAuditLogs } = useAudit();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (getAuditLogs) {
            getAuditLogs();
        }
    }, [getAuditLogs]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredLogs = auditLogs.filter(log =>
        (log.user?.firstName && log.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.user?.lastName && log.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.resourceType && log.resourceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const currentItems = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getActionClass = (action) => {
        if (action.includes('created')) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10';
        if (action.includes('deleted')) return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/10';
        if (action.includes('updated')) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-400/10';
        if (action.includes('login')) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10';
        if (action.includes('sent')) return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-400/10';
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-400/10';
    };

    const formatDetails = (log) => {
        if (!log.details) return 'N/A';
        const { action, details } = log;

        if (action.includes('login') || action.includes('password')) {
            if (details.ip) return `IP: ${details.ip}`;
            return 'Security action performed.';
        }
        if (action.includes('form.created')) {
            if (details.body?.name) return `New form created: "${details.body.name}"`;
            return 'Form created.';
        }
        if (action.includes('form.deleted')) {
            if (details.formName) return `Form deleted: "${details.formName}"`;
            if (details.name) return `Form deleted: "${details.name}"`;
            return 'A form was deleted.';
        }
        if (action.includes('form.updated')) {
            if (details.body?.name) return `Form updated: "${details.body.name}"`;
            return 'Form updated.';
        }
        if (action.includes('form.sent')) {
            if (details.body?.recipients) {
                const recipientCount = details.body.recipients.length;
                return `Form sent to ${recipientCount} recipient(s).`;
            }
            return 'Form sent to recipient(s).';
        }
    if (action.includes('form.link_generated')) {
            if (details.formName && details.generatedLink) {
                return `Link generated for "${details.formName}": ${details.generatedLink}`;
            }
            return 'A secure link was generated for a form.';
        }
      if (action.includes('submission.viewed')) {
    const subId = details.submissionId ? ` (ID: ${details.submissionId.slice(-8)})` : '';
    if (details.formName) return `Viewed sub${subId} for form: "${details.formName}"`;
    return 'Submission viewed.';
}
if (action.includes('submission.downloaded')) {
    const subId = details.submissionId ? ` (ID: ${details.submissionId.slice(-8)})` : '';
    if (details.formName) return `Downloaded sub${subId} for form: "${details.formName}"`;
    return 'Submission downloaded.';
}
if (action.includes('submission.deleted')) {
    const subId = details.submissionId ? ` (ID: ${details.submissionId.slice(-8)})` : '';
    if (details.formName) return `Deleted sub${subId} from form: "${details.formName}"`;
    return 'Submission deleted.';
}


        if (details.body && Object.keys(details.body).length > 0) return `Body: ${JSON.stringify(details.body).substring(0, 50)}...`;
        if (details.params && Object.keys(details.params).length > 0) return `Params: ${JSON.stringify(details.params)}`;
        return 'N/A';
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">Audit Logs</h1>
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                            {iconSearch}
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                {error ? (
                    <div className="text-center p-8 text-red-500">
                        Error: {error}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">TIMESTAMP</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">USER</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ACTION</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">RESOURCE TYPE</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentItems.map(log => (
                                        <tr key={log._id} className="dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(log.timestamp)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getActionClass(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                                {log.resourceType}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                <div className="max-w-xs truncate">{formatDetails(log)}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {currentItems.length} of {filteredLogs.length} results
                            </div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </button>
                                {[...Array(totalPages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        onClick={() => handlePageChange(page + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            currentPage === page + 1
                                                ? 'z-10 bg-blue-600 border-blue-600 text-white'
                                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AuditLogs;