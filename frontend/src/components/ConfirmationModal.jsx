import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'error', 'info', 'success'
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: (
            <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmBtn: 'btn-error',
          bgColor: 'bg-error/10'
        };
      case 'info':
        return {
          icon: (
            <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          confirmBtn: 'btn-info',
          bgColor: 'bg-info/10'
        };
      case 'success':
        return {
          icon: (
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
          confirmBtn: 'btn-success',
          bgColor: 'bg-success/10'
        };
      default: // warning
        return {
          icon: (
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmBtn: 'btn-warning',
          bgColor: 'bg-warning/10'
        };
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box relative max-w-md">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          onClick={onClose}
          disabled={isLoading}
        >
          ✕
        </button>

        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-full ${styles.bgColor}`}>
            {styles.icon}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        {/* Message */}
        <p className="text-base-content/80 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="modal-action mt-6">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${styles.confirmBtn} ${isLoading ? 'loading' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {!isLoading && confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;