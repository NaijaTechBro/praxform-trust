import React, { useState } from 'react';
import { usePublic } from '../../../context/PublicContext';
import { Link } from 'react-router-dom';
import InputField from '../../../components/Auth/InputField';

// Reusable Success Message Component
const SubmissionSuccess = ({ title, message }) => (
    <div className="text-center py-10 px-6 flex flex-col items-center">
        <div className="text-6xl mb-4">💐</div>
        <h3 className="text-2xl font-bold text-green-600">{title}</h3>
        <p className="mt-2 text-gray-600 max-w-sm">{message}</p>
        <Link
            to="/"
            className="mt-8 inline-block bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
        >
            Go Back Home
        </Link>
    </div>
);

const ContactInfoItem = ({ label, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-start">
        <dt className="w-24 flex-shrink-0 text-sm font-semibold uppercase text-gray-500">{label}</dt>
        <dd className="mt-1 sm:mt-0 text-gray-800 text-lg">{children}</dd>
    </div>
);


const Contact = () => {
    const { submitContactForm } = usePublic();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        additionalInformation: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const keyMap = {
            'first-name': 'firstName',
            'last-name': 'lastName',
            'phone-number': 'phoneNumber',
            'email': 'email',
            'additional-information': 'additionalInformation'
        };
        setFormData(prevState => ({
            ...prevState,
            [keyMap[id]]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await submitContactForm(formData);
        if (result.success) {
            setSuccess(true);
            setFormData({
                firstName: '', lastName: '', phoneNumber: '', email: '', additionalInformation: ''
            });
        }
        setLoading(false);
    };

    return (
        <section id="contact" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div className="pt-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif">
                            Get In Touch.
                        </h2>
                        <dl className="mt-12 space-y-8">
                            <ContactInfoItem label="Email">
                                <a href="mailto:contact@praxform.com" className="hover:text-[#1475F4]">contact@praxform.com</a>
                            </ContactInfoItem>
                            <ContactInfoItem label="Phone">
                                <a href="tel:+19012345678" className="hover:text-[#1475F4]">+1 (901) 2345 678</a>
                            </ContactInfoItem>
                            <ContactInfoItem label="Socials">
                                <div className="flex flex-col space-y-2">
                                    <a href="#" className="hover:text-[#1475F4]">Instagram</a>
                                    <a href="#" className="hover:text-[#1475F4]">Twitter/X</a>
                                    <a href="#" className="hover:text-[#1475F4]">LinkedIn</a>
                                </div>
                            </ContactInfoItem>
                        </dl>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                        {success ? (
                            <SubmissionSuccess
                                title="Message Sent!"
                                message="Thank you for reaching out. We'll review your message and get back to you soon."
                            />
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <InputField id="first-name" label="First Name" placeholder="e.g John" value={formData.firstName} onChange={handleChange} required />
                                    <InputField id="last-name" label="Last Name" placeholder="e.g Doe" value={formData.lastName} onChange={handleChange} required />
                                </div>
                                <InputField id="phone-number" label="Phone Number" placeholder="000 000 000" value={formData.phoneNumber} onChange={handleChange} />
                                <InputField type="email" id="email" label="Email Address" placeholder="e.g John@mail.com" value={formData.email} onChange={handleChange} required />

                               
                                <InputField
                                    as="textarea"
                                    id="additional-information"
                                    label="Additional Information"
                                    rows="4"
                                    placeholder="We are happy to hear about your enquiries."
                                    value={formData.additionalInformation}
                                    onChange={handleChange}
                                />

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#1475F4] hover:bg-[#1268DA] transition-colors disabled:bg-gray-400"
                                    >
                                        {loading ? 'Sending...' : 'Submit Message'}
                                        {!loading && <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;