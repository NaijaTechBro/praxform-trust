import React from 'react';
import featureImage from '../../assets/why.png';

const FeatureItem = ({ title, children, borderColorClass }) => (
  <div className={`border-l-4 ${borderColorClass} pl-6`}>
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-1 text-base text-gray-600">
      {children}
    </p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Column */}
          <div className="flex items-center justify-center">
            <img 
              src={featureImage} 
              alt="PraxForm form editor showing security and theme options" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>

          {/* Text Content Column */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
              Why PraxForm?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Traditional methods like email and PDFs are risky and inefficient. PraxForm offers encrypted, user-friendly digital forms.
            </p>
            
            <div className="mt-10 space-y-8">
              <FeatureItem title="Field-Level Encryption" borderColorClass="border-yellow-400">
                Every sensitive field (like tax IDs or bank details) is protected with military-grade encryption.
              </FeatureItem>

              <FeatureItem title="Compliance by Design" borderColorClass="border-orange-400">
                Meet GDPR, HIPAA, and PCI DSS standards without lifting a finger.
              </FeatureItem>

              <FeatureItem title="Client Confidence" borderColorClass="border-[#1475F4]">
                Branded forms with clear security cues that make users feel safe.
              </FeatureItem>

              <FeatureItem title="Secure File Uploads" borderColorClass="border-green-500">
                Allow clients to upload sensitive documents directly into your form, stored securely in an encrypted vault.
              </FeatureItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;