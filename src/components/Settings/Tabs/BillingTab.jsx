import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useOrganization } from '../../../context/OrganizationContext';
import { usePayments } from '../../../context/PaymentContext';
import Spinner from '../../Common/Spinner';

const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

const BillingTab = () => {
    // --- FIX: Import the new silent refetch function ---
    const { organization, refetchOrganizationWithoutLoading } = useOrganization();
    const { getCustomerPortal, loading: paymentLoading } = usePayments();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [isVerifying, setIsVerifying] = useState(searchParams.get('success') === 'true');

    useEffect(() => {
        const hasSuccessParam = searchParams.get('success') === 'true';
        const orgId = organization?._id;

        if (hasSuccessParam && orgId) {
            toast.info('Payment successful! Verifying your new plan...');
            setIsVerifying(true);

            let attempts = 0;
            // --- FIX: Increase polling duration for more reliability ---
            const maxAttempts = 15; // Poll for 30 seconds (15 attempts * 2 seconds)

            const intervalId = setInterval(async () => {
                attempts++;
                try {
                    // --- FIX: Use the silent refetch function to prevent flickering ---
                    const updatedOrg = await refetchOrganizationWithoutLoading(orgId);
                    
                    if (updatedOrg && updatedOrg.plan !== 'starter') {
                        clearInterval(intervalId);
                        setIsVerifying(false);
                        toast.success('Your plan has been upgraded successfully!');
                    } else if (attempts >= maxAttempts) {
                        clearInterval(intervalId);
                        setIsVerifying(false);
                        toast.info("Your plan is updating. Please refresh the page in a moment to see the changes.");
                    }
                } catch (error) {
                    clearInterval(intervalId);
                    setIsVerifying(false);
                    toast.error("An issue occurred while verifying your plan update.");
                }
            }, 2000);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete('success');
            setSearchParams(newParams, { replace: true });
            
            return () => clearInterval(intervalId);
        }

        if (searchParams.get('canceled')) {
            toast.info('Your checkout process was canceled.');
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('canceled');
            setSearchParams(newParams, { replace: true });
        }
    }, [organization?._id, searchParams, setSearchParams, refetchOrganizationWithoutLoading]);

    const handleManageSubscription = () => {
        getCustomerPortal();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isVerifying) {
        return (
            <div className="text-center py-8">
                <div className="flex justify-center"><Spinner /></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying payment and updating your plan...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Billing & Plan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your subscription and billing details.</p>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Plan</h2>
                        <div className="mt-2 flex items-center">
                            <span className="capitalize text-3xl font-bold text-blue-600 dark:text-blue-400">{organization?.plan || 'Starter'}</span>
                            {organization?.subscriptionStatus === 'active' && (
                                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-400">Active</span>
                            )}
                        </div>
                    </div>
                    <button onClick={handleManageSubscription} disabled={paymentLoading || !organization?.customerId} className="mt-4 sm:mt-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        <CardIcon />
                        <span className="ml-2">{paymentLoading ? 'Redirecting...' : 'Manage Subscription'}</span>
                    </button>
                </div>
                {organization?.subscriptionStatus === 'active' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Your plan renews on <span className="font-semibold text-gray-900 dark:text-white">{formatDate(organization.currentPeriodEnd)}</span>.
                        </p>
                    </div>
                )}
                {(!organization?.subscriptionId || organization?.plan === 'starter') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            You are on the free Starter plan. 
                            <Link to="/pricing" className="ml-1 font-semibold text-blue-600 hover:underline">Upgrade your plan</Link> to unlock more features.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingTab;