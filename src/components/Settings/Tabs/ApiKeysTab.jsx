import React, { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { useWebhooks } from '../../../context/WebhookContext';
import { toast } from 'react-toastify';
import { FiEyeOff, FiCopy, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import GenerateNewKeyModal from '../Modals/GenerateNewKeyModal';
import WebhookModal from '../Modals/WebHookModal';

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
                    {isSecret ? <FiEyeOff size={16} /> : <button onClick={handleCopy} disabled={!value || value === 'N/A'}><FiCopy size={16} /></button>}
                </div>
            </div>
        </div>
    );
};

const ApiKeysTab = () => {
    const { organization, updateOrganizationDetails, fetchOrganizationDetails } = useOrganization();
    const { getWebhooks, deleteWebhook } = useWebhooks();

    const [callbackUrl, setCallbackUrl] = useState('');
    const [webhooks, setWebhooks] = useState([]);
    const [editingWebhook, setEditingWebhook] = useState(null);
    const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
    const [showWebhookModal, setShowWebhookModal] = useState(false);

    const fetchAndSetWebhooks = useCallback(async () => {
        try {
            const data = await getWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks:", error);
        }
    }, [getWebhooks]);

    useEffect(() => {
        if (organization) {
            setCallbackUrl(organization.callbackUrl || '');
            fetchAndSetWebhooks();
        }
    }, [organization, fetchAndSetWebhooks]);

    const handleSaveChanges = async () => {
        const result = await updateOrganizationDetails({ callbackUrl });
        if (result.success) {
            toast.success("Callback URL saved successfully!");
        }
    };

    const handleKeyGenerationDone = async () => {
        setShowGenerateKeyModal(false);
        if (organization?._id) {
            await fetchOrganizationDetails(organization._id);
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

    return (
        <>
            <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">API Configuration - Live Mode</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <ApiDisplayField label="Live Public Key" value={organization?.apiKeys?.[0]?.publicKey} />
                            <ApiDisplayField label="Live Secret Key" value={organization?.apiKeys?.[0]?.secretKeyHash ? "••••••••••••••••••••••••" : "No key generated"} onGenerateKey={() => setShowGenerateKeyModal(true)} />
                            <div>
                                <label htmlFor="callbackUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Callback URL</label>
                                <input id="callbackUrl" type="url" value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300"/>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                            <button onClick={handleSaveChanges} className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">Save Changes</button>
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
                                <div key={wh._id} className="flex items-center justify-between p-3 border rounded-lg">
                                    {/* Webhook item JSX */}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed rounded-lg">
                                <p>You haven't added any webhook endpoints yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showGenerateKeyModal && <GenerateNewKeyModal onCancel={() => setShowGenerateKeyModal(false)} onDone={handleKeyGenerationDone} />}
            {showWebhookModal && <WebhookModal webhook={editingWebhook} onClose={() => setShowWebhookModal(false)} onSave={fetchAndSetWebhooks} />}
        </>
    );
};

export default ApiKeysTab;