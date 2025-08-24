import React from "react";
import { appToasts, showToast } from "../utils/toast";

const ToastDemo = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Toast Notification Demo</h1>
        <p className="text-base-content/60">
          Test all the different types of toast notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Toast Types */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Basic Types</h3>
            <div className="space-y-3">
              <button
                className="btn btn-success btn-sm w-full"
                onClick={() =>
                  showToast.success("This is a success message!", "Success")
                }
              >
                Success Toast
              </button>
              <button
                className="btn btn-error btn-sm w-full"
                onClick={() =>
                  showToast.error("This is an error message!", "Error")
                }
              >
                Error Toast
              </button>
              <button
                className="btn btn-warning btn-sm w-full"
                onClick={() =>
                  showToast.warning("This is a warning message!", "Warning")
                }
              >
                Warning Toast
              </button>
              <button
                className="btn btn-info btn-sm w-full"
                onClick={() =>
                  showToast.info("This is an info message!", "Info")
                }
              >
                Info Toast
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Toasts */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Authentication</h3>
            <div className="space-y-3">
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={appToasts.loginSuccess}
              >
                Login Success
              </button>
              <button
                className="btn btn-secondary btn-sm w-full"
                onClick={appToasts.logoutSuccess}
              >
                Logout Success
              </button>
              <button
                className="btn btn-accent btn-sm w-full"
                onClick={appToasts.registrationSuccess}
              >
                Registration Success
              </button>
              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={appToasts.emailVerificationSuccess}
              >
                Email Verification
              </button>
            </div>
          </div>
        </div>

        {/* Club Management */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Club Management</h3>
            <div className="space-y-3">
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={() => appToasts.clubCreated("Tech Club")}
              >
                Club Created
              </button>
              <button
                className="btn btn-secondary btn-sm w-full"
                onClick={() => appToasts.joinRequestSent("Coding Club")}
              >
                Join Request Sent
              </button>
              <button
                className="btn btn-success btn-sm w-full"
                onClick={() => appToasts.joinRequestApproved("Art Club")}
              >
                Join Request Approved
              </button>
              <button
                className="btn btn-warning btn-sm w-full"
                onClick={() => appToasts.joinRequestRejected("Music Club")}
              >
                Join Request Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Event Management */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Event Management</h3>
            <div className="space-y-3">
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={() => appToasts.eventCreated("Tech Conference 2024")}
              >
                Event Created
              </button>
              <button
                className="btn btn-secondary btn-sm w-full"
                onClick={() => appToasts.eventUpdated("Workshop Series")}
              >
                Event Updated
              </button>
              <button
                className="btn btn-error btn-sm w-full"
                onClick={() => appToasts.eventDeleted("Old Event")}
              >
                Event Deleted
              </button>
              <button
                className="btn btn-accent btn-sm w-full"
                onClick={() =>
                  appToasts.certificateGenerated("Web Development Bootcamp")
                }
              >
                Certificate Generated
              </button>
            </div>
          </div>
        </div>

        {/* Error Scenarios */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Error Scenarios</h3>
            <div className="space-y-3">
              <button
                className="btn btn-outline btn-error btn-sm w-full"
                onClick={appToasts.networkError}
              >
                Network Error
              </button>
              <button
                className="btn btn-outline btn-error btn-sm w-full"
                onClick={appToasts.serverError}
              >
                Server Error
              </button>
              <button
                className="btn btn-outline btn-warning btn-sm w-full"
                onClick={() => appToasts.validationError("email")}
              >
                Validation Error
              </button>
              <button
                className="btn btn-outline btn-warning btn-sm w-full"
                onClick={appToasts.permissionDenied}
              >
                Permission Denied
              </button>
            </div>
          </div>
        </div>

        {/* Profile & Other */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Profile & Other</h3>
            <div className="space-y-3">
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={appToasts.profileUpdated}
              >
                Profile Updated
              </button>
              <button
                className="btn btn-warning btn-sm w-full"
                onClick={appToasts.sessionExpired}
              >
                Session Expired
              </button>
              <button
                className="btn btn-info btn-sm w-full"
                onClick={() =>
                  showToast.info("This is a custom info message", "Custom Info")
                }
              >
                Custom Info
              </button>
              <button
                className="btn btn-success btn-sm w-full"
                onClick={() =>
                  showToast.success(
                    "This is a custom success message",
                    "Custom Success"
                  )
                }
              >
                Custom Success
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-4">Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>✅ Responsive design for mobile devices</li>
            <li>✅ High z-index to appear above other elements</li>
            <li>✅ Auto-dismiss after 5 seconds (configurable)</li>
            <li>✅ Manual close button</li>
            <li>✅ Smooth animations and transitions</li>
          </ul>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>✅ Different types: success, error, warning, info</li>
            <li>✅ Application-specific toast patterns</li>
            <li>✅ Accessible with proper ARIA labels</li>
            <li>✅ Draggable and pause on hover</li>
            <li>✅ Custom styling with DaisyUI integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;
