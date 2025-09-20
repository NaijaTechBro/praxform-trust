import React, { useEffect } from 'react';
import { useForms } from '../../context/FormContext';
import FormBuilderArea from '../../components/NewForm/FormBuilderArea';
import { useNavigate } from 'react-router-dom';

const NewFormPage = () => {
  const { currentForm, clearCurrentForm } = useForms();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentForm) {
      clearCurrentForm();
    }
  }, [currentForm, clearCurrentForm]);

  const handleStartFromScratch = () => {
    navigate('/forms/new'); 
  };

  const handleUseTemplate = () => {
    navigate('/templates');
  };

  return (
    // This page seems to have its own layout, so we theme it directly
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="flex-1 flex flex-col">
        {/* Header Section - Updated for dark mode */}
        <div className="flex-none p-6 pb-2">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 py-3 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 md:text-2xl whitespace-nowrap">Create New Form</h1>
          </div>
        </div>

        {/* Scrollable Area - Updated for dark mode */}
        <div className="flex-1 p-6 pt-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {/* NOTE: You will also need to apply dark mode styles inside the
            <FormBuilderArea /> component for the theme to be complete.
          */}
          <FormBuilderArea
            formFields={[]} 
            onStartFromScratch={handleStartFromScratch}
            onUseTemplate={handleUseTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default NewFormPage;