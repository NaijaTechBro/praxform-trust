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
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [searchParams, activeTab]);

    const handleTabClick = (tabName) => {
        // This creates a new URLSearchParams object to avoid direct mutation
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabName);
        setSearchParams(newParams);
    };

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
                return <ProfileTab />;
        }
    };

    if (orgLoading && !organization) {
        return <div className="p-10 flex justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage your profile, security, and API settings.</p>

            <div className="mb-6 flex space-x-2">
                <button onClick={() => handleTabClick('profile')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Profile</button>
                <button onClick={() => handleTabClick('security')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Security</button>
                <button onClick={() => handleTabClick('apiKeys')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'apiKeys' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>API & Webhooks</button>
                <button onClick={() => handleTabClick('billing')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'billing' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Billing & Plan</button>
            </div>

            {renderContent()}
        </div>
    );
};

export default SettingsPage;