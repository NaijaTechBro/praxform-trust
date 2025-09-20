import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Header from '../../../components/Auth/Header';
import InputField from '../../../components/Auth/InputField';
import yellow from '../../../assets/yellow-padlock.png';
import { useAuth } from '../../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const ResetPassword = () => { // Removed setPage from props
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    
    const { resetToken } = useParams(); 
    const navigate = useNavigate(); // Initialize useNavigate

    const { resetPassword, loading, error, clearError } = useAuth();

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

        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setFormError('Password must be at least 8 characters long.');
            return;
        }

        // Use the correctly named parameter
        if (!resetToken) { 
            setFormError('Invalid or missing password reset token.');
            return;
        }

        try {
            // Pass the correctly named parameter to the auth context function
            const result = await resetPassword(resetToken, password); 
            if (result.success) {
                setIsSubmitted(true);
                // Optionally navigate to sign-in after a delay
                setTimeout(() => {
                    navigate('/signin'); 
                }, 2000); // Navigate after 2 seconds
            } else {
                setFormError(result.message);
            }
        } catch (err) {
            setFormError('Failed to reset password. Please try again.');
        }
    };

    return (
        <>
            {/* Pass navigate function to Header or remove the prop if not needed */}
            <Header page="resetPassword" setPage={(pageName) => navigate(`/${pageName}`)} /> 
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12">
                    <div className="text-center">
                        <img src={yellow} alt="Lock Icon" className='mx-auto w-24' />
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">Reset Password</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new, secure password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSubmitted ? (
                            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                                Password successfully reset! You can now sign in with your new password.
                            </div>
                        ) : (
                            <>
                                <InputField
                                    id="password"
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    iconRight={
                                        showPassword ?
                                            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> :
                                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                    }
                                />
                                <InputField
                                    id="confirmPassword"
                                    label="Confirm New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    iconRight={
                                        showPassword ?
                                            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> :
                                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                    }
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
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate('/signin')}
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

export default ResetPassword;
