import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const EnableInAppMfaModal = ({ onClose }) => {
    const { enableInAppMfa } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');

    const handleConfirm = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await enableInAppMfa({ password });
        if (result.success) {
            onClose();
        }
        setIsLoading(false);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <form onSubmit={handleConfirm}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enable In-App Authentication</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        On your next login, you will receive a unique 6-digit code to complete sign-in. Please enter your password to confirm this change.
                    </p>
                    
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        required
                        autoFocus
                    />

                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? 'Enabling...' : `Confirm & Enable`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnableInAppMfaModal;