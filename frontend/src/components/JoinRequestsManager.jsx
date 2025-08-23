import React, { useState, useEffect } from "react";
import api from "../utils/api";

const JoinRequestsManager = ({ club, onRequestProcessed }) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (club?._id) {
      fetchJoinRequests();
    }
  }, [club?._id]);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/club/join-requests/${club._id}`);
      setJoinRequests(
        response.data.joinRequests.filter((req) => req.status === "pending")
      );
    } catch (err) {
      setError("Failed to load join requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRequest = async (requestId, action) => {
    try {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: true }));

      await api.post(`/api/club/process-request/${club._id}/${requestId}`, {
        action: action,
      });

      // Remove the processed request from the list
      setJoinRequests((prev) => prev.filter((req) => req._id !== requestId));

      // Notify parent component if needed
      if (onRequestProcessed) {
        onRequestProcessed();
      }

      alert(
        `Join request ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
    } catch (err) {
      console.error("Failed to process join request:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to process join request";
      alert(errorMessage);
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (joinRequests.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-4 text-center">
        <p className="text-base-content/60">
          No pending join requests for this club.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">
        Pending Join Requests ({joinRequests.length})
      </h3>

      <div className="space-y-4">
        {joinRequests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-4 border border-base-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium">{request.userId.name}</div>
              <div className="text-sm text-base-content/60">
                {request.userId.email}
              </div>
              <div className="text-xs text-base-content/50 mt-1">
                Requested: {new Date(request.requestedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleProcessRequest(request._id, "approve")}
                disabled={processingRequest[request._id]}
                className="btn btn-sm btn-success"
              >
                {processingRequest[request._id] ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Approve"
                )}
              </button>
              <button
                onClick={() => handleProcessRequest(request._id, "reject")}
                disabled={processingRequest[request._id]}
                className="btn btn-sm btn-error"
              >
                {processingRequest[request._id] ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinRequestsManager;
