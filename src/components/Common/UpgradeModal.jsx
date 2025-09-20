import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiZap } from 'react-icons/fi';

const UpgradeModal = ({ show, onClose, featureName, limit }) => {
    const navigate = useNavigate();

    if (!show) return null;

    const handleUpgrade = () => {
        navigate('/settings/billing');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 relative text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Close"
                >
                    <FiX size={20} />
                </button>
                
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-400/20 mb-4">
                    <FiZap size={32} className="text-yellow-500 dark:text-yellow-400" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Upgrade to Create More {featureName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You've reached the limit of {limit} {featureName} on your current plan. Please upgrade your subscription to continue creating more.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                    >
                        <FiZap className="mr-2" />
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;