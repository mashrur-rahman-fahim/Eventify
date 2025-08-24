import React, { useState, useEffect } from "react";
import api from "../utils/api";

const EventAttendanceManager = ({ event }) => {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    if (event) {
      fetchRegistrations();
    }
  }, [event]);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get(`/api/registration/event/${event._id}`);
      setRegistrations(response.data.registrations);
    } catch (err) {
      setError("Failed to load registrations. Please try again.");
      console.error("Error fetching registrations:", err);
    }
  };

  const updateAttendanceStatus = async (registrationId, newStatus) => {
    try {
      const response = await api.put(
        `/api/registration/${registrationId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.registration) {
        // Update the local state
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg._id === registrationId
              ? {
                  ...reg,
                  status: newStatus,
                  attendedAt: newStatus === "attended" ? new Date() : null,
                }
              : reg
          )
        );

        if (newStatus === "attended") {
          alert(`✅ Marked as attended! Certificate will be auto-generated.`);
        } else {
          alert(`✅ Status updated to "${newStatus}"`);
        }
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(`❌ Failed to update status. Please try again.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "attended":
        return (
          <div className="badge badge-success gap-2">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Attended
          </div>
        );
      case "registered":
        return <div className="badge badge-warning">Registered</div>;
      case "cancelled":
        return <div className="badge badge-error">Cancelled</div>;
      default:
        return <div className="badge badge-ghost">Unknown</div>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
        <button className="btn btn-sm btn-outline" onClick={fetchRegistrations}>
          Try Again
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <p className="text-base-content/60">No event selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Attendance Management
            </h3>
            <p className="text-base-content/70 mt-1">
              {event.title} - {formatDate(event.date)}
            </p>
          </div>

          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-50">
            <div className="stat">
              <div className="stat-title">Total Registered</div>
              <div className="stat-value text-primary text-2xl">
                {registrations.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Attended</div>
              <div className="stat-value text-success text-2xl">
                {registrations.filter((r) => r.status === "attended").length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning text-2xl">
                {registrations.filter((r) => r.status === "registered").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const registeredIds = registrations
              .filter((r) => r.status === "registered")
              .map((r) => r._id);
            registeredIds.forEach((id) =>
              updateAttendanceStatus(id, "attended")
            );
          }}
          className="btn btn-success btn-sm"
          disabled={
            registrations.filter((r) => r.status === "registered").length === 0
          }
        >
          Mark All as Attended
        </button>
        <button onClick={fetchRegistrations} className="btn btn-outline btn-sm">
          Refresh List
        </button>
      </div>

      {/* Registrations Table */}
      <div className="bg-base-100 rounded-lg shadow-sm border border-base-200">
        <div className="overflow-x-auto">
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-base-content/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">
                No Registrations Yet
              </h4>
              <p className="text-base-content/60">
                No one has registered for this event yet.
              </p>
            </div>
          ) : (
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Attended At</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {registration.userId?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                        </div>
                        <span className="font-medium">
                          {registration.userId?.name || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {registration.userId?.email || "No email"}
                    </td>
                    <td className="text-sm">
                      {formatDate(registration.registrationDate)}
                    </td>
                    <td>{getStatusBadge(registration.status)}</td>
                    <td className="text-sm text-base-content/70">
                      {formatDate(registration.attendedAt)}
                    </td>
                    <td>
                      <div className="flex gap-1 justify-center">
                                                 {registration.status !== "attended" && (
                           <button
                             onClick={() =>
                               updateAttendanceStatus(
                                 registration._id,
                                 "attended"
                               )
                             }
                             className="btn btn-success btn-xs gap-1"
                           >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Mark Attended
                          </button>
                        )}

                                                 {registration.status !== "registered" && (
                           <button
                             onClick={() =>
                               updateAttendanceStatus(
                                 registration._id,
                                 "registered"
                               )
                             }
                             className="btn btn-warning btn-xs gap-1"
                           >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Mark Registered
                          </button>
                        )}

                                                 {registration.status !== "cancelled" && (
                           <button
                             onClick={() =>
                               updateAttendanceStatus(
                                 registration._id,
                                 "cancelled"
                               )
                             }
                             className="btn btn-error btn-xs gap-1"
                           >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-info mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h5 className="font-medium text-info mb-1">
              Attendance Management Tips
            </h5>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>
                • Mark participants as "Attended" after they complete the event
              </li>
              <li>
                • Certificates are automatically generated when status changes
                to "Attended"
              </li>
              <li>
                • You can bulk mark all registered participants as attended
              </li>
              <li>
                • Status changes are logged with timestamps for audit purposes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendanceManager;
