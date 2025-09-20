import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../components/Auth/InputField';
import PasswordCriteria from '../../../components/Auth/PasswordCriteria';
import Header from '../../../components/Auth/Header';
import google from '../../../assets/google.svg';

const CreateAccount = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { googleAuth, loading } = useAuth();

    // REVERTED: Simplified Google success handler
    const handleGoogleSuccess = async (codeResponse) => {
        const result = await googleAuth(codeResponse.code);
        
        if (result.success) {
            toast.success("Welcome! Your account has been created successfully.");
            navigate('/dashboard');
        } else {
            toast.error(result.message || "Google sign-up failed.");
        }
    };

    const handleGoogleError = (error) => {
        console.error("Google Login Failed:", error);
        toast.error("Google sign-up failed. Please try again.");
    };

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });
    
    useEffect(() => {
        const storedData = localStorage.getItem('tempUserData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setEmail(userData.email || '');
            setPassword(userData.password || '');
        }
    }, []);
    
    const validateForm = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
        if (!lastName.trim()) newErrors.lastName = 'Last Name is required.';

        if (!email.trim()) {
            newErrors.email = 'Email Address is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email Address is invalid.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        } else if (!/\d/.test(password)) {
            newErrors.password = 'Password must contain at least one number.';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
            newErrors.password = 'Password must contain a special character.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e) => {
        e.preventDefault(); 
        if (validateForm()) { 
            const userData = { firstName, lastName, email, password };
            localStorage.setItem('tempUserData', JSON.stringify(userData)); 
            navigate('/business-setup'); 
        }
    };

    const isPasswordValid = !errors.password && password.length > 0 &&
                                /\d/.test(password) &&
                                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) && 
                                password.length >= 8;

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full py-4 max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Let's Get Started</h1>
                        <p className="mt-2 text-sm text-gray-600">Create an account to continue.</p>
                    </div>

                    <div className="space-y-6">
                        <button 
                            onClick={() => loginWithGoogle()}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
                        >
                            <img src={google} alt="Google Logo" className="w-5 h-5 mr-3" />
                            <span className="font-semibold text-gray-700">{loading ? 'Processing...' : 'Continue with Google'}</span>
                        </button>
                        
                        <div className="flex items-center">
                            <hr className="w-full border-gray-300" />
                            <span className="px-4 text-sm font-medium text-gray-500">OR</span>
                            <hr className="w-full border-gray-300" />
                        </div>
                        
                        <form onSubmit={handleNext} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InputField
                                    id="firstName"
                                    label="First Name"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    hasError={!!errors.firstName}
                                    isValid={!errors.firstName && firstName.trim().length > 0}
                                />
                                <InputField
                                    id="lastName"
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    hasError={!!errors.lastName}
                                    isValid={!errors.lastName && lastName.trim().length > 0}
                                />
                            </div>
                            
                            <InputField
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="johndoe@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                hasError={!!errors.email}
                                isValid={!errors.email && email.trim().length > 0 && /\S+@\S+\.\S+/.test(email)}
                            />
                            
                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                hasError={!!errors.password}
                                isValid={isPasswordValid}
                            />
                            
                            <PasswordCriteria password={password} />
                            
                            <button type="submit" className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                Next
                            </button>
                        </form>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/signin" className="font-semibold text-blue-600 hover:underline">Sign In</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAccount;