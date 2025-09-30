// import React, { useState } from 'react';
// import { usePublic } from '../../context/PublicContext';

// const BookADemo = () => {
//     const { submitDemoRequest } = usePublic();

//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phoneNumber: '',
//         emailAddress: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);

//     const handleChange = (e) => {
//         const { id, value } = e.target;
//         const keyMap = {
//             'first-name': 'firstName',
//             'last-name': 'lastName',
//             'phone-number': 'phoneNumber',
//             'email-address': 'emailAddress'
//         };
//         setFormData(prevState => ({
//             ...prevState,
//             [keyMap[id]]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const result = await submitDemoRequest(formData);

//         if (result.success) {
//             setSuccess(true);
//             setFormData({ firstName: '', lastName: '', phoneNumber: '', emailAddress: '' });
//         }

//         setLoading(false);
//     };

//     return (
//         <section className="py-20 bg-gray-50">
//             <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
//                     <h2 className="text-center text-4xl font-serif font-bold text-gray-900">
//                         Book A Demo
//                     </h2>

//                     {success ? (
//                          <div className="text-center py-10">
//                             <h3 className="text-2xl font-bold text-green-600">Request Received!</h3>
//                             <p className="mt-2 text-gray-600">Thank you! Our team will be in touch shortly to schedule your demo.</p>
//                         </div>
//                     ) : (
//                         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//                             <div className="grid sm:grid-cols-2 gap-6">
//                                 <div>
//                                     <label htmlFor="first-name" className="block text-sm font-semibold text-gray-600 mb-1">FIRST NAME</label>
//                                     <input type="text" id="first-name" placeholder="e.g John" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="last-name" className="block text-sm font-semibold text-gray-600 mb-1">LAST NAME</label>
//                                     <input type="text" id="last-name" placeholder="e.g Doe" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-600 mb-1">PHONE NUMBER</label>
//                                 <input type="tel" id="phone-number" placeholder="000 000 000" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
//                             </div>
//                             <div>
//                                 <label htmlFor="email-address" className="block text-sm font-semibold text-gray-600 mb-1">EMAIL ADDRESS</label>
//                                 <input type="email" id="email-address" placeholder="e.g John@mail.com" value={formData.emailAddress} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
//                             </div>
//                             <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400">
//                                 {loading ? 'Booking...' : 'Book Now'} <span>&rarr;</span>
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BookADemo;

















import React, { useState } from 'react';
import { usePublic } from '../../context/PublicContext';
import { Link } from 'react-router-dom';
import InputField from '../../components/Auth/InputField'; // Adjust path to your new InputField component

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


const BookADemo = () => {
    const { submitDemoRequest } = usePublic();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const keyMap = {
            'first-name': 'firstName',
            'last-name': 'lastName',
            'phone-number': 'phoneNumber',
            'email-address': 'emailAddress'
        };
        setFormData(prevState => ({
            ...prevState,
            [keyMap[id]]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await submitDemoRequest(formData);
        if (result.success) {
            setSuccess(true);
            setFormData({ firstName: '', lastName: '', phoneNumber: '', emailAddress: '' });
        }
        setLoading(false);
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
                    <h2 className="text-center text-4xl font-serif font-bold text-gray-900">
                        Book A Demo
                    </h2>

                    {success ? (
                        <SubmissionSuccess
                            title="Request Received!"
                            message="Thank you! Our team will be in touch shortly to schedule your demo."
                        />
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <InputField id="first-name" label="First Name" placeholder="e.g John" value={formData.firstName} onChange={handleChange} required />
                                <InputField id="last-name" label="Last Name" placeholder="e.g Doe" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <InputField id="phone-number" label="Phone Number" placeholder="000 000 000" value={formData.phoneNumber} onChange={handleChange} required />
                            <InputField type="email" id="email-address" label="Email Address" placeholder="e.g John@mail.com" value={formData.emailAddress} onChange={handleChange} required />

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400">
                                {loading ? 'Booking...' : 'Book Now'}
                                {!loading && <span>&rarr;</span>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookADemo;