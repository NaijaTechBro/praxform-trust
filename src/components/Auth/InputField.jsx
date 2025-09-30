import React, { useState } from 'react';

const InputField = ({ id, label, hasError, isValid, ...props }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const originalType = props.type || 'text';

    // This logic remains to control the color of the input border
    const borderClasses = hasError
        ? 'border-red-500 focus:ring-red-500'
        : isValid
        ? 'border-green-500 focus:ring-green-500'
        : 'border-gray-300 focus:ring-blue-500';

    return (
        <div className="space-y-1">
            {label && <label htmlFor={id} className="block text-sm font-semibold text-gray-700">{label}</label>}
            <div className="relative">
                <input
                    id={id}
                    {...props}
                    type={isPasswordVisible ? 'text' : originalType}
                    className={`w-full py-3 px-4 ${originalType === 'password' ? 'pr-10' : ''} rounded-lg border text-gray-800 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:border-transparent transition
                        ${borderClasses}`}
                />

                {originalType === 'password' && (
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {isPasswordVisible
                            ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.749 9.749 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                    </button>
                )}
            </div>
            {hasError && <p className="text-red-500 text-xs mt-1">{hasError}</p>}
        </div>
    );
};

export default InputField;