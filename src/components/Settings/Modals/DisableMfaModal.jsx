import React from 'react';
import { useMfa } from '../../../context/MfaContext';

const DisableMfaModal = ({ onClose }) => { // ✨ FIX: No reauthToken prop needed
    const { disableMfa, isLoading } = useMfa();

    const handleConfirm = async (e) => {
        e.preventDefault();
        const result = await disableMfa(); // ✨ FIX: Call without parameters
        if (result.success) {
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <form onSubmit={handleConfirm}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Disable Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Are you sure you want to disable 2FA? This will reduce the security of your account.
                    </p>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                            {isLoading ? 'Disabling...' : 'Yes, Disable'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DisableMfaModal;