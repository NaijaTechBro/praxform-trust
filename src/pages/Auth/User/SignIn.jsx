import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../components/Auth/InputField';
import Header from '../../../components/Auth/Header';
import google from '../../../assets/google.svg';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    const { login, loginWithGoogle, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!email || !password) {
            setLocalError('Please enter both email and password.');
            return;
        }
        
        const result = await login({ email, password });
        
       if (result.success && !result.mfaRequired) {
            toast.success("Login successful!");
            navigate('/dashboard', { replace: true });
        } else if (!result.success) {
            setLocalError(result.message || 'An unknown error occurred.');
        }
    }; 

    if (user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                Redirecting...
            </div>
        );
    }
    
    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12 my-16">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sign In to Your Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Welcome back! Please enter your details.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <button
                            onClick={() => loginWithGoogle()}
                            className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            disabled={loading}
                        >
                            <img src={google} alt="Google Logo" className="w-5 h-5 mr-3" />
                            <span className="font-semibold text-gray-700">{loading ? 'Redirecting...' : 'Continue with Google'}</span>
                        </button>

                        <div className="flex items-center">
                            <hr className="w-full border-gray-300" />
                            <span className="px-4 text-sm font-medium text-gray-500">OR</span>
                            <hr className="w-full border-gray-300" />
                        </div>
                        
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <InputField 
                                id="email" 
                                label="Email Address" 
                                type="email" 
                                placeholder="yourmail@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            
                            <InputField 
                                id="password" 
                                label="Password" 
                                type="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            
                            <div className="flex items-center justify-between text-sm mt-4">
                                <div className="flex items-center">
                                    <input type="checkbox" id="rememberMe" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="rememberMe" className="ml-2 text-gray-700">Remember Me</label>
                                </div>
                                <a href="/forgot-password" className="font-semibold text-blue-600 hover:underline">
                                    Forgot Password?
                                </a>
                            </div>
                            
                            {localError && (
                                <p className="text-red-500 text-sm text-center mt-4">{localError}</p>
                            )}
                            
                            <button 
                                type="submit"
                                className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition mt-6"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href='/signup' className="font-semibold text-blue-600 hover:underline">
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;