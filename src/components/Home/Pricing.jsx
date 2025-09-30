import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { usePayments } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Common/Spinner';
import { toast } from 'react-toastify';

const CheckIcon = () => (
    <svg className="h-5 w-5 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { plans, getPublicPlans, createCheckoutSession, loading: plansLoading } = usePayments();
    const [pricingTier, setPricingTier] = useState('annual');
    const [processingPlan, setProcessingPlan] = useState(null);

    useEffect(() => {
        getPublicPlans();
    }, [getPublicPlans]);


    const calculateTimeLeft = () => {
        const difference = +new Date('2025-10-01T00:00:00') - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="text-center">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    {String(timeLeft[interval]).padStart(2, '0')}
                </span>
                <span className="block text-xs uppercase text-gray-500 dark:text-gray-400">{interval}</span>
            </div>
        );
    });

    const handleGetStarted = async (plan) => {
        if (!user) {
            toast.info("Please sign up or sign in to select a plan.");
            navigate('/signup');
            return;
        }
        
        if (plan.price === 0) {
            toast.success("You're already on the Starter plan by signing up!");
            navigate('/dashboard');
            return;
        }
        
        setProcessingPlan(plan.priceId);
        try {
            await createCheckoutSession(plan.priceId);
        } catch (error) {
            console.error("Failed to create checkout session:", error);
        } finally {
            setProcessingPlan(null);
        }
    };

    if (plansLoading && plans.length === 0) {
        return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
    }

    return (
        <>
            <Navbar />
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 pt-20 pb-10 sm:pt-32 sm:pb-16">
                
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                     <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                         Celebrating
                     </h2>
                     <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                         <span className="text-blue-600 dark:text-blue-400">100+</span> Active Users!
                     </h1>
                     <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                         The best time to start with <span className="font-semibold text-gray-800 dark:text-white">PraxForm</span> is now. Secure your license at the current pricing before the new plans go live.
                     </p>
                     <div className="mt-10 flex items-center justify-center space-x-4 sm:space-x-8">
                         {timerComponents.length ? timerComponents.reduce((prev, curr, index) => [prev, <span key={`sep-${index}`} className="text-3xl sm:text-4xl font-light text-gray-400 dark:text-gray-500">:</span>, curr]) : <span>Time's up!</span>}
                     </div>
                     <div className="mt-12 flex justify-center">
                         <div className="relative bg-white dark:bg-gray-700 p-1 rounded-full shadow-md flex items-center">
                             <button onClick={() => setPricingTier('annual')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${pricingTier === 'annual' ? 'bg-gray-900 dark:bg-gray-800 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Annual</button>
                             <button onClick={() => setPricingTier('lifetime')} className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${pricingTier === 'lifetime' ? 'bg-gray-900 dark:bg-gray-800 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Lifetime</button>
                         </div>
                     </div>
                 </div>
             </section>
             
             <section className="bg-white dark:bg-gray-800 pb-16 sm:pb-24">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                         {plans.map((plan) => (
                             <div key={plan.name} className={`rounded-2xl shadow-lg border-2 ${plan.isRecommended ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}>
                                 <div className="p-8">
                                     {plan.isRecommended && (
                                         <div className="text-right mb-4">
                                             <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">Recommended</span>
                                         </div>
                                     )}
                                     <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                                     <p className="mt-4 text-gray-500 dark:text-gray-400 h-20">{plan.description}</p>
                                     <div className="mt-8">
                                         {plan.originalPrice && <span className="text-2xl font-medium text-gray-400 dark:text-gray-500 line-through">{plan.originalPrice}</span>}
                                         <span className="text-5xl font-extrabold text-gray-900 dark:text-white">${plan.price}</span>
                                         <span className="text-base font-medium text-gray-500 dark:text-gray-400 ml-2">{plan.priceDetails}</span>
                                         {plan.monthlyOption && <p className="text-sm text-gray-400 mt-1">{plan.monthlyOption}</p>}
                                     </div>
                                     <button
                                         onClick={() => handleGetStarted(plan)}
                                         disabled={processingPlan !== null}
                                         className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-white transition-colors duration-200 ${plan.isRecommended ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
                                     >
                                         {processingPlan === plan.priceId ? <Spinner /> : 'Get Started'}
                                     </button>
                                 </div>
                                 <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                                     <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">What's included</h4>
                                     <ul className="mt-6 space-y-4">
                                         {plan.features.map((feature) => (
                                             <li key={feature} className="flex items-start">
                                                 <div className="flex-shrink-0"><CheckIcon /></div>
                                                 <p className="ml-3 text-base text-gray-700 dark:text-gray-200">{feature}</p>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="mt-20 p-8 rounded-2xl bg-yellow-100 dark:bg-yellow-400/10 flex flex-col md:flex-row items-center justify-between">
                         <div className="md:pr-8">
                             <h3 className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">100% No-Risk Money Back Guarantee!</h3>
                             <p className="mt-2 text-yellow-800 dark:text-yellow-300">
                                 You are fully protected by our 100% Money Back Guarantee. If you don't like our products over the next 14 days, then we will gladly refund your money. No questions asked!
                             </p>
                         </div>
                         <div className="mt-6 md:mt-0 flex-shrink-0">
                             <img className="h-24 w-24" src="https://cdn.shortpixel.ai/spai/w_408+ret_img/sureforms.com/wp-content/uploads/2024/09/money-back-SF.svg" alt="14 Day Money Back Guarantee" />
                         </div>
                     </div>
                 </div>
             </section>
            <Footer />
        </>
    );
};

export default Pricing;