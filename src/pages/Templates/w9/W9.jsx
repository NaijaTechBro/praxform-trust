// import React, { useState } from 'react';

// const W9 = () => {
//   // State to hold all form data
//   const [formData, setFormData] = useState({
//     entityName: '',
//     businessName: '',
//     taxClassification: '',
//     taxLLC: '',
//     foreignPartnership: false,
//     exemptPayeeCode: '',
//     foreignAccountExemption: '',
//     address: '',
//     cityStateZip: '',
//     accountNumbers: '',
//     requestersName: '',
//     socialSecurityNumber: '',
//     employerIdNumber: '',
//   });

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Submitted:', formData);
//     // You can add your API call or further processing logic here
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Header Section */}
//           <div className="border-b pb-4 border-gray-200">
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900">W-9 Form</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               For the latest information about developments related to Form W-9 and its instructions, such as legislation enacted after they were published, go to <a href="www.irs.gov/FormW9" className="text-blue-600 hover:underline">www.irs.gov/FormW9</a>.
//             </p>
//           </div>

//           {/* Business Information Section */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               {/* Name of Entity/Individual */}
//               <div>
//                 <label htmlFor="entityName" className="block text-sm font-medium text-gray-700">Name of Entity/Individual</label>
//                 <input
//                   id="entityName"
//                   name="entityName"
//                   type="text"
//                   value={formData.entityName}
//                   onChange={handleChange}
//                   placeholder="e.g John Doe"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* Business Name */}
//               <div>
//                 <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
//                 <input
//                   id="businessName"
//                   name="businessName"
//                   type="text"
//                   value={formData.businessName}
//                   onChange={handleChange}
//                   placeholder="e.g Frameio Stores"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Tax Classification Section */}
//           <div className="space-y-4">
//             <h2 className="text-base font-semibold text-gray-900">Tax Classification</h2>
//             <div className="flex flex-wrap gap-4 sm:gap-6">
//               <div className="flex items-center">
//                 <input
//                   id="individual"
//                   type="radio"
//                   name="taxClassification"
//                   value="Individual/Sole Proprietor"
//                   checked={formData.taxClassification === 'Individual/Sole Proprietor'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="individual" className="ml-2 block text-sm text-gray-700">Individual/Sole Proprietor</label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="cCorp"
//                   type="radio"
//                   name="taxClassification"
//                   value="C Corporation"
//                   checked={formData.taxClassification === 'C Corporation'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="cCorp" className="ml-2 block text-sm text-gray-700">C Corporation</label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="sCorp"
//                   type="radio"
//                   name="taxClassification"
//                   value="S Corporation"
//                   checked={formData.taxClassification === 'S Corporation'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="sCorp" className="ml-2 block text-sm text-gray-700">S Corporation</label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="partnership"
//                   type="radio"
//                   name="taxClassification"
//                   value="Partnership"
//                   checked={formData.taxClassification === 'Partnership'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="partnership" className="ml-2 block text-sm text-gray-700">Partnership</label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="trust"
//                   type="radio"
//                   name="taxClassification"
//                   value="Trust/Estate"
//                   checked={formData.taxClassification === 'Trust/Estate'}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="trust" className="ml-2 block text-sm text-gray-700">Trust/Estate</label>
//               </div>
//             </div>

//             {/* Tax LLC information */}
//             <div className="flex items-start mt-4">
//               <div className="flex items-center h-5">
//                 <input
//                   id="taxLLC"
//                   name="taxLLC"
//                   type="checkbox"
//                   checked={formData.taxLLC === 'LLC'}
//                   onChange={handleChange}
//                   className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 />
//               </div>
//               <div className="ml-2 text-xs text-gray-600">
//                 <label htmlFor="taxLLC">
//                   LLC. Enter the tax classification (C = C corporation, S = S corporation, P = Partnership) Note: Check the "LLC" box above and, in the entry space, enter the appropriate code (C, S, or P) for the tax classification of the LLC, unless it is a disregarded entity. A disregarded entity should instead check the appropriate box for the tax classification of its owner.
//                 </label>
//               </div>
//             </div>

