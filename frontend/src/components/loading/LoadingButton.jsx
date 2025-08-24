import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  loadingText = 'Loading...',
  spinnerSize = 16,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`btn ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner 
            type="clip" 
            size={spinnerSize} 
            color="currentColor"
          />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
