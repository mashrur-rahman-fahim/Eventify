import React from 'react';
import { ClipLoader, PulseLoader, BeatLoader, RingLoader, HashLoader } from 'react-spinners';

const LoadingSpinner = ({ 
  type = 'clip', 
  size = 20, 
  color = '#3b82f6', 
  className = '',
  text = '',
  textClassName = ''
}) => {
  const getSpinner = () => {
    switch (type) {
      case 'pulse':
        return <PulseLoader size={size} color={color} />;
      case 'beat':
        return <BeatLoader size={size} color={color} />;
      case 'ring':
        return <RingLoader size={size} color={color} />;
      case 'hash':
        return <HashLoader size={size} color={color} />;
      case 'clip':
      default:
        return <ClipLoader size={size} color={color} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {getSpinner()}
      {text && (
        <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${textClassName}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
