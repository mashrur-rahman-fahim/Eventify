import React, { useState } from "react";
import api from "../utils/api";
import { appToasts } from "../utils/toast";

const JoinRequestsManager = ({ club, onRequestProcessed }) => {
  const [processedRequests, setProcessedRequests] = useState({});
  const [loading, setLoading] = useState({});

  const handleRequest = async (requestId, action) => {
    try {
      setLoading((prev) => ({ ...prev, [requestId]: true }));

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
      if (action === "approve") {
        appToasts.joinRequestApproved(club.name);
      } else {
        appToasts.joinRequestRejected(club.name);
      }
    } catch (err) {
      console.error("Failed to process request", err);
      appToasts.serverError();
    } finally {
      setLoading((prev) => ({ ...prev, [requestId]: false }));
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
              <p className="font-medium">
                {req.userId?.name || "Unknown User"}
              </p>
              <p className="text-sm text-base-content/70">
                {req.userId?.email}
              </p>
            </div>

            <div className="flex gap-2">
              {!processedRequests[req._id] && (
                <>
                  <button
                    className={`btn btn-success btn-sm ${
                      loading[req._id] ? "loading" : ""
                    }`}
                    onClick={() => handleRequest(req._id, "approve")}
                    disabled={loading[req._id]}
                  >
                    {!loading[req._id] && "Approve"}
                  </button>
                  <button
                    className={`btn btn-error btn-sm ${
                      loading[req._id] ? "loading" : ""
                    }`}
                    onClick={() => handleRequest(req._id, "reject")}
                    disabled={loading[req._id]}
                  >
                    {!loading[req._id] && "Reject"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default JoinRequestsManager;
