import React, { useState, useEffect } from 'react';
import { useMfa } from '../../../context/MfaContext';

const SetupAuthenticatorAppModal = ({ onClose }) => {
    const { setupGoogleAuth, verifyGoogleAuth, isLoading } = useMfa();
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [mfaSecret, setMfaSecret] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [internalLoading, setInternalLoading] = useState(true);

    useEffect(() => {
        const fetchQrCode = async () => {
            setInternalLoading(true);
            const result = await setupGoogleAuth();
            if (result.success) {
                setQrCodeUrl(result.data.qrCodeUrl);
                setMfaSecret(result.data.secret);
            } else {
                onClose();
            }
            setInternalLoading(false);
        };

        fetchQrCode();
    }, []); // ✨ FIX: Use an empty dependency array to run only once on mount.

    const handleCopy = () => {
        navigator.clipboard.writeText(mfaSecret);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    const handleMfaVerifySubmit = async (e) => {
        e.preventDefault();
        await verifyGoogleAuth({ token: mfaToken });
    };
    
    // ... rest of the JSX is unchanged
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md">
                <form onSubmit={handleMfaVerifySubmit}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enable Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Scan the QR code, or copy the setup key into your authenticator app, then enter the generated code below.
                    </p>

                    <div className="flex flex-col items-center my-6">
                        {internalLoading ? (
                            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                                <p className="text-sm text-gray-500">Loading QR Code...</p>
                            </div>
                        ) : (
                            <img src={qrCodeUrl} alt="QR Code for MFA Setup" className="w-48 h-48" />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Or Copy Setup Key
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    readOnly
                                    value={mfaSecret}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    {isCopied ? (
                                        <span className="text-sm text-green-500">Copied!</span>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="auth-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Authentication Code
                            </label>
                            <input
                                id="auth-code"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength="6"
                                value={mfaToken}
                                onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-start space-x-4">
                        <button 
                            type="submit" 
                            disabled={isLoading || mfaToken.length < 6} 
                            className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Enable 2FA'}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetupAuthenticatorAppModal;