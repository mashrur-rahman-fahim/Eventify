import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import LoadingOverlay from './LoadingOverlay';

const GlobalLoadingOverlay = () => {
  const { globalLoading, loadingMessage } = useLoading();

  return (
    <LoadingOverlay 
      isVisible={globalLoading}
      message={loadingMessage}
      spinnerType="ring"
      spinnerSize={50}
    />
  );
};

export default GlobalLoadingOverlay;