//             {/* Foreign Partnership information */}
//             <div className="flex items-start mt-4">
//               <div className="flex items-center h-5">
//                 <input
//                   id="foreignPartnership"
//                   name="foreignPartnership"
//                   type="checkbox"
//                   checked={formData.foreignPartnership}
//                   onChange={handleChange}
//                   className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 />
//               </div>
//               <div className="ml-2 text-xs text-gray-600">
//                 <label htmlFor="foreignPartnership">
//                   If you checked "Partnership" or "Trust/Estate," or checked "LLC" and entered "P" as its tax classification, and you are providing this form to a partnership, trust, or estate in which you have an ownership interest, check this box if you have any foreign partners, owners, or beneficiaries.
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Exemptions and Address Section */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               {/* Exempt Payee Code */}
//               <div>
//                 <label htmlFor="exemptPayeeCode" className="block text-sm font-medium text-gray-700">Exempt Payee Code</label>
//                 <input
//                   id="exemptPayeeCode"
//                   name="exemptPayeeCode"
//                   type="text"
//                   value={formData.exemptPayeeCode}
//                   onChange={handleChange}
//                   placeholder="Start Typing"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* Foreign Account Exemption */}
//               <div>
//                 <label htmlFor="foreignAccountExemption" className="block text-sm font-medium text-gray-700">Foreign Account Exemption</label>
//                 <input
//                   id="foreignAccountExemption"
//                   name="foreignAccountExemption"
//                   type="text"
//                   value={formData.foreignAccountExemption}
//                   onChange={handleChange}
//                   placeholder="Start Typing"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* Address */}
//               <div>
//                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
//                 <input
//                   id="address"
//                   name="address"
//                   type="text"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="(number, street, and apt. or suite no.)"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* City, State, and ZIP Code */}
//               <div>
//                 <label htmlFor="cityStateZip" className="block text-sm font-medium text-gray-700">City, State, and ZIP Code</label>
//                 <input
//                   id="cityStateZip"
//                   name="cityStateZip"
//                   type="text"
//                   value={formData.cityStateZip}
//                   onChange={handleChange}
//                   placeholder="Start Typing"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* List Account Number(S) */}
//               <div>
//                 <label htmlFor="accountNumbers" className="block text-sm font-medium text-gray-700">List Account Number(S)</label>
//                 <input
//                   id="accountNumbers"
//                   name="accountNumbers"
//                   type="text"
//                   value={formData.accountNumbers}
//                   onChange={handleChange}
//                   placeholder="Start Typing"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* Requester's Name And Address */}
//               <div>
//                 <label htmlFor="requestersName" className="block text-sm font-medium text-gray-700">Requester's Name And Address</label>
//                 <input
//                   id="requestersName"
//                   name="requestersName"
//                   type="text"
//                   value={formData.requestersName}
//                   onChange={handleChange}
//                   placeholder="Start Typing"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Identification Numbers Section */}
//           <div className="space-y-4 border-t pt-6 border-gray-200">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               {/* Social Security Number */}
//               <div>
//                 <label htmlFor="socialSecurityNumber" className="block text-sm font-medium text-gray-700">Social Security Number</label>
//                 <input
//                   id="socialSecurityNumber"
//                   name="socialSecurityNumber"
//                   type="text"
//                   value={formData.socialSecurityNumber}
//                   onChange={handleChange}
//                   placeholder="Must Be 10 Digits"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//               {/* Employer Identification Number */}
//               <div>
//                 <label htmlFor="employerIdNumber" className="block text-sm font-medium text-gray-700">Employer Identification Number</label>
//                 <input
//                   id="employerIdNumber"
//                   name="employerIdNumber"
//                   type="text"
//                   value={formData.employerIdNumber}
//                   onChange={handleChange}
//                   placeholder="Must Be 9 Digits"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
//                 />
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default W9;























import React, { useState } from 'react';

