import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useOrganization } from '../../../context/OrganizationContext';
import UpdatePersonalInfoModal from '../Modals/UpdatePersonalInfoModal';
import UpdateOrganizationInfoModal from '../Modals/UpdateOrganizationInfoModal';

// Reusable components from your original file
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
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const colorClass = roleColors[role] || roleColors.default;
    return <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${colorClass}`}>{role || 'N/A'}</span>;
};

const VerificationBadge = ({ status }) => {
    const statusColors = {
        verified: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
        unverified: 'bg-orange-300 text-gray-800 dark:bg-orange-700 dark:text-gray-300',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const colorClass = statusColors[status] || statusColors.default;
    return <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${colorClass}`}>{status || 'N/A'}</span>;
};


const ProfileTab = () => {
    const { user } = useAuth();
    const { organization, userRole } = useOrganization();
    
    const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
    const [showOrgInfoModal, setShowOrgInfoModal] = useState(false);

    return (
        <>
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

            {showPersonalInfoModal && <UpdatePersonalInfoModal onClose={() => setShowPersonalInfoModal(false)} />}
            {showOrgInfoModal && <UpdateOrganizationInfoModal onClose={() => setShowOrgInfoModal(false)} />}
        </>
    );
};

export default ProfileTab;