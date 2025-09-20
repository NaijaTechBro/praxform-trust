import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../../components/Dashboard/TemplateCard'; 
import { useTemplates } from '../../context/TemplateContext'; 
import { FaSearch } from 'react-icons/fa'; 

const Templates = () => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Templates');
    const { templates, loading, error, getTemplates, clearError } = useTemplates();
    const navigate = useNavigate();

    // This logic does not need to change for theming
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Financial': case 'payment': return 'green';
            case 'Legal': return 'yellow';
            case 'Tax': return 'blue';
            case 'Onboarding': return 'red';
            case 'consent': return 'purple';
            case 'survey': return 'orange';
            default: return 'gray';
        }
    };

    useEffect(() => {
        getTemplates();
    }, [getTemplates]);

    
    // Handle errors from the template context
    useEffect(() => {
        if (error) {
            console.error("Templates Page Error:", error);
            clearError();
        }
    }, [error, clearError])

    const categories = ['All Templates', ...new Set(templates.map(t => t.category).filter(Boolean))];
    
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = activeFilter === 'All Templates' || template.category === activeFilter;
        return matchesSearch && matchesFilter;
    }).map(template => ({
        ...template,
        derivedIconColor: getCategoryColor(template.category)
    }));

    const handleSelectTemplate = (template) => {
        navigate(`/forms/new/template/${template._id}`);
    };

    return (
        // Layout classes removed, as this page is rendered inside Layout.js
        <div>
            {/* Main card updated for dark mode */}
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">All Templates</h3>
                    <div className="relative flex-grow md:max-w-xs mb-4 md:mb-0">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                            <FaSearch size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search templates"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Search input updated for dark mode
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(filter => (
                        <button
                            key={filter}
                            className={`
                                px-3 py-1.5 rounded-lg font-medium transition-colors border text-sm
                                ${activeFilter === filter
                                    ? 'bg-blue-600 text-white border-blue-600' // Active state is fine
                                    // Inactive state updated for dark mode
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Loading/Error/No results text updated for dark mode */}
                {loading && <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">Loading templates...</div>}
                {error && <div className="col-span-full text-center py-10 text-red-500">Error loading templates: {error}</div>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map(template => (
                                <TemplateCard
                                    key={template._id}
                                    template={template}
                                    onUse={() => handleSelectTemplate(template)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                                No templates found for this category or search term.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Templates;