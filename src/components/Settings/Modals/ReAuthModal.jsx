import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useMfa } from '../../../context/MfaContext';

const ReAuthModal = ({ onClose, onSuccess, pendingAction }) => {
    const { user } = useAuth();
    const { reauthenticateWithPassword, reauthenticateWithGoogle, isLoading } = useMfa();
    const [password, setPassword] = useState('');

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const result = await reauthenticateWithPassword(password);
        if (result.success) {
            onSuccess(result.reauthToken);
        }
    };

    const handleGoogleSubmit = () => {
        sessionStorage.setItem('pendingMfaAction', pendingAction);
        reauthenticateWithGoogle();
    };

    const isLocalUser = user?.authMethod === 'local';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Your Identity</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    For your security, please confirm your identity before making this change.
                </p>

                {isLocalUser ? (
                    <form onSubmit={handlePasswordSubmit}>
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
                                {isLoading ? 'Confirming...' : 'Confirm'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-6 flex flex-col items-center">
                        <button onClick={handleGoogleSubmit} className="px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-400 w-full">
                            Continue with Google
                        </button>
                         <button type="button" onClick={onClose} className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReAuthModal;