import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import InputField from '../../../components/Auth/InputField';
import Header from '../../../components/Auth/Header';
import yellow from '../../../assets/yellow-padlock.png';


const ForgotPassword = () => { 
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const { forgotPassword, loading, error, clearError } = useAuth();
    const navigate = useNavigate(); 

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
            const result = await forgotPassword(email);
            if (result.success) {
                setIsSubmitted(true);
            } else {
                setFormError(result.message);
            }
        } catch (err) {
            setFormError('Failed to send reset link. Please try again.');
        }
    };
    
    return (
        <>
            {/* Pass navigate function to Header or remove the prop if not needed */}
            <Header page="forgotPassword" setPage={(pageName) => navigate(`/${pageName}`)} /> 
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    
                    <div className="text-center">
                        <img src={yellow} alt="Lock Icon" className='mx-auto w-24' />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Forgot Password?</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            No problem! Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSubmitted ? (
                            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                                A password reset link has been sent to your email.
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
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </>
                        )}
                        <button 
                            type="button"
                            onClick={() => navigate('/signin')} // Use navigate instead of setPage
                            className="w-full py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
                        >
                            <Link to="/signin">Return to Sign In</Link>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;