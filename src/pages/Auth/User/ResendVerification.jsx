import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import mail from '../../../assets/mailcode.png';
import Header from '../../../components/Auth/Header';
import InputField from '../../../components/Auth/InputField';
import { useAuth } from '../../../context/AuthContext';

const ResendVerification = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { resendVerification, loading, error, clearError } = useAuth();

    useEffect(() => {
        if (error) {
            setFormError(error);
        }
        return () => clearError();
    }, [error, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitted(false);

        if (!email) {
            setFormError('Please enter your email address.');
            return;
        }

        try {
            const result = await resendVerification(email);
            if (result.success) {
                setIsSubmitted(true);
            } else {
                setFormError(result.message);
            }
        } catch (err) {
            setFormError('Failed to resend verification link. Please try again.');
        }
    };

    return (
        <>
            <Header page="resendVerification" setPage={setPage} />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12">
                    <div className="text-center">
                        <img src={mail} alt="Mail Icon" className='mx-auto w-24' />
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Resend Verification</h1>
                        <p className="text-gray-500 mt-2">
                            Enter the email you used to register and we'll send a new verification link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSubmitted ? (
                            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                                A new verification link has been sent to your email.
                            </div>
                        ) : (
                            <>
                                <InputField
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="e.g., you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {formError && (
                                    <div className="flex items-center text-sm text-red-500">
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        {formError}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Resend Verification Link'}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => setPage('signIn')}
                            className="w-full py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
                        >
                            Return to Sign In
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResendVerification;