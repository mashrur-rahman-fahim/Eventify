import { toast } from "react-toastify";

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  rtl: false,
};

// Custom toast styles for better integration with DaisyUI
export const customToastStyles = {
  success: {
    style: {
      background: "#10b981",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  error: {
    style: {
      background: "#ef4444",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  warning: {
    style: {
      background: "#f59e0b",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  info: {
    style: {
      background: "#3b82f6",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
};

// Toast helper functions
export const showToast = {
  success: (message, title = "Success") => {
    toast.success(`${title}: ${message}`, {
      ...toastConfig,
      ...customToastStyles.success,
    });
  },

  error: (message, title = "Error") => {
    toast.error(`${title}: ${message}`, {
      ...toastConfig,
      ...customToastStyles.error,
    });
  },

  warning: (message, title = "Warning") => {
    toast.warning(`${title}: ${message}`, {
      ...toastConfig,
      ...customToastStyles.warning,
    });
  },

  info: (message, title = "Info") => {
    toast.info(`${title}: ${message}`, {
      ...toastConfig,
      ...customToastStyles.info,
    });
  },
};

// Application-specific toast functions
export const appToasts = {
  // Authentication
  loginSuccess: () =>
    showToast.success(
      "Welcome back! You have been logged in successfully.",
      "Login Successful"
    ),
  logoutSuccess: () =>
    showToast.success(
      "You have been logged out successfully.",
      "Logout Successful"
    ),
  registrationSuccess: () =>
    showToast.success(
      "Your account has been created successfully. Please check your email for verification.",
      "Registration Successful"
    ),
  emailVerificationSuccess: () =>
    showToast.success(
      "Your email has been verified successfully. You can now log in.",
      "Email Verified"
    ),
  passwordResetSuccess: () =>
    showToast.success(
      "Your password has been reset successfully. You can now log in with your new password.",
      "Password Reset"
    ),

  // Events
  eventCreated: (eventName) =>
    showToast.success(
      `${eventName} has been created successfully.`,
      "Event Created"
    ),
  eventUpdated: (eventName) =>
    showToast.success(
      `${eventName} has been updated successfully.`,
      "Event Updated"
    ),
  eventDeleted: (eventName) =>
    showToast.success(
      `${eventName} has been deleted successfully.`,
      "Event Deleted"
    ),

  // Clubs
  clubCreated: (clubName) =>
    showToast.success(
      `${clubName} has been created successfully.`,
      "Club Created"
    ),
  clubUpdated: (clubName) =>
    showToast.success(
      `${clubName} has been updated successfully.`,
      "Club Updated"
    ),
  clubDeleted: (clubName) =>
    showToast.success(
      `${clubName} has been deleted successfully.`,
      "Club Deleted"
    ),
  joinRequestSent: (clubName) =>
    showToast.info(
      `Your request to join ${clubName} has been sent. Please wait for approval.`,
      "Join Request Sent"
    ),
  joinRequestApproved: (clubName) =>
    showToast.success(
      `Your request to join ${clubName} has been approved!`,
      "Join Request Approved"
    ),
  joinRequestRejected: (clubName) =>
    showToast.warning(
      `Your request to join ${clubName} has been rejected.`,
      "Join Request Rejected"
    ),

  // Certificates
  certificateGenerated: (eventName) =>
    showToast.success(
      `Certificate for ${eventName} has been generated successfully.`,
      "Certificate Generated"
    ),

  // Profile
  profileUpdated: () =>
    showToast.success(
      "Your profile has been updated successfully.",
      "Profile Updated"
    ),

  // Errors
  networkError: () =>
    showToast.error(
      "Unable to connect to the server. Please check your internet connection and try again.",
      "Network Error"
    ),
  serverError: () =>
    showToast.error(
      "Something went wrong on our end. Please try again later.",
      "Server Error"
    ),
  validationError: (field) =>
    showToast.error(
      `Please check the ${field} field and try again.`,
      "Validation Error"
    ),
  permissionDenied: () =>
    showToast.error(
      "You do not have permission to perform this action.",
      "Permission Denied"
    ),
  sessionExpired: () =>
    showToast.warning(
      "Your session has expired. Please log in again.",
      "Session Expired"
    ),
};

export default showToast;
