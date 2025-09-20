import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrganization } from '../../context/OrganizationContext';

// Import the new tab components
import ProfileTab from '../../components/Settings/Tabs/ProfileTab';
import SecurityTab from '../../components/Settings/Tabs/SecurityTab';
import ApiKeysTab from '../../components/Settings/Tabs/ApiKeysTab';
import BillingTab from '../../components/Settings/Tabs/BillingTab';
import Spinner from '../../components/Common/Spinner';

const SettingsPage = () => {
    const { organization, loading: orgLoading } = useOrganization();
    const [searchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [searchParams, activeTab]);

    // --- The conflicting useEffect that checked location.pathname has been REMOVED ---

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab />;
            case 'security':
                return <SecurityTab />;
            case 'apiKeys':
                return <ApiKeysTab />;
            case 'billing':
                return <BillingTab />;
            default:
                // Fallback to profile tab if the URL param is invalid
                return <ProfileTab />;
        }
    };

    if (orgLoading && !organization) {
        return <div className="p-10 flex justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-sm mb-6">Manage your profile, security, and API settings.</p>

            <div className="mb-6 flex space-x-2">
                <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Profile</button>
                <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Security</button>
                <button onClick={() => setActiveTab('apiKeys')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'apiKeys' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>API & Webhooks</button>
                <button onClick={() => setActiveTab('billing')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'billing' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Billing & Plan</button>
            </div>

            {renderContent()}
        </div>
    );
};

export default SettingsPage;