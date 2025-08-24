import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(new Set());

  const startLoading = (taskId, message = 'Loading...') => {
    setLoadingTasks(prev => new Set(prev).add(taskId));
    setGlobalLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = (taskId) => {
    setLoadingTasks(prev => {
      const newTasks = new Set(prev);
      newTasks.delete(taskId);
      return newTasks;
    });
    
    // Only stop global loading if no tasks are running
    setTimeout(() => {
      setLoadingTasks(currentTasks => {
        if (currentTasks.size === 0) {
          setGlobalLoading(false);
          setLoadingMessage('');
        }
        return currentTasks;
      });
    }, 100);
  };

  const withLoading = async (taskId, message, asyncFunction) => {
    startLoading(taskId, message);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(taskId);
    }
  };

  const value = {
    globalLoading,
    loadingMessage,
    loadingTasks,
    startLoading,
    stopLoading,
    withLoading,
    isLoading: globalLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
