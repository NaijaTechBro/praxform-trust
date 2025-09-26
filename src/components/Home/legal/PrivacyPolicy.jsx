import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer'


const PrivacyPolicy = () => {
    const policyContent = [
        {
            id: 'customer-data',
            title: '1. Customer Data: Information We Collect',
            content: (
                <>
                    <p>When you register for an account, use our Service, or communicate with us, we collect information directly from you.</p>
                    <ul className="list-disc space-y-2 pl-5 mt-4">
                        <li><strong>Account Information:</strong> Your name, email address, password, and contact information.</li>
                        <li><strong>Organization Information:</strong> Your organization's name, industry, address, phone number, and other details you provide.</li>
                        <li><strong>Payment Information:</strong> Billing details, credit card information, and transaction history, which are securely processed by our payment processor, Stripe. We do not store your full credit card information on our servers.</li>
                        <li><strong>Technical & Usage Data:</strong> IP address, browser type, operating system, and usage patterns within our Service.</li>
                    </ul>
                </>
            )
        },
        {
            id: 'submission-data',
            title: '2. Submission Data: Information You Collect via Forms',
            content: (
                <>
                    <p><strong>Our Role:</strong> You, our customer, are the "Data Controller" of the information you collect through the forms you build. This means you determine what data is collected and how it is used. We act solely as a "Data Processor" on your behalf.</p>
                    <p><strong>End-to-End Encryption:</strong> All data submitted through your forms is end-to-end encrypted. We cannot and do not access, view, or use the content of your Submission Data, except as strictly necessary to provide and maintain the Service (e.g., storing the encrypted data). The decryption key is managed by you.</p>
                    <p><strong>Your Responsibility:</strong> You are solely responsible for ensuring that your collection and use of Submission Data comply with all applicable laws and regulations, including but not limited to HIPAA, GLBA, and GDPR.</p>
                </>
            )
        },
        {
            id: 'data-usage',
            title: '3. How We Use Your Data',
            content: (
                <>
                    <p>We use <strong>Customer Data</strong> to:</p>
                    <ul className="list-disc space-y-2 pl-5 mt-4">
                        <li>Provide, maintain, and improve the Service.</li>
                        <li>Process payments and manage your account.</li>
                        <li>Communicate with you about service updates, security alerts, and support messages.</li>
                        <li>Enforce our terms and prevent fraudulent activity.</li>
                    </ul>
                    <p className="mt-4">We <strong>do not</strong> use your <strong>Submission Data</strong> for any purpose other than storing it in an encrypted format on your behalf.</p>
                </>
            )
        },
        {
            id: 'data-sharing',
            title: '4. How We Share Your Data',
            content: (
                <>
                    <p>We do not sell your data. We may share information with third-party service providers ("sub-processors") who help us operate our Service, such as:</p>
                    <ul className="list-disc space-y-2 pl-5 mt-4">
                        <li><strong>Cloud Hosting:</strong> Render for data storage and application hosting.</li>
                        <li><strong>Payment Processing:</strong> Stripe for handling payments.</li>
                        <li><strong>File Storage:</strong> Cloudinary for storing file uploads associated with your account or submissions.</li>
                        <li><strong>Email Services:</strong> [e.g., SendGrid, Mailgun] for sending transactional emails.</li>
                    </ul>
                    <p className="mt-4">We maintain a list of our sub-processors and ensure they adhere to strict data security and privacy standards.</p>
                </>
            )
        },
        {
            id: 'data-security',
            title: '5. Data Security',
            content: <p>We implement robust technical and organizational measures designed to protect the security of your data. These include end-to-end encryption for Submission Data, secure access controls, and detailed audit logging. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
        },
        {
            id: 'data-retention',
            title: '6. Data Retention',
            content: <p>We retain Customer Data for as long as your account is active or as needed to comply with our legal obligations. You control the retention of your Submission Data and can delete it at any time.</p>
        },
        {
            id: 'your-rights',
            title: '7. Your Rights',
            content: <p>You have rights regarding your personal information, including the right to access, correct, or delete your Customer Data. Please contact us to exercise these rights. Requests regarding Submission Data should be directed to the customer who created the form.</p>
        },
        {
            id: 'international-transfers',
            title: '8. International Data Transfers',
            content: <p>Your information may be transferred to, and maintained on, computers located outside of your state, province, or country. By using the Service, you consent to this transfer.</p>
        },
        {
            id: 'changes-policy',
            title: '9. Changes to This Policy',
            content: <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        },
        {
            id: 'contact-us',
            title: '10. Contact Us',
            content: (
                <>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <address className="not-italic mt-4 text-gray-600 dark:text-gray-300">
                        {/* Remember to replace these with your actual details from Stripe Atlas */}
                        Praxform, Inc.<br />
                        [Your US Virtual Address]<br />
                        <a href="mailto:privacy@praxform.com" className="text-blue-600 hover:underline">privacy@praxform.com</a>
                    </address>
                </>
            )
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-blue-900 dark:bg-gray-800 text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
                    <p className="text-blue-200 dark:text-gray-400">Last Updated: September 20, 2025</p>
                </section>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">Table of Contents</h3>
                            <nav>
                                <ul className="space-y-2">
                                    {policyContent.map(section => (
                                        <li key={section.id}>
                                            <a 
                                                href={`#${section.id}`} 
                                                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>

                    <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            This Privacy Policy describes how Praxform, Inc. ("we," "us," or "our") collects, uses, and discloses information in connection with the operation of our secure form and submission management platform (the "Service"). This policy is divided into two parts: information we collect from our direct customers ("Customer Data") and information our customers collect through the forms they create ("Submission Data").
                        </p>

                        {policyContent.map(section => (
                            <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{section.title}</h2>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;