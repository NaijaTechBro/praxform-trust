// import React, { useState } from 'react';
// import { useAuth } from '../../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import InputField from '../../../components/Auth/InputField';
// import Header from '../../../components/Auth/Header';
// import Business from '../../../assets/business.png';

// const SetupOrganization = () => {
//     const [orgName, setOrgName] = useState('');
//     const [industry, setIndustry] = useState('');
//     const [localError, setLocalError] = useState('');
    
//     const { setupGoogleUserOrganization, loading } = useAuth();
//     const navigate = useNavigate();

//     const handleProceed = async (e) => {
//         e.preventDefault();
//         setLocalError('');
//         if (!orgName || !industry) {
//             setLocalError('Please fill out all organization fields.');
//             return;
//         }

//         const orgData = {
//             name: orgName,
//             industry,
//             // You can add more fields here if needed, like address, phone, etc.
//         };

//         const result = await setupGoogleUserOrganization(orgData);
        
//         if (result.success) {
//             toast.success("Welcome! Your account is now fully set up.");
//             navigate('/dashboard');
//         } else {
//             setLocalError(result.message || 'An unknown error occurred.');
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="flex items-center justify-center min-h-screen bg-gray-100">
//                 <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
//                     <div className="text-center">
//                         <div className="mx-auto bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
//                             <img src={Business} alt='building' className='mx-auto w-12' />
//                         </div>
//                         <h1 className="text-3xl font-bold text-gray-800">Almost there!</h1>
//                         <p className="mt-2 text-sm text-gray-600">Tell us about your organization to finish your account setup.</p>
//                     </div>
                    
//                     <form onSubmit={handleProceed} className="space-y-6">
//                         <InputField id="orgName" label="Organization Name" placeholder="e.g., Acme Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
//                         <InputField id="industry" label="Industry" placeholder="e.g., Technology" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
                        
//                         {localError && <p className="text-red-500 text-sm text-center pt-2">{localError}</p>}
                        
//                         <button type="submit" className="w-full py-3 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition" disabled={loading}>
//                             {loading ? 'Finalizing...' : 'Complete Setup'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SetupOrganization;







import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../components/Auth/InputField';
import Header from '../../../components/Auth/Header';
import Business from '../../../assets/business.png';

const SetupOrganization = () => {
    const [orgName, setOrgName] = useState('');
    const [industry, setIndustry] = useState('');
    const [localError, setLocalError] = useState('');
    
    const { setupGoogleUserOrganization, loading } = useAuth();
    const navigate = useNavigate();

    // Security check: If a user lands here without a setup token, they should be redirected.
    useEffect(() => {
        const setupToken = localStorage.getItem('setupToken');
        if (!setupToken) {
            toast.error("Invalid session. Please sign up again.");
            navigate('/signup');
        }
    }, [navigate]);

    const handleProceed = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!orgName || !industry) {
            setLocalError('Organization Name and Industry are required.');
            return;
        }

        const setupToken = localStorage.getItem('setupToken');
        if (!setupToken) {
            toast.error("Your session has expired. Please try signing up again.");
            navigate('/signup');
            return;
        }

        const orgData = {
            name: orgName,
            industry: industry,
        };

        const result = await setupGoogleUserOrganization(orgData, setupToken);
        
        if (result.success) {
            toast.success("Welcome! Your account is now fully set up.");
            navigate('/dashboard');
        } else {
            setLocalError(result.message || 'An unknown error occurred during setup.');
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <div className="mx-auto bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
                            <img src={Business} alt='Building Icon' className='mx-auto w-12 h-12' />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Almost there!</h1>
                        <p className="mt-2 text-sm text-gray-600">Tell us about your organization to finish your account setup.</p>
                    </div>
                    
                    <form onSubmit={handleProceed} className="space-y-6">
                        <InputField 
                            id="orgName" 
                            label="Organization Name" 
                            placeholder="e.g., Acme Inc." 
                            value={orgName} 
                            onChange={(e) => setOrgName(e.target.value)} 
                            required 
                        />
                        <InputField 
                            id="industry" 
                            label="Industry" 
                            placeholder="e.g., Technology" 
                            value={industry} 
                            onChange={(e) => setIndustry(e.target.value)} 
                            required 
                        />
                        
                        {localError && <p className="text-red-500 text-sm text-center pt-2">{localError}</p>}
                        
                        <button 
                            type="submit" 
                            className="w-full py-3 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-75" 
                            disabled={loading}
                        >
                            {loading ? 'Finalizing...' : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SetupOrganization;