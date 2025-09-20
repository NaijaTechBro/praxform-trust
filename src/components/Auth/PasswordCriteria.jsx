import React from 'react';

const PasswordCriteria = ({ password }) => {
    const isEightChars = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const hasOneNumber = /\d/.test(password);

    const ShieldCheckIcon = ({ condition }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-shield-check h-4 w-4 mr-2 ${condition ? 'text-green-500' : 'text-gray-500'}`}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            {condition && <path d="m9 12 2 2 4-4"/>}
        </svg>
    );

    return (
        <ul className="space-y-2 text-sm text-gray-500 mt-4">
            <li className={`flex items-center ${isEightChars ? 'text-green-500' : 'text-gray-500'}`}>
                <ShieldCheckIcon condition={isEightChars} /> Eight Characters Long
            </li>
            <li className={`flex items-center ${hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                <ShieldCheckIcon condition={hasSpecialChar} /> Contain Special Characters (&, #, $, etc)
            </li>
            <li className={`flex items-center ${hasOneNumber ? 'text-green-500' : 'text-gray-500'}`}>
                <ShieldCheckIcon condition={hasOneNumber} /> Contain One Number
            </li>
        </ul>
    );
};
export default PasswordCriteria;