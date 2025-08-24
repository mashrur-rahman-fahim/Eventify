import React, { useState } from "react"; 
import api from "../utils/api";

const JoinRequestsManager = ({ club, onRequestProcessed }) => {
  const [processedRequests, setProcessedRequests] = useState({});
  const [toast, setToast] = useState(null);

  const handleRequest = async (requestId, action) => {
    try {
      await api.post(`/api/club/process-request/${club._id}/${requestId}`, {
        action, // "approve" or "reject"
      });

      // Mark request as processed
      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: action,
      }));

      // Refresh data
      await onRequestProcessed();

      // Show toast
      setToast({
        type: action === "approve" ? "success" : "error",
        message:
          action === "approve"
            ? "Request approved successfully ✅"
            : "Request rejected ❌",
      });

      // Remove toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to process request", err);
      setToast({ type: "error", message: "Something went wrong ⚠️" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!club.joinRequests || club.joinRequests.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-4 text-center">
        <p className="text-base-content/60">No pending join requests</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {club.joinRequests.map((req) => (
          <div
            key={req._id}
            className="flex justify-between items-center p-4 bg-base-100 rounded-lg shadow"
          >
            <div>
              <p className="font-medium">{req.userId?.name || "Unknown User"}</p>
              <p className="text-sm text-base-content/70">{req.userId?.email}</p>
            </div>

            <div className="flex gap-2">
              {!processedRequests[req._id] && (
                <>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleRequest(req._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleRequest(req._id, "reject")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinRequestsManager;
