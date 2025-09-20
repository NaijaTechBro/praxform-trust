import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Header from '../../../components/Auth/Header';
import InputField from '../../../components/Auth/InputField';
import PasswordCriteria from '../../../components/Auth/PasswordCriteria';
import yellow from '../../../assets/yellow-padlock.png';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { changePassword, loading, error, clearError } = useAuth();
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

        if (newPassword !== confirmNewPassword) {
            setFormError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setFormError('Password must be at least 8 characters long.');
            return;
        }

        try {
            const result = await changePassword(oldPassword, newPassword);
            if (result.success) {
                setIsSubmitted(true);
                // Optionally log out the user or navigate them to a success page
                setTimeout(() => {
                    navigate('/signin');
                }, 3000); // Navigate to sign-in after 3 seconds
            } else {
                setFormError(result.message);
            }
        } catch (err) {
            setFormError('Failed to change password. Please try again.');
        }
    };

    return (
        <>
            <Header setPage={(pageName) => navigate(`/${pageName}`)} />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <img src={yellow} alt="Lock Icon" className='mx-auto w-24' />
                        <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
                        <p className="mt-2 text-sm text-gray-600">Your new password must be different from previous ones.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSubmitted ? (
                            <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                                Password changed successfully! You can now sign in with your new password.
                            </div>
                        ) : (
                            <>
                                <InputField
                                    id="oldPassword"
                                    label="Old Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your current password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    iconRight={
                                        showPassword ?
                                            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> :
                                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                    }
                                />
                                <InputField
                                    id="newPassword"
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    iconRight={
                                        showPassword ?
                                            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> :
                                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                    }
                                />
                                <InputField
                                    id="confirmNewPassword"
                                    label="Confirm New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    iconRight={
                                        showPassword ?
                                            <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} /> :
                                            <Eye className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                                    }
                                />
                                <PasswordCriteria password={newPassword} />
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
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
                        >
                            Back to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;