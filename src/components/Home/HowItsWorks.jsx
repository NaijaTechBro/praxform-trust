import React, { useState } from 'react';

// Placeholder images for each step. Replace with your actual image paths.
import step1Image from '../../assets/steps1.png';
import step2Image from '../../assets/steps2.png';
import step3Image from '../../assets/steps3.png';

const steps = [
  { 
    id: 1, 
    title: 'Create An Account', 
    description: 'Create an account for retail and business in less than 2 minutes.',
    image: step1Image
  },
  { 
    id: 2, 
    title: 'Choose Your Industry', 
    description: 'Choose your industry to get tailored form templates.',
    image: step2Image
  },
  { 
    id: 3, 
    title: 'Start Building', 
    description: 'Start building your first secure form with our intuitive drag-and-drop editor. No coding required.',
    image: step3Image
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Steps */}
          <div className="relative">
            {/* The vertical connector line */}
            <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-gray-200" aria-hidden="true"></div>
            
            <div className="flex flex-col gap-y-12">
              {steps.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <div 
                    key={step.id} 
                    className="relative flex items-start gap-x-5 cursor-pointer"
                    onMouseEnter={() => setActiveStep(step.id)}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 z-10"
                         style={{ 
                           backgroundColor: isActive ? '#1475F4' : '#FFFFFF',
                           border: isActive ? 'none' : '2px solid #D1D5DB'
                         }}
                    >
                      <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-[#5F80A0]'}`}>
                        {step.id}
                      </span>
                    </div>
                    
                    <div className="pt-1">
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </h3>
                      <p className={`mt-1 transition-colors duration-300 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Column: Visualizer */}
          <div className="flex items-center justify-center p-8 rounded-3xl min-h-[500px]" style={{ backgroundColor: '#62A3F8' }}>
            <div className="w-full max-w-sm">
                <img 
                    src={activeStepData.image} 
                    alt={activeStepData.title}
                    className="rounded-xl shadow-2xl"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;