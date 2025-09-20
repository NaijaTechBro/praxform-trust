
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { useWebhooks } from '../../context/WebhookContext';
import { usePayments } from '../../context/PaymentContext';
import { Switch } from '@headlessui/react';
import { FiEye, FiEyeOff, FiTrash2, FiEdit, FiPlus, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';


// Import all necessary modals
import UpdatePasswordModal from '../../components/Settings/UpdatePasswordModal';
import UpdatePersonalInfoModal from '../../components/Settings/UpdatePersonalInfoModal';
import UpdateOrganizationInfoModal from '../../components/Settings/UpdateOrganizationInfoModal';
import GenerateNewKeyModal from '../../components/Settings/GenerateNewKeyModal';
import WebhookModal from '../../components/Settings/WebHookModal';

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            {value && typeof value === 'string' && value.startsWith('http') ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 font-medium break-all">{value.replace(/(^\w+:|^)\/\//, '')}</a>
            ) : (
                <p className="text-gray-800 dark:text-gray-100 font-medium">{value || 'N/A'}</p>
            )}
        </div>
    </div>
);

const RoleBadge = ({ role }) => {
    const roleColors = {
        owner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
        admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
        manager: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
        viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const colorClass = roleColors[role] || roleColors.default;
    return <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${colorClass}`}>{role || 'N/A'}</span>;
};

const VerificationBadge = ({ status }) => {
    const statusColors = {
        verified: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
        conflict: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
        unverified: 'bg-orange-300 text-gray-800 dark:bg-orange-700 dark:text-gray-300',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const colorClass = statusColors[status] || statusColors.default;
    return <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${colorClass}`}>{status || 'N/A'}</span>;
};

