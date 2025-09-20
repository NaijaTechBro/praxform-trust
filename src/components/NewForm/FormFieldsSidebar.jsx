import React from 'react';
import { FaTextHeight, FaCalendarAlt, FaSearch, FaFileUpload, FaIdCard, FaSignature, FaLink, FaListUl, FaCheckSquare, FaDotCircle, FaAlignLeft, FaImage } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';

const FormFieldsSidebar = () => {
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', fieldType);
  };

  // Icons are fine, the parent container will color them
  const basicFields = [
    { name: 'Text Field', icon: <FaTextHeight size={16} />, type: 'text' },
    { name: 'Text Area', icon: <FaAlignLeft size={16} />, type: 'textarea' },
    { name: 'Number', icon: <IoMdKey size={16} />, type: 'number' },
    { name: 'Date Picker', icon: <FaCalendarAlt size={16} />, type: 'date' },
    { name: 'Email Field', icon: <MdEmail size={16} />, type: 'email' },
    { name: 'Image', icon: <FaImage size={16} />, type: 'image' },
    { name: 'File Upload', icon: <FaFileUpload size={16} />, type: 'file' },
    { name: 'Embed Link', icon: <FaLink size={16} />, type: 'embed' },
  ];
  const selectionFields = [
    { name: 'Checkbox', icon: <FaCheckSquare size={16} />, type: 'checkbox' },
    { name: 'Radio Group', icon: <FaDotCircle size={16} />, type: 'radio-group' },
    { name: 'Select (Dropdown)', icon: <FaListUl size={16} />, type: 'select' },
    { name: 'SSN', icon: <FaIdCard size={16} />, type: 'ssn' },
    { name: 'Signature', icon: <FaSignature size={16} />, type: 'signature' },
  ];
  const layoutFields = [
    { name: 'Layout Row', icon: <GrGroup size={16} />, type: 'layout-row' },
  ];

  // FieldItem updated for dark mode
  const FieldItem = ({ name, icon, type }) => (
    <div
      className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab text-sm rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200"
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
    >
      <div className="flex items-center justify-center w-6 h-6 mr-2 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <span className="ml-0">{name}</span>
    </div>
  );

  return (
    // Main container updated for dark mode
    <div className="w-full h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
      <div className="mb-4">
        <div className="relative">
          <FaSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            // Search input updated for dark mode
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Headings updated for dark mode */}
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 mt-6">Basic Fields</h3>
      <div className="space-y-2 mb-6">
        {basicFields.map((field) => <FieldItem key={field.type} {...field} />)}
      </div>

      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Selection Fields</h3>
      <div className="space-y-2 mb-6">
        {selectionFields.map((field) => <FieldItem key={field.type} {...field} />)}
      </div>

      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Layout Elements</h3>
      <div className="space-y-2">
        {layoutFields.map((field) => <FieldItem key={field.type} {...field} />)}
      </div>
    </div>
  );
};

export default FormFieldsSidebar;