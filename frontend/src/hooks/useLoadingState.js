import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const withLoading = useCallback(async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      setErrorState(err.message || 'An error occurred');
      throw err;
    }
  }, [startLoading, stopLoading, setErrorState]);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError: setErrorState,
    withLoading,
  };
};