const ApiDisplayField = ({ label, value, onGenerateKey }) => {
    const handleCopy = () => {
        if (value && value !== 'N/A' && !label.includes("Secret")) {
            navigator.clipboard.writeText(value);
            toast.info("Public Key copied to clipboard!");
        }
    };
    
    const isSecret = label.includes("Secret");

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                {isSecret && (
                    <button onClick={onGenerateKey} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400">
                        Generate New Key
                    </button>
                )}
            </div>
            <div className="relative">
                <div className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 font-mono text-sm flex items-center">
                    <span className="truncate">{value || 'N/A'}</span>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400">
                    {isSecret ? (
                        <FiEyeOff size={16} />
                    ) : (
                        <button onClick={handleCopy} disabled={!value || value === 'N/A'}>
                            <FiCopy size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" // <-- FIX IS HERE
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-credit-card"
    >
        <rect width="20" height="14" x="2" y="5" rx="2"/>
        <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
);
const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>;

const SettingsPage = () => {
    const { user, updatePersonalInfo, toggleMfa } = useAuth();
    const { organization, userRole, fetchOrganizationDetails, updateOrganizationDetails, loading: orgLoading } = useOrganization();
    const { getWebhooks, deleteWebhook } = useWebhooks();

      // Added: Hooks for payments and routing
    const { getCustomerPortal, loading: paymentLoading } = usePayments();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
    const [showOrgInfoModal, setShowOrgInfoModal] = useState(false);
    const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
    const [webhooks, setWebhooks] = useState([]);
    const [showWebhookModal, setShowWebhookModal] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState(null);
    const [callbackUrl, setCallbackUrl] = useState('');
    const [showMfaModal, setShowMfaModal] = useState(false);
    const [mfaPassword, setMfaPassword] = useState('');
    const [isMfaLoading, setIsMfaLoading] = useState(false);

     useEffect(() => {
        if (location.pathname.includes('/billing')) {
            setActiveTab('billing');
        } else {
            setActiveTab('profile');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (searchParams.get('success')) {
            toast.success('Your plan has been upgraded successfully!');
        
            if (organization?._id) {
                fetchOrganizationDetails(organization._id);
            }
            searchParams.delete('success');
            setSearchParams(searchParams, { replace: true });
        }
        if (searchParams.get('canceled')) {
            toast.info('Your checkout process was canceled.');
            searchParams.delete('canceled');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, fetchOrganizationDetails, organization?._id]);
    


    const fetchAndSetWebhooks = useCallback(async () => {
        try {
            const data = await getWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks:", error);
        }
    }, [getWebhooks]);
    
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

    useEffect(() => {
        if (organization) {
            setCallbackUrl(organization.callbackUrl || '');
            if (activeTab === 'apiKeys') {
                fetchAndSetWebhooks();
            }
        }
    }, [organization, activeTab, fetchAndSetWebhooks]);

    const handleSaveChanges = async () => {
        const result = await updateOrganizationDetails({ callbackUrl });
        if (result.success) {
            toast.success("Callback URL saved successfully!");
        }
    };

    const handleOpenWebhookModal = (webhook = null) => {
        setEditingWebhook(webhook);
        setShowWebhookModal(true);
    };

    const handleDeleteWebhook = async (id) => {
        if (window.confirm("Are you sure you want to delete this webhook?")) {
            await deleteWebhook(id);
            toast.success("Webhook deleted.");
            fetchAndSetWebhooks();
        }
    };

     // Added: Helper function for the Billing tab
    const handleManageSubscription = () => {
        getCustomerPortal();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Next billing date, we will remind you!.';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (orgLoading && !organization) {
        return <div className="p-6 md:p-10"><Spinner /></div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>
                                <button onClick={() => setShowPersonalInfoModal(true)} className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Update</button>
                            </div>
                            <div className="space-y-4">
                                <DetailRow label="First Name" value={user?.firstName} />
                                <DetailRow label="Last Name" value={user?.lastName} />
                                <DetailRow label="Email Address" value={user?.email} />
                                  <div className="flex items-center gap-3">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                         <RoleBadge role={userRole} />
                                   </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Organization Information</h3>
                                <button onClick={() => setShowOrgInfoModal(true)} className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Update</button>
                            </div>
                            <div className="space-y-4">
                                <DetailRow label="Organization Name" value={organization?.name} />
                                <DetailRow label="Organization Phone Number" value={organization?.phoneNumber} />
                                <DetailRow label="Organization Email Address" value={organization?.email} />
                                <DetailRow label="Organization Website" value={organization?.website} />
                                <div className="flex items-center gap-3">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Verification Status</p>
                                   <VerificationBadge status={organization?.verificationStatus} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
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
                );
            case 'apiKeys':
                return (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">API Configuration - Live Mode</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <ApiDisplayField 
                                        label="Live Public Key"
                                        value={organization?.apiKeys?.[0]?.publicKey}
                                        onGenerateKey={() => setShowGenerateKeyModal(true)}
                                    />
                                    <ApiDisplayField 
                                        label="Live Secret Key"
                                        value={organization?.apiKeys?.[0]?.secretKeyHash ? "••••••••••••••••••••••••" : "No key generated"}
                                        onGenerateKey={() => setShowGenerateKeyModal(true)}
                                    />
                                    <div>
                                        <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Callback URL</label>
                                        <input id="callbackUrl" type="url" value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300"/>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                                    <button onClick={handleSaveChanges} className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Webhook Endpoints</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of events in your application.</p>
                                </div>
                                <button onClick={() => handleOpenWebhookModal()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">
                                    <FiPlus size={16} /> Add Webhook
                                </button>
                            </div>
                            <div className="space-y-3">
                                {webhooks.length > 0 ? (
                                    webhooks.map(wh => (
                                        <div key={wh._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            <div>
                                                <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{wh.endpoint}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${wh.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                                    {wh.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleOpenWebhookModal(wh)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><FiEdit size={16} /></button>
                                                <button onClick={() => handleDeleteWebhook(wh._id)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><FiTrash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                        <p>You haven't added any webhook endpoints yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
             case 'billing':
                return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Billing & Plan</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your subscription and billing details.</p>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Plan</h2>
                                    <div className="mt-2 flex items-center">
                                        <span className="capitalize text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {organization?.plan || 'Starter'}
                                        </span>
                                        {organization?.subscriptionStatus === 'active' && (
                                            <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-400">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleManageSubscription}
                                    disabled={paymentLoading || !organization?.customerId}
                                    className="mt-4 sm:mt-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CardIcon />
                                    <span className="ml-2">{paymentLoading ? 'Redirecting...' : 'Manage Subscription'}</span>
                                </button>
                            </div>
                            {organization?.subscriptionStatus === 'active' && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Your plan will renew on <span className="font-semibold text-gray-900 dark:text-white">{formatDate(organization.currentPeriodEnd)}</span>.
                                    </p>
                                </div>
                            )}
                            {organization?.plan === 'starter' && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        You are currently on the free Starter plan. 
                                        <Link to="/pricing" className="ml-1 font-semibold text-blue-600 hover:underline">
                                            Upgrade your plan
                                        </Link>   to unlock more features.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            s
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage your profile, security, and API settings.</p>

            <div className="mb-6 flex space-x-2">
                <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    Profile
                </button>
                <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    Security
                </button>
                <button onClick={() => setActiveTab('apiKeys')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'apiKeys' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    API Keys & Webhooks
                </button>
                <button onClick={() => setActiveTab('billing')} className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'billing' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    Billing & Plan
                </button>
            </div>

            {renderContent()}

            {showPersonalInfoModal && <UpdatePersonalInfoModal onClose={() => setShowPersonalInfoModal(false)} />}
            {showOrgInfoModal && <UpdateOrganizationInfoModal onClose={() => setShowOrgInfoModal(false)} />}
            {showPasswordModal && <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />}
            {showGenerateKeyModal && (
                <GenerateNewKeyModal
                    onCancel={() => setShowGenerateKeyModal(false)}
                    onDone={() => {
                        setShowGenerateKeyModal(false);
                        if (organization?._id) {
                            fetchOrganizationDetails(organization._id);
                        }
                    }}
                />
            )}
            {showWebhookModal && (
                <WebhookModal
                    webhook={editingWebhook}
                    onClose={() => setShowWebhookModal(false)}
                    onSave={fetchAndSetWebhooks}
                />
            )}
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
                                <button
                                    type="button"
                                    onClick={() => setShowMfaModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isMfaLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isMfaLoading ? 'Confirming...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;


                                