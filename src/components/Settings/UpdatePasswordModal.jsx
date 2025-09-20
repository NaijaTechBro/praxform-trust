import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import lock from '../../assets/lock.png';

const UpdatePasswordModal = ({ onClose }) => {
    // ... (rest of state and logic is unchanged) ...
    const { changePassword, loading } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }
        const result = await changePassword(oldPassword, newPassword);
        if (result && result.success) {
            toast.success('Password updated successfully!');
            onClose();
        } 
    };

    const getPasswordStrength = (password) => {
        if (!password) return '';
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        const isLongEnough = password.length >= 8;
        if (isLongEnough && hasNumber && hasSpecial) return 'Strong';
        if (isLongEnough) return 'Good';
        return 'Weak';
    };
    const passwordStrength = getPasswordStrength(newPassword);

    return (
        // Updated for dark mode
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                    <FiX size={24} />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Update Password</h2>
                    <img src={lock} alt="Lock Icon" className="mb-4" height="80px" width="80px" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input Fields - Updated for dark mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
                        <div className="relative mt-1">
                            <input type={showOldPassword ? 'text' : 'password'} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                            <span onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-500">{showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                        <div className="relative mt-1">
                            <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Min. 8 characters' className="w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                            <span onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-500">{showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <div className="relative mt-1">
                            <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Min. 8 characters' className="w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-500">{showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Password (Min. of 8 Characters)</p>
                        <div className="w-full h-1 mt-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div className={`h-1 rounded-full transition-all ${passwordStrength === 'Strong' ? 'w-full bg-green-500' : passwordStrength === 'Good' ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'}`}></div>
                        </div>
                        <p className={`mt-1 text-xs font-semibold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Good' ? 'text-yellow-500' : passwordStrength === 'Strong' ? 'text-green-500' : 'text-gray-500'}`}>
                            {newPassword && `Password Strength: ${passwordStrength}`}
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Updating...' : 'Update Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordModal;