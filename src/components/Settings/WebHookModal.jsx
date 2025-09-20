import React, { useState, useEffect } from 'react';
import { useWebhooks } from '../../context/WebhookContext';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Spinner from '../Common/Spinner';

const AVAILABLE_EVENTS = [
    'form.created', 'form.updated', 'form.deleted', 'organization.updated', 'organization.api_keys_regenerated','submission.created', 'payment.successful', 'payment.failed'
];

const WebhookModal = ({ webhook, onClose, onSave }) => {
    const { createWebhook, updateWebhook } = useWebhooks();
    const isEditMode = Boolean(webhook);
    const [isSaving, setIsSaving] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [selectedEvents, setSelectedEvents] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            setEndpoint(webhook.endpoint);
            setSelectedEvents(webhook.events);
        }
    }, [webhook, isEditMode]);

    const handleEventToggle = (event) => {
        setSelectedEvents(prev => prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedEvents.length === 0) {
            toast.error("Please select at least one event.");
            return;
        }
        const payload = { name: 'Default Webhook Name', endpoint, events: selectedEvents };

        setIsSaving(true);
        try {
        const result = isEditMode 
            ? await updateWebhook(webhook._id, payload)
            : await createWebhook(payload);

        if (result) {
            toast.success(`Webhook ${isEditMode ? 'updated' : 'created'} successfully!`);
            onSave();
            onClose();
        }
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} webhook. Please try again.`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // Updated for dark mode
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{isEditMode ? 'Edit Webhook' : 'Add Webhook'}</h2>
                    <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><FiX size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint URL</label>
                        <input
                            type="url"
                            id="endpoint"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            placeholder="https://example.com/api/webhook"
                            className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Events to send</label>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border dark:border-gray-600 rounded-md">
                            {AVAILABLE_EVENTS.map(event => (
                                <label key={event} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={selectedEvents.includes(event)}
                                        onChange={() => handleEventToggle(event)}
                                        className="rounded text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{event}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSaving} 
                            className="px-4 py-2 rounded-full bg-blue-600 text-white disabled:opacity-50"
                        >
                            {isSaving ? <Spinner /> : 'Save Webhook'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WebhookModal;