const W9 = () => {

  const [formData, setFormData] = useState({
    entityName: '',
    businessName: '',
    taxClassification: '',
    taxLLC: '',
    foreignPartnership: false,
    exemptPayeeCode: '',
    foreignAccountExemption: '',
    address: '',
    cityStateZip: '',
    accountNumbers: '',
    requestersName: '',
    socialSecurityNumber: '',
    employerIdNumber: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log('Form Submitted:', formData);
    // You can add your API call or further processing logic here
  };


    return (
        // Layout classes removed
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section - Updated for dark mode */}
                <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">W-9 Form</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        For the latest information... go to <a href="http://www.irs.gov/FormW9" className="text-blue-600 dark:text-blue-500 hover:underline">www.irs.gov/FormW9</a>.
                    </p>
                </div>

                {/* All form sections updated for dark mode */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="entityName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name of Entity/Individual</label>
                            <input id="entityName" name="entityName" type="text" value={formData.entityName} onChange={handleChange} placeholder="e.g John Doe" className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500 p-2" />
                        </div>
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                            <input id="businessName" name="businessName" type="text" value={formData.businessName} onChange={handleChange} placeholder="e.g Frameio Stores" className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500 p-2" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Tax Classification</h2>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        {/* Radio buttons updated for dark mode */}
                        <div className="flex items-center">
                            <input id="individual" type="radio" name="taxClassification" value="Individual/Sole Proprietor" checked={formData.taxClassification === 'Individual/Sole Proprietor'} onChange={handleChange} className="h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500" />
                            <label htmlFor="individual" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Individual/Sole Proprietor</label>
                        </div>
                        <div className="flex items-center">
                <input
                  id="sCorp"
                  type="radio"
                  name="taxClassification"
                  value="S Corporation"
                  checked={formData.taxClassification === 'S Corporation'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sCorp" className="ml-2 block text-sm text-gray-700">S Corporation</label>
              </div>
              <div className="flex items-center">
                <input
                  id="partnership"
                  type="radio"
                  name="taxClassification"
                  value="Partnership"
                  checked={formData.taxClassification === 'Partnership'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="partnership" className="ml-2 block text-sm text-gray-700">Partnership</label>
              </div>
              <div className="flex items-center">
                <input
                  id="trust"
                  type="radio"
                  name="taxClassification"
                  value="Trust/Estate"
                  checked={formData.taxClassification === 'Trust/Estate'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="trust" className="ml-2 block text-sm text-gray-700">Trust/Estate</label>
              </div>
                    </div>
                    <div className="flex items-start mt-4">
                        <div className="flex items-center h-5">
                            <input id="taxLLC" name="taxLLC" type="checkbox" checked={formData.taxLLC === 'LLC'} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded" />
                        </div>
                        <div className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                            <label htmlFor="taxLLC">LLC. Enter the tax classification (C = C corporation, S = S corporation, P = Partnership) Note: Check the "LLC" box above and, in the entry space, enter the appropriate code (C, S, or P) for the tax classification of the LLC, unless it is a disregarded entity. A disregarded entity should instead check the appropriate box for the tax classification of its owner.</label>
                        </div>
                    </div>
                </div>
                {/* Foreign Partnership information */}
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="foreignPartnership"
                  name="foreignPartnership"
                  type="checkbox"
                  checked={formData.foreignPartnership}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-2 text-xs text-gray-600">
                <label htmlFor="foreignPartnership">
                  If you checked "Partnership" or "Trust/Estate," or checked "LLC" and entered "P" as its tax classification, and you are providing this form to a partnership, trust, or estate in which you have an ownership interest, check this box if you have any foreign partners, owners, or beneficiaries.
                </label>
              </div>
            </div>

          {/* Exemptions and Address Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Exempt Payee Code */}
              <div>
                <label htmlFor="exemptPayeeCode" className="block text-sm font-medium text-gray-700">Exempt Payee Code</label>
                <input
                  id="exemptPayeeCode"
                  name="exemptPayeeCode"
                  type="text"
                  value={formData.exemptPayeeCode}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Foreign Account Exemption */}
              <div>
                <label htmlFor="foreignAccountExemption" className="block text-sm font-medium text-gray-700">Foreign Account Exemption</label>
                <input
                  id="foreignAccountExemption"
                  name="foreignAccountExemption"
                  type="text"
                  value={formData.foreignAccountExemption}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="(number, street, and apt. or suite no.)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* City, State, and ZIP Code */}
              <div>
                <label htmlFor="cityStateZip" className="block text-sm font-medium text-gray-700">City, State, and ZIP Code</label>
                <input
                  id="cityStateZip"
                  name="cityStateZip"
                  type="text"
                  value={formData.cityStateZip}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* List Account Number(S) */}
              <div>
                <label htmlFor="accountNumbers" className="block text-sm font-medium text-gray-700">List Account Number(S)</label>
                <input
                  id="accountNumbers"
                  name="accountNumbers"
                  type="text"
                  value={formData.accountNumbers}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Requester's Name And Address */}
              <div>
                <label htmlFor="requestersName" className="block text-sm font-medium text-gray-700">Requester's Name And Address</label>
                <input
                  id="requestersName"
                  name="requestersName"
                  type="text"
                  value={formData.requestersName}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
            </div>
          </div>

          {/* Identification Numbers Section */}
          <div className="space-y-4 border-t pt-6 border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Social Security Number */}
              <div>
                <label htmlFor="socialSecurityNumber" className="block text-sm font-medium text-gray-700">Social Security Number</label>
                <input
                  id="socialSecurityNumber"
                  name="socialSecurityNumber"
                  type="text"
                  value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  placeholder="Must Be 10 Digits"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Employer Identification Number */}
              <div>
                <label htmlFor="employerIdNumber" className="block text-sm font-medium text-gray-700">Employer Identification Number</label>
                <input
                  id="employerIdNumber"
                  name="employerIdNumber"
                  type="text"
                  value={formData.employerIdNumber}
                  onChange={handleChange}
                  placeholder="Must Be 9 Digits"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
            </div>
          </div>
                
            </form>
        </div>
    );
};

export default W9;