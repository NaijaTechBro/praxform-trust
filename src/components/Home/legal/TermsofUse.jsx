import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import Navbar from '../Navbar';

const TermsOfUse = () => {
    // Structure the Terms of Service content
    const termsContent = [
        {
            id: 'account',
            title: '1. Your Account',
            content: <p>You must be at least 18 years old to use the Service. You are responsible for maintaining the security of your account, including your password. You must notify us immediately of any unauthorized use of your account.</p>
        },
        {
            id: 'service',
            title: '2. The Service',
            content: <p>We grant you a limited, non-exclusive, non-transferable right to access and use the Service according to the plan you have subscribed to. We reserve the right to modify or discontinue the Service at any time.</p>
        },
        {
            id: 'responsibilities',
            title: '3. Customer Data and Responsibilities',
            content: (
                <>
                    <ul className="list-disc space-y-2 pl-5 mt-4">
                        <li><strong>Your Data:</strong> You retain all ownership rights to the data, information, and files you collect through the forms you create ("Submission Data").</li>
                        <li><strong>Your Responsibilities:</strong> You are solely responsible for your Submission Data and your compliance with all applicable laws and regulations, including HIPAA and GLBA. You represent and warrant that you have all necessary rights and consents to collect, use, and share your Submission Data.</li>
                        <li><strong>Acceptable Use:</strong> You agree not to use the Service to collect, store, or transmit any data that is unlawful, harmful, defamatory, or infringes on the rights of any third party. You may not use the Service for any purpose that violates US export controls or sanctions.</li>
                    </ul>
                </>
            )
        },
        {
            id: 'payment',
            title: '4. Fees and Payment',
            content: <p>You agree to pay all fees associated with your subscription plan. All payments are handled by our third-party payment processor, Stripe. Subscriptions are billed in advance on a recurring basis and are non-refundable, except as required by law. We reserve the right to change our prices with prior notice.</p>
        },
        {
            id: 'ip',
            title: '5. Intellectual Property',
            content: <p>The Service, including its software, branding, and content, is the exclusive property of Praxform, Inc. and its licensors. You may not copy, modify, or reverse engineer any part of the Service.</p>
        },
        {
            id: 'confidentiality',
            title: '6. Confidentiality',
            content: <p>We will treat your Customer Data as confidential and will only use it in accordance with our Privacy Policy. You agree to treat any non-public information we provide to you about the Service as confidential.</p>
        },
        {
            id: 'termination',
            title: '7. Term and Termination',
            content: <p>These Terms are effective until your subscription is terminated. You may terminate your subscription at any time. We may suspend or terminate your access to the Service if you breach these Terms. Upon termination, your right to use the Service will cease immediately, and we may delete your data in accordance with our data retention policies.</p>
        },
        {
            id: 'warranties',
            title: '8. Disclaimer of Warranties',
            content: <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.</p>
        },
        {
            id: 'liability',
            title: '9. Limitation of Liability',
            content: <p>TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL PRAXFORM, INC. BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, ARISING OUT OF YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
        },
        {
            id: 'law',
            title: '10. Governing Law',
            content: <p>These Terms shall be governed by the laws of the State of Delaware and the United States, without regard to its conflict of law provisions.</p>
        },
        {
            id: 'changes',
            title: '11. Changes to Terms',
            content: <p>We may modify these Terms at any time. We will provide notice of significant changes. By continuing to use the Service after changes become effective, you agree to be bound by the revised Terms.</p>
        },
        {
            id: 'contact',
            title: '12. Contact Us',
            content: (
                <address className="not-italic mt-4 text-gray-600 dark:text-gray-300">
                    Praxform, Inc.<br />
                    [Your US Virtual Address from Stripe Atlas]<br />
                    <a href="mailto:legal@praxform.com" className="text-blue-600 hover:underline">legal@praxform.com</a>
                </address>
            )
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-blue-900 dark:bg-gray-800 text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms of Service</h1>
                    <p className="text-blue-200 dark:text-gray-400">Last Updated: September 20, 2025</p>
                </section>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">Table of Contents</h3>
                            <nav>
                                <ul className="space-y-2">
                                    {termsContent.map(section => (
                                        <li key={section.id}>
                                            <a href={`#${section.id}`} className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{section.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                    <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Welcome to Praxform. These Terms of Service ("Terms") govern your use of our secure form and submission management platform (the "Service"). By creating an account or using the Service, you agree to these Terms.</p>
                        {termsContent.map(section => (
                            <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{section.title}</h2>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">{section.content}</div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUse;