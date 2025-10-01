import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Switch } from '@headlessui/react';
import UpdatePasswordModal from '../Modals/UpdatePasswordModal';
import ChooseMfaMethodModal from '../Modals/ChooseMfaMethodModal';
import SetupAuthenticatorAppModal from '../Modals/SetupAuthenticatorAppModal';
import DisableMfaModal from '../Modals/DisableMfaModal';

const SecurityTab = () => {
    const { user, updatePersonalInfo } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [activeMfaModal, setActiveMfaModal] = useState(null);

    const handleMfaToggle = () => {
        if (user?.mfaEnabled) {
            setActiveMfaModal('disable');
        } else {
            setActiveMfaModal('choose');
        }
    };

    const handleCloseModal = () => {
        setActiveMfaModal(null);
    };

    const getMfaMethodName = (method) => {
        if (method === 'app') return 'Authenticator App';
        if (method === 'email') return 'In-App';
        return ''; 
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
                        <button 
                            onClick={() => setShowPasswordModal(true)} 
                            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Update
                        </button>
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
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium flex items-center">
                                Two-factor Authentication
                                {user?.mfaEnabled && (
                                    <span className="ml-2 text-xs font-normal bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                        {`${getMfaMethodName(user.mfaMethod)} Enabled`.trim()}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with an extra layer of protection.</p>
                        </div>
                        <Switch
                            checked={user?.mfaEnabled ?? false}
                            onChange={handleMfaToggle}
                            className={`${user?.mfaEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span className={`${user?.mfaEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </Switch>
                    </div>
                </div>
            </div>

            {showPasswordModal && <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />}
            
            {activeMfaModal === 'choose' && (
                <ChooseMfaMethodModal 
                    onClose={handleCloseModal}
                    onSelectAuthenticatorApp={() => setActiveMfaModal('setupAuthenticator')}
                
                />
            )}
            
            {activeMfaModal === 'setupAuthenticator' && (
                <SetupAuthenticatorAppModal onClose={handleCloseModal} />
            )}

            {activeMfaModal === 'disable' && (
                <DisableMfaModal onClose={handleCloseModal} />
            )}
        </>
    );
};

export default SecurityTab;