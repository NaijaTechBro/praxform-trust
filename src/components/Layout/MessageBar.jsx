import React, { useEffect } from 'react';
import { useForms } from '../../context/FormContext';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const MessageBar = () => {
  const { message, setMessage } = useForms();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  if (!message) {
    return null;
  }

  const isSuccess = message.type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? FiCheckCircle : FiXCircle;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg text-white ${bgColor}`}>
        <Icon size={20} className="mr-3" />
        <p className="text-sm font-medium">{message.text}</p>
        <button onClick={() => setMessage(null)} className="ml-4 text-white hover:text-gray-200">
          <FiXCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
