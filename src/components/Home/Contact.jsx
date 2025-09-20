import React from 'react';

// A reusable input component to keep the form DRY and clean
const FormInput = ({ id, label, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      className="mt-2 block w-full bg-transparent border-0 border-b-2 border-gray-200 p-0 focus:ring-0 focus:border-[#1475F4] transition-colors"
      placeholder={placeholder}
    />
  </div>
);

// A reusable component for contact info items
const ContactInfoItem = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start">
    <dt className="w-24 flex-shrink-0 text-sm font-semibold uppercase text-gray-500">{label}</dt>
    <dd className="mt-1 sm:mt-0 text-gray-800 text-lg">{children}</dd>
  </div>
);


const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="pt-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif">
              Get In Touch.
            </h2>
            <dl className="mt-12 space-y-8">
              <ContactInfoItem label="Email">
                <a href="mailto:info@mesiot.com" className="hover:text-[#1475F4]">info@mesiot.com</a>
              </ContactInfoItem>
              <ContactInfoItem label="Phone">
                <a href="tel:+2349012345678" className="hover:text-[#1475F4]">+2349012345678</a>
              </ContactInfoItem>
              <ContactInfoItem label="Socials">
                <div className="flex flex-col space-y-2">
                  <a href="#" className="hover:text-[#1475F4]">Instagram</a>
                  <a href="#" className="hover:text-[#1475F4]">Twitter/X</a>
                  <a href="#" className="hover:text-[#1475F4]">Linked-in</a>
                </div>
              </ContactInfoItem>
            </dl>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
            <form action="#" method="POST" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <FormInput id="first-name" label="First Name" placeholder="e.g John" />
                <FormInput id="last-name" label="Last Name" placeholder="e.g Doe" />
              </div>

              <FormInput id="phone-number" label="Phone Number" placeholder="000 000 000" />
              <FormInput id="email" label="Email Address" type="email" placeholder="e.g John@mail.com" />

              <div>
                <label htmlFor="additional-information" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additional-information"
                  name="additional-information"
                  rows={4}
                  className="mt-2 block w-full bg-transparent border-0 border-b-2 border-gray-200 p-0 focus:ring-0 focus:border-[#1475F4] transition-colors"
                  placeholder="We are happy to hear about your enquiries."
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#1475F4] hover:bg-[#1268DA] transition-colors"
                >
                  Submit Message
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;