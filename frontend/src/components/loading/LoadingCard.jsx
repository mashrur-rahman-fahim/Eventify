import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingCard = ({ 
  message = 'Loading content...', 
  spinnerType = 'pulse',
  spinnerSize = 24,
  className = '',
  height = 'h-64'
}) => {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className={`card-body flex items-center justify-center ${height}`}>
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

export default LoadingCard;
