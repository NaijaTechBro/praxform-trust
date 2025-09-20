
import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { toast } from 'react-toastify';
import { FiX, FiEye, FiEyeOff, FiAlertCircle, FiCopy } from 'react-icons/fi';
import key from '../../assets/red-alert.png'; // Make sure this path is correct

const GenerateNewKeyModal = ({ onDone, onCancel }) => {
    const { generateApiKey } = useOrganization();
    
    const [accountPassword, setAccountPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State to hold both new keys (public and secret)
    const [newKeys, setNewKeys] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await generateApiKey(accountPassword);
        if (result.success) {
            toast.success(result.message || 'New API keys generated!');
            // Store both keys from the successful result to trigger the view change
            setNewKeys({
                publicKey: result.publicKey,
                secretKey: result.secretKey,
            }); 
        }
        setIsSubmitting(false);
    };
    
    const handleCopy = (text, keyType) => {
        navigator.clipboard.writeText(text);
        toast.info(`${keyType} copied to clipboard!`);
    };

    // --- VIEW 2: Show the new keys after they've been generated ---
    if (newKeys) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">API Keys Generated Successfully</h2>
                    
                    <div className="flex items-start p-4 text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-400/10 rounded-lg mb-6">
                        <FiAlertCircle size={24} className="flex-shrink-0 mt-0.5 mr-3 text-yellow-500" />
                        <div>
                            <span className="font-semibold">Important:</span> This is the only time your secret key will be displayed. Please copy and store it in a secure location.
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Public Key</label>
                            <div className="relative mt-1">
                                <pre className="w-full p-3 bg-gray-100 dark:bg-gray-900 rounded-md font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">{newKeys.publicKey}</pre>
                                <button onClick={() => handleCopy(newKeys.publicKey, 'Public Key')} className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                                    <FiCopy />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
                            <div className="relative mt-1">
                                <pre className="w-full p-3 bg-gray-100 dark:bg-gray-900 rounded-md font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">{newKeys.secretKey}</pre>
                                <button onClick={() => handleCopy(newKeys.secretKey, 'Secret Key')} className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                                    <FiCopy />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={onDone} className="mt-8 w-full px-4 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                        Done
                    </button>
                </div>
            </div>
        )
    }

    // --- VIEW 1: The default modal asking for a password ---
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <FiX size={24} />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <img src={key} alt="Warning Icon" className="mb-4" width="80px" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Generate New Keys</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm with Account Password</label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={accountPassword}
                                onChange={(e) => setAccountPassword(e.target.value)}
                                className="w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md"
                                required
                                autoFocus
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-500">
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start p-4 text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-400/10 rounded-lg">
                        <FiAlertCircle size={18} className="flex-shrink-0 mt-0.5 mr-2" />
                        <span>This action will revoke your current secret key. You must update your applications with the new key.</span>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Generating...' : 'Generate New Key'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateNewKeyModal;