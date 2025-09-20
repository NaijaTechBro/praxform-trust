
import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import mail from '../../../assets/mailcode.png';
import Header from '../../../components/Auth/Header';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 

const VerifyCode = ({ fromPage }) => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState(''); 
    const inputsRef = useRef([]);
    
    const [email, setEmail] = useState(''); 
    
    const { verifyEmail, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setFormError(error);
        }
        return () => clearError();
    }, [error, clearError]);

    useEffect(() => { 
        inputsRef.current[0]?.focus(); 
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        // Move focus to the next input field if a digit is entered
        if (element.value && inputsRef.current[index + 1]) {
            inputsRef.current[index + 1].focus();
        } else if (!element.value && inputsRef.current[index - 1]) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
       if (e.key === 'Backspace' && !code[index] && inputsRef.current[index - 1]) {
           inputsRef.current[index - 1].focus();
       }
    };

    const handleVerify = async () => {
        setFormError('');
        setFormSuccess(''); // Clear any previous messages
        const codeString = code.join('');

        if (codeString.length !== 6) {
            setFormError('Please enter the full 6-digit code.');
            return;
        }

        try {
            const result = await verifyEmail(codeString);
            if (result.success) {
                setFormSuccess(result.message); 
                setTimeout(() => {
                    if (fromPage === 'createAccount') {
                        navigate('/businessSetup');
                    } else if (fromPage === 'forgotPassword') {
                            navigate(`/resetpassword/${codeString}`); 
                    } else {
                        navigate('/signin'); 
                    }
                }, 1500); 
            } else {
                setFormError(result.message); 
            }
        } catch (err) {
            setFormError('Verification failed. Please check the code and try again.');
        }
    };


    return (
        <>
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl sm:p-12">
                    <div className="text-center">
                        <img src={mail} alt="Mail Icon" className='mx-auto w-24' />
                        <h1 className="text-3xl font-bold text-gray-800">You've Got Mail!</h1>
                        <p className="text-gray-500 mt-2">Please enter the 6-digit code sent to your email.</p>
                        {/* Display the email the code was sent to, if available */}
                        {email && <p className="text-sm text-gray-400 mt-1">to: {email}</p>}
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-center space-x-2 md:space-x-3">
                            {code.map((data, index) => (
                                <input
                                    key={index}
                                    ref={el => inputsRef.current[index] = el}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                        {/* Display success message */}
                        {formSuccess && (
                            <div className="flex items-center text-sm text-green-700 bg-green-100 p-3 rounded-lg justify-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {formSuccess}
                            </div>
                        )}
                        {/* Display error message */}
                        {formError && (
                            <div className="flex items-center text-sm text-red-500 justify-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {formError}
                            </div>
                        )}
                        <button 
                            onClick={handleVerify} 
                            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <div className="text-center text-sm">
                            <span className="text-gray-500">Didn't get the code? </span>
                            <Link 
                                to="/resend-verification" 
                                className="font-semibold text-blue-600 hover:underline inline-flex items-center"
                            >
                                <Send className="w-4 h-4 mr-1" />Resend
                            </Link>
                        </div>
                        <button 
                            onClick={() => navigate('/signin')} 
                            className="w-full py-3 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
                        >
                            Return to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyCode;
