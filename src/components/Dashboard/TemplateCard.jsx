import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';

const TemplateCard = ({ template, onUse }) => { 
  if (!template) {
    return null; 
  }

  // This function is now updated to be dark mode aware
  const getBgColorClass = (color) => {
    switch(color) {
      case 'green': return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400';
      case 'yellow': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400';
      case 'blue': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400';
      case 'red': return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400';
      case 'purple': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'; 
      case 'orange': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'; 
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const cardIconColor = template.derivedIconColor || 'gray'; 

  return (
    // Updated for dark mode
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-between">
      <div className="p-4 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-md ${getBgColorClass(cardIconColor)} flex items-center justify-center`}>
              <FileText size={16} />
            </div>
            {/* Updated for dark mode */}
            <h5 className="ml-2 font-semibold text-sm text-gray-800 dark:text-gray-100">{template.name}</h5>
          </div>
          {/* Updated for dark mode */}
          <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -mt-1 -mr-1">
            <MoreVertical size={18} />
          </button>
        </div>
        {/* Updated for dark mode */}
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 leading-snug">{template.description}</p>
      </div>
      {/* Updated for dark mode */}
      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        {/* Updated for dark mode */}
        <p className="text-gray-500 dark:text-gray-400 text-[10px]">Used {template.usageCount || 0} times</p>
        <button
          onClick={onUse}
          // Updated for dark mode
          className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 text-xs font-medium transition-colors"
        >
          Use Template
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;