import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../components/Auth/InputField';
import Header from '../../../components/Auth/Header';

// --- Helper function to mask the email address ---
const maskEmail = (email) => {
    if (!email || email.indexOf('@') === -1) {
        return "your email"; // Fallback for invalid or missing email
    }
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
        return `${localPart[0]}*@${domain}`;
    }
    const maskedLocalPart = localPart.substring(0, 2) + '****';
    return `${maskedLocalPart}@${domain}`;
};


const LoginCode = () => {
    const [code, setCode] = useState('');
    const [localError, setLocalError] = useState('');
    
    const { verifyMfa, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("An error occurred. Please try signing in again.");
            navigate('/signin');
        }
    }, [email, navigate]);

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
            setLocalError('Please enter the 6-digit code from your email.');
            return;
        }
        
        const result = await verifyMfa(email, code);
        
        if (result.success) {
            toast.success("Successfully verified! You are now logged in.");
            navigate('/dashboard'); 
        } else {
            setLocalError(result.message || 'Failed to verify code.');
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {/* --- FIX: Use the maskEmail function here --- */}
                            We've sent a 6-digit login code to <strong>{maskEmail(email)}</strong>.
                        </p>
                    </div>
                    
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <InputField 
                            id="code" 
                            label="Verification Code" 
                            type="text" 
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength="6"
                        />
                        
                        {localError && (
                            <p className="text-red-500 text-sm">{localError}</p>
                        )}
                        
                        <button 
                            type="submit"
                            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>

                    <div className="text-center">
                         <button onClick={() => navigate('/signin')} className="font-semibold text-sm text-blue-600 hover:underline">
                              &larr; Back to Sign In
                         </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginCode;