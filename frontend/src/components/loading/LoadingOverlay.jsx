import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Loading...', 
  spinnerType = 'ring',
  spinnerSize = 40,
  className = '',
  backdrop = true
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 min-w-[200px]">
        <LoadingSpinner 
          type={spinnerType} 
          size={spinnerSize} 
          text={message}
          className="text-center"
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
