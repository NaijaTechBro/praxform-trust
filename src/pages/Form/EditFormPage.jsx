import React, { useState } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiEye, FiSend, FiPlus, FiSettings, FiArrowLeft } from 'react-icons/fi';

// Import all required components
import FormFieldsSidebar from '../../components/NewForm/FormFieldsSidebar';
import ElementPropertiesSidebar from '../../components/NewForm/ElementPropertiesSidebar';
import FormPropertiesSidebar from '../../components/NewForm/FormPropertiesSidebar';
import FormBuilderArea from '../../components/NewForm/FormBuilderArea';
import FormPreviewModal from '../../components/NewForm/FormPreviewModal';
import SendFormModal from '../../components/NewForm/SendFormModal';
import Spinner from '../../components/Common/Spinner';

const EditFormPage = () => {
    // 1. Get ALL props from the hook into a single object
    const formBuilderProps = useFormBuilder('edit');
    const { formId, formName, selectedElement, status, isSaving, isLoading } = formBuilderProps;
    
    const navigate = useNavigate();
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            {/* ... (UI elements like sidebars and buttons remain the same) ... */}
            <div className="absolute top-4 left-4 z-50"><button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><FiPlus className={`transition-transform duration-300 ${isLeftSidebarOpen ? 'transform rotate-45' : ''}`} /></button></div>
            <div className="absolute top-4 right-4 z-50"><button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><FiSettings /></button></div>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><FormFieldsSidebar /></div>
            
            <div className={`flex-1 flex flex-col p-6 transition-all duration-300 ${isLeftSidebarOpen ? 'ml-64' : 'ml-0'} ${isRightSidebarOpen ? 'mr-80' : 'mr-0'}`}>
                <div className="flex-none mb-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 py-3 rounded-lg shadow-sm">
                    <button onClick={() => navigate('/forms')} className="p-2 mr-3 text-gray-500 rounded-full hover:bg-gray-100"><FiArrowLeft size={22} /></button>
                    <input type="text" className="text-xl font-semibold text-gray-800 dark:text-gray-100 bg-transparent outline-none" value={formName} onChange={(e) => formBuilderProps.setFormName(e.target.value)} />
                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">{status}</span>
                        <button onClick={() => setShowPreviewModal(true)} className="flex items-center text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"><FiEye className="mr-2" /> Preview</button>
                        <button onClick={formBuilderProps.handleSave} disabled={isSaving} className="flex items-center text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">{isSaving ? 'Saving...' : <><FiSave className="mr-2"/> Save Form</>}</button>
                        <button onClick={() => setShowSendModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"><FiSend className="mr-2"/> Send Form</button>
                    </div>
                </div>

                {/* 2. Spread ALL props directly into the component */}
                <FormBuilderArea {...formBuilderProps} />

            </div>

            <div className={`fixed inset-y-0 right-0 z-40 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-transform duration-300 ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedElement ? (
                    <ElementPropertiesSidebar selectedElement={selectedElement} onUpdate={formBuilderProps.handleUpdateElement} />
                ) : (
                    <FormPropertiesSidebar
                        formName={formName} setFormName={formBuilderProps.setFormName}
                        formDescription={formBuilderProps.formDescription} setFormDescription={formBuilderProps.setFormDescription}
                        headerImageUrl={formBuilderProps.headerImage?.url} onHeaderImageUpload={formBuilderProps.handleHeaderImageUpload}
                        watermarkImageUrl={formBuilderProps.watermarkImage?.url} onWatermarkImageUpload={formBuilderProps.handleWatermarkImageUpload}
                        formId={formId}
                    />
                )}
            </div>

            <FormPreviewModal show={showPreviewModal} onClose={() => setShowPreviewModal(false)} {...formBuilderProps} />
            <SendFormModal show={showSendModal} onClose={() => setShowSendModal(false)} formId={formId} formName={formName} />
        </div>
    );
};

export default EditFormPage;