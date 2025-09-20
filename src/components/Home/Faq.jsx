import React, { useState } from 'react';

const faqsList = [
  { 
    question: "What is PraxForm?", 
    answer: "PraxForm is a secure, user-friendly platform that helps businesses create branded digital forms to collect client information efficiently, eliminating paper trails and compliance headaches." 
  },
  { 
    question: "How secure is PraxForm?", 
    answer: "Security is our top priority. PraxForm uses military-grade, field-level encryption for all sensitive data. We are compliant with GDPR, HIPAA, and PCI DSS standards to ensure your data is always protected." 
  },
  { 
    question: "What kind of information can I collect?", 
    answer: "You can collect a wide range of information, from basic contact details to sensitive data like tax IDs, bank account numbers, and file uploads. Our secure environment is built to handle it all." 
  },
  { 
    question: "Can I customize the forms to match my brand?", 
    answer: "Absolutely. You can add your logo, choose brand colors, and customize the layout to create a seamless and trustworthy experience for your clients." 
  },
  { 
    question: "Who is PraxForm for?", 
    answer: "PraxForm is designed for any business or professional that needs to collect information from clients, including financial advisors, accountants, legal firms, healthcare providers, and more." 
  },
  { 
    question: "What if I need help?", 
    answer: "We offer comprehensive support through our help center, email, and live chat for users on our premium plans. We're here to ensure you get the most out of PraxForm." 
  }
];

const FaqItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200/80">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-start justify-between text-left py-6"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-x-5">
            <span className="text-xl font-medium text-gray-400">
                {(index + 1).toString().padStart(2, '0')}
            </span>
            <h4 className={`text-lg font-medium transition-colors ${isOpen ? 'text-[#1475F4]' : 'text-gray-900'}`}>
                {faq.question}
            </h4>
        </div>
        <div className="flex-shrink-0 ml-4">
          <svg 
            className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div 
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <p className="pb-6 pl-12 text-gray-600 leading-relaxed">
                {faq.answer}
            </p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  return (
    <section id="faqs" className="py-20 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className=" text-gray-500">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 font-serif">
            Got Questions? <br/> We've Got Answers!
          </h2>
        </div>
        <div className="mt-12">
          {faqsList.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* --- CTA Block ---
        <div className="mt-16 text-center p-8 bg-gray-50 rounded-lg border">
            <h3 className="text-2xl font-bold text-gray-900">Still have questions?</h3>
            <p className="mt-2 text-gray-600">
                Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a 
                href="#contact" 
                className="mt-6 inline-block bg-[#1475F4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1268DA] transition-colors"
            >
                Contact Support
            </a>
        </div> */}
      </div>
    </section>
  );
};

export default Faq;