import React, { useState } from 'react';

const CreditCard = () => {
  // State to hold all form data
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvvCode: '',
    cardType: '',
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="border-b pb-4 border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Credit Card Authorization Form</h1>
            <p className="text-sm text-gray-500 mt-1">
              Please complete all fields. You may cancel this authorization at any time by contacting us. This authorization will remain in effect till it's cancelled.
            </p>
          </div>

          {/* Card Details Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Card Holder Name */}
              <div>
                <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                <input
                  id="cardHolderName"
                  name="cardHolderName"
                  type="text"
                  value={formData.cardHolderName}
                  onChange={handleChange}
                  placeholder="e.g John Doe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="Must be 20 Digits"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="text"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="mm/yy"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
              {/* CVV Code */}
              <div>
                <label htmlFor="cvvCode" className="block text-sm font-medium text-gray-700">CVV Code</label>
                <input
                  id="cvvCode"
                  name="cvvCode"
                  type="text"
                  value={formData.cvvCode}
                  onChange={handleChange}
                  placeholder="3 Digit Secure Code"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 p-2"
                />
              </div>
            </div>
          </div>

          {/* Card Type Section */}
          <div className="border-t pt-6 border-gray-200">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center">
                <input
                  id="masterCard"
                  type="radio"
                  name="cardType"
                  value="Master Card"
                  checked={formData.cardType === 'Master Card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="masterCard" className="ml-2 block text-sm text-gray-700">Master Card</label>
              </div>
              <div className="flex items-center">
                <input
                  id="visa"
                  type="radio"
                  name="cardType"
                  value="Visa"
                  checked={formData.cardType === 'Visa'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="visa" className="ml-2 block text-sm text-gray-700">Visa</label>
              </div>
              <div className="flex items-center">
                <input
                  id="discover"
                  type="radio"
                  name="cardType"
                  value="Discover"
                  checked={formData.cardType === 'Discover'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="discover" className="ml-2 block text-sm text-gray-700">Discover</label>
              </div>
              <div className="flex items-center">
                <input
                  id="amex"
                  type="radio"
                  name="cardType"
                  value="Amex"
                  checked={formData.cardType === 'Amex'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="amex" className="ml-2 block text-sm text-gray-700">Amex</label>
              </div>
            </div>
          </div>
          
          {/* Authorization Checkbox */}
          <div className="flex items-start border-t pt-6 border-gray-200">
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
                I authorize charging my credit card for purchases. My information will be saved for future transactions.
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditCard;











// import React, { useState } from 'react';

// const CreditCard = () => {
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
//                     <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Credit Card Authorization Form</h1>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                         Please complete all fields...
//                     </p>
//                 </div>

//                 {/* Card Details Section - Updated for dark mode */}
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                         <div>
//                             <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Holder Name</label>
//                             <input id="cardHolderName" name="cardHolderName" type="text" value={formData.cardHolderName} onChange={handleChange} placeholder="e.g John Doe" className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500 p-2" />
//                         </div>
//                         {/* ... other input fields follow the same pattern ... */}
//                     </div>
//                 </div>

//                 {/* Card Type Section - Updated for dark mode */}
//                 <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
//                     <div className="flex flex-wrap gap-4 sm:gap-6">
//                         <div className="flex items-center">
//                             <input id="masterCard" type="radio" name="cardType" value="Master Card" checked={formData.cardType === 'Master Card'} onChange={handleChange} className="h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500" />
//                             <label htmlFor="masterCard" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Master Card</label>
//                         </div>
//                         {/* ... other radio buttons follow the same pattern ... */}
//                     </div>
//                 </div>
                
//                 {/* Authorization Checkbox - Updated for dark mode */}
//                 <div className="flex items-start border-t pt-6 border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center h-5">
//                         <input id="authorization" name="authorization" type="checkbox" checked={formData.authorization} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded" />
//                     </div>
//                     <div className="ml-2 text-xs text-gray-600 dark:text-gray-400">
//                         <label htmlFor="authorization">
//                             I authorize charging my credit card for purchases...
//                         </label>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreditCard;