import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CookiePolicy = () => {
    const policyContent = [
        {
            id: 'what-are-cookies',
            title: '1. What Are Cookies?',
            content: <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
        },
        {
            id: 'how-we-use',
            title: '2. How We Use Cookies',
            content: (
                <>
                    <p>We use cookies for several purposes. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our properties. We categorize our cookies as follows:</p>
                    <ul className="list-disc space-y-2 pl-5 mt-4">
                        <li><strong>Strictly Necessary Cookies:</strong> These are essential for you to browse the Service and use its features, such as accessing secure areas of the site.</li>
                        <li><strong>Performance Cookies:</strong> These cookies collect information about how you use our Service, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions.</li>
                        <li><strong>Functional Cookies:</strong> These cookies allow our website to remember choices you have made in the past, like what language you prefer or your user name and password so you can automatically log in.</li>
                        <li><strong>Marketing Cookies:</strong> These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.</li>
                    </ul>
                </>
            )
        },
        {
            id: 'your-choices',
            title: '3. Your Choices Regarding Cookies',
            content: (
                <>
                    <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
                    <p>As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.</p>
                </>
            )
        },
        {
            id: 'changes',
            title: '4. Changes to This Cookie Policy',
            content: <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
        },
        {
            id: 'contact',
            title: '5. Contact Us',
            content: (
                <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@praxform.com" className="text-blue-600 hover:underline">privacy@praxform.com</a>.</p>
            )
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="bg-blue-900 dark:bg-gray-800 text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Cookie Policy</h1>
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
                                            <a href={`#${section.id}`} className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{section.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                    <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
                        {policyContent.map(section => (
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

export default CookiePolicy;