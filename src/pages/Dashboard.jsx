// import React, { useEffect } from 'react';
// import { FiPlus } from 'react-icons/fi';
// import RecentFormsTable from '../components/Dashboard/RecentFormsTable';
// import StatsCard from '../components/Dashboard/StatsCard';
// import TemplateLibrary from '../components/Dashboard/TemplateLibrary';
// import { useForms } from '../context/FormContext';
// import { Link } from 'react-router-dom';

// // Import local image assets for StatsCard icons
// import SentIcon from '../assets/statscard/sent.png';
// import PendingIcon from '../assets/statscard/pending.png';
// import CompletedIcon from '../assets/statscard/completed.png';
// import TimeIcon from '../assets/statscard/average.png';

// const Dashboard = () => {
//   const { forms, getForms, error: formsError } = useForms(); 

//   useEffect(() => {
//     getForms();
//   }, [getForms]); // Changed dependency to getForms for best practice

//   const createIcon = (src, alt) => <img src={src} alt={alt} className="w-5 h-5" />;

//   const totalForms = Array.isArray(forms) ? forms.length : 0;
//   const activeForms = Array.isArray(forms) ? forms.filter(form => form.status === 'active').length : 0;
//   const draftForms = Array.isArray(forms) ? forms.filter(form => form.status === 'draft').length : 0;

//   const completedForms = Array.isArray(forms)
//     ? forms.reduce((count, form) => {
//         if (Array.isArray(form.recipients)) {
//           return count + form.recipients.filter(rec => rec.status === 'completed').length;
//         }
//         return count;
//       }, 0)
//     : 0;

//   const previousTotalForms = 10;
//   const previousActiveForms = 3;
//   const previousDraftForms = 5;
//   const previousCompletedForms = 500;

//   const dynamicStats = [
//     { title: 'Total Forms', value: totalForms, previousValue: previousTotalForms, icon: createIcon(SentIcon, 'sent Icon') },
//     { title: 'Active Forms', value: activeForms, previousValue: previousActiveForms, icon: createIcon(PendingIcon, 'pending Icon') },
//     { title: 'Draft Forms', value: draftForms, previousValue: previousDraftForms, icon: createIcon(TimeIcon, 'average completion time Icon') },
//     { title: 'Completed Submissions', value: completedForms, previousValue: previousCompletedForms, icon: createIcon(CompletedIcon, 'completed Icon') },
//   ];


//   if (formsError) { 
//     return (
//       // Updated for dark mode
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
//         <p className="text-lg text-red-700 dark:text-red-500">Error loading dashboard: {formsError}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Dashboard Header */}
//       <div className="flex flex-wrap items-center justify-between mb-6">
//         <div>
//           {/* Updated for dark mode */}
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h2>
//           <p className="text-[#5F80A0] dark:text-gray-400">Overview of sent/received forms, status tracking, analytics</p>
//         </div>

//         <div className="flex justify-center space-x-4">
//           {/* Create New Form Button (Desktop) - No changes needed, primary blue works well */}
//           <Link
//             to="/create-form"
//             className="hidden sm:flex items-center justify-center bg-[#1475F4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none"
//           >
//             <FiPlus className="mr-2" />
//             Create New Form
//           </Link>

//           {/* This button is a mobile-only fallback for the one in the header - No changes needed */}
//           <Link
//             to="/create-form"
//             className="flex sm:hidden mt-4 w-full justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none"
//           >
//             <FiPlus className="mr-2" />
//             Create New Form
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {dynamicStats.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Recent Forms Table Section */}
//       <div className="space-y-8">
//         <RecentFormsTable />
//         <TemplateLibrary />
//       </div>
//     </>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import RecentFormsTable from '../components/Dashboard/RecentFormsTable';
import StatsCard from '../components/Dashboard/StatsCard';
import TemplateLibrary from '../components/Dashboard/TemplateLibrary';
import { useForms } from '../context/FormContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/Common/Spinner'; // Ensure this path is correct

// Import local image assets
import SentIcon from '../assets/statscard/sent.png';
import PendingIcon from '../assets/statscard/pending.png';
import CompletedIcon from '../assets/statscard/completed.png';
import TimeIcon from '../assets/statscard/average.png';

const Dashboard = () => {
    const { getDashboardStats } = useForms();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [getDashboardStats]);

    const createIcon = (src, alt) => <img src={src} alt={alt} className="w-5 h-5" />;

    const dynamicStats = stats ? [
        { title: 'Total Forms', value: stats.totalForms, previousValue: 10, icon: createIcon(SentIcon, 'sent Icon') },
        { title: 'Active Forms', value: stats.activeForms, previousValue: 3, icon: createIcon(PendingIcon, 'pending Icon') },
        { title: 'Draft Forms', value: stats.draftForms, previousValue: 5, icon: createIcon(TimeIcon, 'average completion time Icon') },
        { title: 'Total Submissions', value: stats.totalSubmissions, previousValue: 500, icon: createIcon(CompletedIcon, 'completed Icon') },
    ] : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-lg text-red-700 dark:text-red-500">Error loading dashboard: {error}</p>
            </div>
        );
    }

    return (
        <>
            {/* Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h2>
                    <p className="text-[#5F80A0] dark:text-gray-400">Overview of sent/received forms, status tracking, analytics</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link
                        to="/create-form"
                        className="hidden sm:flex items-center justify-center bg-[#1475F4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none"
                    >
                        <FiPlus className="mr-2" />
                        Create New Form
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dynamicStats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Forms Table Section */}
            <div className="space-y-8">
                <RecentFormsTable />
                <TemplateLibrary />
            </div>
        </>
    );
};

export default Dashboard;