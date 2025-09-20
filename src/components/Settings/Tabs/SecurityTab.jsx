import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Switch } from '@headlessui/react';
import UpdatePasswordModal from '../Modals/UpdatePasswordModal';

const SecurityTab = () => {
    const { user, toggleMfa, updatePersonalInfo } = useAuth();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showMfaModal, setShowMfaModal] = useState(false);
    const [mfaPassword, setMfaPassword] = useState('');
    const [isMfaLoading, setIsMfaLoading] = useState(false);

    const handleMfaToggleClick = () => {
        setShowMfaModal(true);
    };

    const handleMfaConfirm = async (e) => {
        e.preventDefault();
        setIsMfaLoading(true);
        const newMfaStatus = !user.mfaEnabled;
        const result = await toggleMfa(newMfaStatus, mfaPassword);
        if (result.success) {
            setShowMfaModal(false);
        }
        setMfaPassword('');
        setIsMfaLoading(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Security</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your existing password</p>
                        </div>
                        <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Update</button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get alerted immediately we push updates.</p>
                        </div>
                        <Switch
                            checked={user?.preferences?.notifications?.push ?? true}
                            onChange={(checked) => updatePersonalInfo({ preferences: { notifications: { push: checked } } })}
                            className={`${user?.preferences?.notifications?.push ?? true ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className={`${user?.preferences?.notifications?.push ?? true ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
                        </Switch>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Two-factor Auth</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with an extra layer of protection.</p>
                        </div>
                        <Switch
                            checked={user?.mfaEnabled ?? false}
                            onChange={handleMfaToggleClick}
                            className={`${user?.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span className={`${user?.mfaEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </Switch>
                    </div>
                </div>
            </div>

            {showPasswordModal && <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />}
            {showMfaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Your Identity</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            For your security, please enter your password to {user?.mfaEnabled ? 'disable' : 'enable'} 2FA.
                        </p>
                        <form onSubmit={handleMfaConfirm}>
                            <input
                                type="password"
                                value={mfaPassword}
                                onChange={(e) => setMfaPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                                autoFocus
                            />
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => setShowMfaModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</button>
                                <button type="submit" disabled={isMfaLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                                    {isMfaLoading ? 'Confirming...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SecurityTab;