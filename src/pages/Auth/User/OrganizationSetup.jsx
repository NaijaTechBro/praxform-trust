// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../../context/AuthContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import InputField from '../../../components/Auth/InputField';
// import Header from '../../../components/Auth/Header';
// import Business from '../../../assets/business.png';

// const OrganizationSetup = () => {
//     const [orgName, setOrgName] = useState('');
//     const [industry, setIndustry] = useState('');
//     const [website, setWebsite] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [address, setAddress] = useState({ street: '', city: '', state: '', country: '' });
//     const [localError, setLocalError] = useState('');

//     const { register, setupGoogleUserOrganization, loading } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation(); // Hook to access navigation state

//     useEffect(() => {
//         const tempUserData = localStorage.getItem('tempUserData');
//         const googleSetupToken = location.state?.setupToken;
//         if (googleSetupToken) {
//             localStorage.setItem('setupToken', googleSetupToken);
//         } else if (!tempUserData && !localStorage.getItem('setupToken')) {
//             toast.error("Invalid session. Please start the sign-up process again.");
//             navigate('/signup');
//         }
//     }, [location.state, navigate]);

//     const handleAddressChange = (e) => {
//         const { name, value } = e.target;
//         setAddress(prev => ({ ...prev, [name]: value }));
//     };

//     const handleProceed = async (e) => {
//         e.preventDefault();
//         setLocalError('');
//         if (!orgName || !industry || !website || !phoneNumber || !address.street || !address.city || !address.country) {
//             setLocalError('Please fill out all organization fields.');
//             return;
//         }
        
//         const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));
//         const setupToken = localStorage.getItem('setupToken');
//         const organizationData = { name: orgName, industry, website, phoneNumber, address };

//         let result;
//         if (setupToken) {
//             result = await setupGoogleUserOrganization(organizationData, setupToken);
//         } else if (tempUserData) {
//             const registrationPayload = { ...tempUserData, organization: organizationData };
//             result = await register(registrationPayload);
//         } else {
//             setLocalError("Your session has expired. Please start over.");
//             navigate('/signup');
//             return;
//         }

//         if (result.success) {
//             localStorage.removeItem('tempUserData');
//             localStorage.removeItem('setupToken');
//             if (tempUserData) {
//                 navigate('/verify-code');
//             } else {
//                 toast.success("Welcome! Your account is now fully set up.");
//                 navigate('/dashboard');
//             }
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
//                             <img src={Business} alt='Building Icon' className='mx-auto w-12 h-12' />
//                         </div>
//                         <h1 className="text-3xl font-bold text-gray-800">Tell Us About Your Business</h1>
//                         <p className="mt-2 text-sm text-gray-600">This will complete your account setup.</p>
//                     </div>

//                     <form onSubmit={handleProceed} className="space-y-4">
//                         <InputField id="orgName" label="Organization Name" placeholder="e.g., Acme Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
//                         <InputField id="industry" label="Industry" placeholder="e.g., Technology" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
//                         <InputField id="website" label="Website" placeholder="e.g., www.acme.com" value={website} onChange={(e) => setWebsite(e.target.value)} required />
//                         <div>
//                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
//                              <input id="phoneNumber" type="tel" placeholder="(555) 123-4567" className="w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
//                         </div>
//                         <InputField id="street" name="street" label="Street Address" placeholder="123 Main Street" value={address.street} onChange={handleAddressChange} required />
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                              <InputField id="city" name="city" label="City" placeholder="Anytown" value={address.city} onChange={handleAddressChange} required />
//                              <InputField id="state" name="state" label="State / Province" placeholder="CA" value={address.state} onChange={handleAddressChange} required />
//                         </div>
//                         <InputField id="country" name="country" label="Country" placeholder="USA" value={address.country} onChange={handleAddressChange} required />
//                         {localError && <p className="text-red-500 text-sm text-center pt-2">{localError}</p>}
//                         <button type="submit" className="w-full py-3 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition" disabled={loading}>
//                             {loading ? 'Processing...' : 'Complete Setup'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default OrganizationSetup;
















import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../components/Auth/InputField';
import Header from '../../../components/Auth/Header';
import Business from '../../../assets/business.png';

