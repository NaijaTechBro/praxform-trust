import React, { useState } from 'react';

const Ach = () => {
  // State to hold all form data
  const [formData, setFormData] = useState({
    depositType: '',
    vendorName: '',
    email: '',
    contactPerson: '',
    telephone: '',
    address: '',
    bankName: '',
    bankPhone: '',
    bankAccountName: '',
    bankAccountNumber: '',
    routingNumber: '',
    accountType: '',
    authorization: false,
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
    console.log('Form Submitted:', formData);
    // You can add your API call or further processing logic here
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Vendor ACH/Direct Deposit Authorization Form</h1>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400 mt-1">City of Thomasville Accounts Payable</p>
          </div>

          {/* Please Check One Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Please Check One</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center">
                <input
                  id="newDeposit"
                  type="radio"
                  name="depositType"
                  value="NEW Direct Deposit"
                  checked={formData.depositType === 'NEW Direct Deposit'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="newDeposit" className="ml-2 block text-sm text-gray-700">NEW Direct Deposit</label>
              </div>
              <div className="flex items-center">
                <input
                  id="changeDeposit"
                  type="radio"
                  name="depositType"
                  value="CHANGE Direct Deposit"
                  checked={formData.depositType === 'CHANGE Direct Deposit'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="changeDeposit" className="ml-2 block text-sm text-gray-700">CHANGE Direct Deposit</label>
              </div>
              <div className="flex items-center">
                <input
                  id="cancelDeposit"
                  type="radio"
                  name="depositType"
                  value="CANCEL Direct Deposit"
                  checked={formData.depositType === 'CANCEL Direct Deposit'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="cancelDeposit" className="ml-2 block text-sm text-gray-700">CANCEL Direct Deposit</label>
              </div>
            </div>
          </div>

          {/* Vendor/Payee Information Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Vendor/Payee Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name */}
              <div>
                <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="vendorName"
                  name="vendorName"
                  type="text"
                  value={formData.vendorName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. DoeJohn@mail.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Contact Person's Name */}
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person's Name</label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Telephone Number */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Telephone Number</label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
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
          </div>

          {/* Financial Institution Information Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Financial Institution Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Bank Name */}
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Bank Phone Number */}
              <div>
                <label htmlFor="bankPhone" className="block text-sm font-medium text-gray-700">Bank Phone Number</label>
                <input
                  id="bankPhone"
                  name="bankPhone"
                  type="tel"
                  value={formData.bankPhone}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Name on Bank Account */}
              <div>
                <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700">Name on Bank Account</label>
                <input
                  id="bankAccountName"
                  name="bankAccountName"
                  type="text"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Bank Account Number */}
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                <input
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Nine-Digit Bank Routing/Transit Number (ABA) */}
              <div className="sm:col-span-2">
                <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">Nine-Digit Bank Routing/Transit Number (ABA)</label>
                <input
                  id="routingNumber"
                  name="routingNumber"
                  type="text"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
            </div>
          </div>

          {/* Type of Account Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Type of Account</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center">
                <input
                  id="checking"
                  type="radio"
                  name="accountType"
                  value="Checking"
                  checked={formData.accountType === 'Checking'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="checking" className="ml-2 block text-sm text-gray-700">Checking</label>
              </div>
              <div className="flex items-center">
                <input
                  id="savings"
                  type="radio"
                  name="accountType"
                  value="Savings"
                  checked={formData.accountType === 'Savings'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="savings" className="ml-2 block text-sm text-gray-700">Savings</label>
              </div>
            </div>
          </div>

          {/* Authorization Checkbox and Text */}
          <div className="flex items-start border-t border-gray-200 pt-6">
            <div className="flex items-center h-5">
              <input
                id="authorization"
                name="authorization"
                type="checkbox"
                checked={formData.authorization}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-2 text-xs text-gray-600">
              <label htmlFor="authorization">
                I certify that the information provided on this form is correct, and I hereby authorize the City of Thomasville Accounts Payable to electronically deposit payments to the bank account designated above. It is my responsibility to notify AP (<a href="mailto:Megan.Widener@thomasville-nc.gov" className="text-blue-600 hover:underline">Megan.Widener@thomasville-nc.gov</a> or <a href="tel:336-475-5530" className="text-blue-600 hover:underline">336-475-5530</a>) immediately if I believe there is a discrepancy between the amount deposited to my bank account and the amount of the invoice(s) paid. I understand that I must notify City of Thomasville AP in writing immediately of any changes in status or banking information. I understand that this authorization will remain in full force and effect until City of Thomasville AP has received written notification
              </label>
            </div>
          </div>
        </form>
      </div>
  );
};

export default Ach;













// import React, { useState } from 'react';

// const Ach = () => {
//     // State and logic remains unchanged
//     const [formData, setFormData] = useState({ /* ... */ });
//     const handleChange = (e) => { /* ... */ };
//     const handleSubmit = (e) => { /* ... */ };

//     return (
//         // Layout classes removed
//         <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full">
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Header Section - Updated for dark mode */}
//                 <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
//                     <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Vendor ACH/Direct Deposit Authorization Form</h1>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">City of Thomasville Accounts Payable</p>
//                 </div>
                
//                 {/* All form sections updated with dark mode classes, similar to the W9 and Credit Card forms */}
                
//                 {/* Example of one section */}
//                 <div>
//                     <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Please Check One</h2>
//                     <div className="flex flex-wrap gap-4 sm:gap-6">
//                         <div className="flex items-center">
//                             <input id="newDeposit" type="radio" name="depositType" value="NEW Direct Deposit" checked={formData.depositType === 'NEW Direct Deposit'} onChange={handleChange} className="h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500" />
//                             <label htmlFor="newDeposit" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">NEW Direct Deposit</label>
//                         </div>
//                         {/* ... other radio buttons ... */}
//                     </div>
//                 </div>

//                 {/* Example of another section */}
//                 <div className="space-y-4">
//                     <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Vendor/Payee Information</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                         <div>
//                             <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
//                             <input id="vendorName" name="vendorName" type="text" value={formData.vendorName} onChange={handleChange} placeholder="e.g. John Doe" className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500 p-2" />
//                         </div>
//                         {/* ... other inputs ... */}
//                     </div>
//                 </div>
                
//                 {/* ... The rest of your form follows the same pattern ... */}

//             </form>
//         </div>
//     );
// };

// export default Ach;