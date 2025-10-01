import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const VerifyLoginPage = () => {
    const { verifyMfa } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Determine the MFA method from either the URL (Google flow) or route state (Local flow)
    const mfaMethod = searchParams.get('method') || location.state?.mfaMethod;
    const mfaToken = searchParams.get('mfa_token'); // Only for Google flow

    useEffect(() => {
        if (!mfaMethod) {
            toast.error("MFA method not specified. Please try logging in again.");
            navigate('/signin', { replace: true });
        }
    }, [mfaMethod, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // The verifyMfa function in AuthContext already knows the email from the local login flow.
        // For Google flow, the backend's verifyMfa uses the mfa_token to find the user.
        // So, we just need to pass the code.
        const result = await verifyMfa(code, mfaToken); // We'll update verifyMfa to accept this

        if (result.success) {
            toast.success("Login successful!");
            navigate('/dashboard', { replace: true });
        } else {
            // Error is handled by the context hook, just stop loading
            setIsLoading(false);
            setCode('');
        }
    };

    const getInstructions = () => {
        if (mfaMethod === 'app') {
            return "Enter the 6-digit code from your authenticator app (e.g., Google Authenticator).";
        }
        if (mfaMethod === 'email') {
            return "We've sent a 6-digit code to your email address. Please enter it below.";
        }
        return "Please enter your verification code below.";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Two-Factor Authentication</h2>
                <p className="text-center text-sm text-gray-600">{getInstructions()}</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="mfa-code" className="sr-only">Authentication Code</label>
                        <input
                            id="mfa-code"
                            name="mfa-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            maxLength="6"
                            autoFocus
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || code.length < 6}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyLoginPage;