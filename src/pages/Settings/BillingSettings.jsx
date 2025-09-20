import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useOrganization } from '../../context/OrganizationContext';
import { usePayments } from '../../context/PaymentContext';
import Spinner from '../../components/Common/Spinner';

const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

const BillingSettings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { organization, loading: orgLoading, fetchOrganizationDetails } = useOrganization();
    const { getCustomerPortal, loading: paymentLoading } = usePayments();
    
    const [isVerifying, setIsVerifying] = useState(searchParams.get('success') === 'true');

    // Use useCallback to memoize the fetch function
    const fetchOrgDetailsCallback = useCallback(fetchOrganizationDetails, []);
    const orgId = organization?._id; // Store orgId in a stable variable

    useEffect(() => {
        const hasSuccessParam = searchParams.get('success') === 'true';

        // --- START OF POLLING LOGIC FIX ---
        if (hasSuccessParam && orgId) {
            toast.success('Payment successful! Verifying your new plan...');
            setIsVerifying(true);

            let attempts = 0;
            const maxAttempts = 5; // Poll for 10 seconds

            const intervalId = setInterval(async () => {
                attempts++;
                try {
                    // We fetch details directly, the context will update itself
                    const updatedOrg = await fetchOrgDetailsCallback(orgId);
                    
                    if (updatedOrg && updatedOrg.plan !== 'starter') {
                        clearInterval(intervalId);
                        setIsVerifying(false);
                        toast.success('Your plan has been upgraded!');
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

            // Clean up the URL param after starting the poll
            searchParams.delete('success');
            setSearchParams(searchParams, { replace: true });
            
            return () => clearInterval(intervalId);
        }
        // --- END OF POLLING LOGIC FIX ---

        if (searchParams.get('canceled')) {
            toast.info('Your checkout process was canceled.');
            searchParams.delete('canceled');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, fetchOrgDetailsCallback, orgId]); // Dependency array is now stable

    const handleManageSubscription = () => {
        getCustomerPortal();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Next billing date, we will remind you!.';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    if (orgLoading && !organization) {
        return <div className="p-8 flex justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Billing & Plan</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your subscription and billing details.</p>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                {isVerifying ? (
                    <div className="text-center py-8">
                        <div className="flex justify-center"><Spinner /></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying payment and updating your plan...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Plan</h2>
                                <div className="mt-2 flex items-center">
                                    <span className="capitalize text-3xl font-bold text-blue-600 dark:text-blue-400">{organization?.plan || 'Starter'}</span>
                                    {organization?.subscriptionStatus === 'active' && <span className="ml-4 ...">Active</span>}
                                </div>
                            </div>
                            <button onClick={handleManageSubscription} disabled={paymentLoading || !organization?.customerId} className="...">
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
                        {(!organization?.subscriptionId || organization?.plan === 'starter') && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    You are currently on the free Starter plan. 
                                    <Link to="/pricing" className="ml-1 font-semibold text-blue-600 hover:underline">Upgrade to a paid plan</Link> to unlock more features.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BillingSettings;