const OrganizationSetup = () => {
    // State for form data
    const [orgName, setOrgName] = useState('');
    const [industry, setIndustry] = useState('');
    const [website, setWebsite] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState({ street: '', city: '', state: '', country: '' });
    
    // ✅ NEW: State for tracking errors on a per-field basis
    const [errors, setErrors] = useState({});

    const { register, setupGoogleUserOrganization, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // This logic correctly handles the session check and remains unchanged.
        const tempUserData = localStorage.getItem('tempUserData');
        const googleSetupToken = location.state?.setupToken;
        if (googleSetupToken) {
            localStorage.setItem('setupToken', googleSetupToken);
        } else if (!tempUserData && !localStorage.getItem('setupToken')) {
            toast.error("Invalid session. Please start the sign-up process again.");
            navigate('/signup');
        }
    }, [location.state, navigate]);

    // ✅ NEW: A dedicated function to validate the entire form
    const validateForm = () => {
        const newErrors = {};
        if (!orgName.trim()) newErrors.orgName = "Organization name is required.";
        if (!industry.trim()) newErrors.industry = "Industry is required.";
        if (!website.trim()) newErrors.website = "Website is required.";
        if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
        if (!address.street.trim()) newErrors.street = "Street address is required.";
        if (!address.city.trim()) newErrors.city = "City is required.";
        if (!address.state.trim()) newErrors.state = "State is required.";
        if (!address.country.trim()) newErrors.country = "Country is required.";
        return newErrors;
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        // Clear error for this field as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleProceed = async (e) => {
        e.preventDefault();
        
        // ✅ UPDATED: Run validation before submitting
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the submission if there are errors
        }

        const tempUserData = JSON.parse(localStorage.getItem('tempUserData'));
        const setupToken = localStorage.getItem('setupToken');
        const organizationData = { name: orgName, industry, website, phoneNumber, address };

        let result;
        if (setupToken) {
            result = await setupGoogleUserOrganization(organizationData, setupToken);
        } else if (tempUserData) {
            const registrationPayload = { ...tempUserData, organization: organizationData };
            result = await register(registrationPayload);
        } else {
            setErrors({ form: "Your session has expired. Please start over." });
            return;
        }

        if (result.success) {
            localStorage.removeItem('tempUserData');
            localStorage.removeItem('setupToken');
            if (tempUserData) {
                navigate('/verify-code');
            } else {
                toast.success("Welcome! Your account is now fully set up.");
                navigate('/dashboard');
            }
        } else {
            setErrors({ form: result.message || 'An unknown error occurred.' });
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <img src={Business} alt='Building Icon' className='mx-auto w-16 h-16 mb-4' />
                        <h1 className="text-3xl font-bold text-gray-800">Tell Us About Your Business</h1>
                        <p className="mt-2 text-sm text-gray-600">This will complete your account setup.</p>
                    </div>

                    <form onSubmit={handleProceed} className="space-y-4">
                        {/* ✅ UPDATED: InputFields now have validation props */}
                        <InputField id="orgName" label="Organization Name" placeholder="e.g., Acme Inc." value={orgName} onChange={(e) => { setOrgName(e.target.value); if (errors.orgName) setErrors(prev => ({ ...prev, orgName: null })); }} hasError={!!errors.orgName} isValid={!errors.orgName && orgName.length > 0} error={errors.orgName} />
                        <InputField id="industry" label="Industry" placeholder="e.g., Technology" value={industry} onChange={(e) => { setIndustry(e.target.value); if (errors.industry) setErrors(prev => ({ ...prev, industry: null })); }} hasError={!!errors.industry} isValid={!errors.industry && industry.length > 0} error={errors.industry} />
                        <InputField id="website" label="Website" placeholder="e.g., www.acme.com" value={website} onChange={(e) => { setWebsite(e.target.value); if (errors.website) setErrors(prev => ({ ...prev, website: null })); }} hasError={!!errors.website} isValid={!errors.website && website.length > 0} error={errors.website} />
                        <InputField id="phoneNumber" label="Phone Number" type="tel" placeholder="(555) 123-4567" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: null })); }} hasError={!!errors.phoneNumber} isValid={!errors.phoneNumber && phoneNumber.length > 0} error={errors.phoneNumber} />
                        <InputField id="street" name="street" label="Street Address" placeholder="123 Main Street" value={address.street} onChange={handleAddressChange} hasError={!!errors.street} isValid={!errors.street && address.street.length > 0} error={errors.street} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField id="city" name="city" label="City" placeholder="Anytown" value={address.city} onChange={handleAddressChange} hasError={!!errors.city} isValid={!errors.city && address.city.length > 0} error={errors.city} />
                            <InputField id="state" name="state" label="State / Province" placeholder="CA" value={address.state} onChange={handleAddressChange} hasError={!!errors.state} isValid={!errors.state && address.state.length > 0} error={errors.state} />
                        </div>
                        <InputField id="country" name="country" label="Country" placeholder="USA" value={address.country} onChange={handleAddressChange} hasError={!!errors.country} isValid={!errors.country && address.country.length > 0} error={errors.country} />
                        
                        {errors.form && <p className="text-red-500 text-sm text-center pt-2">{errors.form}</p>}
                        
                        <button type="submit" className="w-full py-3 mt-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition" disabled={loading}>
                            {loading ? 'Processing...' : 'Complete Setup'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OrganizationSetup;