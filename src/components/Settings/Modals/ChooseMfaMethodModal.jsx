import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ChooseMfaMethodModal = ({ onSelectAuthenticatorApp, onSelectInApp, onClose }) => {
    const { user } = useAuth();
    const isSsoUser = user.authMethod === 'google' || user.authMethod === 'microsoft';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enable Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Choose your preferred method for the second factor.</p>
                
                <div className="mt-6 space-y-3">
                    <button 
                        onClick={onSelectAuthenticatorApp} 
                        className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Authenticator App</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Use an app like Google Authenticator or Authy.</p>
                    </button>
                    
                    <div className="relative">
                        {/* <button 
                            onClick={onSelectInApp}
                            disabled={isSsoUser}
                            className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">In-App Authentication</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive a unique code during login.</p>
                        </button> */}
                        {isSsoUser && (
                            <span className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                For password accounts only
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseMfaMethodModal;