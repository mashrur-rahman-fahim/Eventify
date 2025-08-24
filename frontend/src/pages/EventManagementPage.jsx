import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { VerifyContext } from "../context/VerifyContext";
import EventAttendanceManager from "../components/EventAttendanceManager";
import AdminCertificateManager from "../components/AdminCertificateManager";
import api from "../utils/api";

const EventManagementPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isVerified, isAdmin, checkLogin } = useContext(VerifyContext);

  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");
  const [error, setError] = useState("");

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (!isVerified) {
      navigate("/login");
    }
  }, [isVerified, navigate]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (eventId && isVerified && isAdmin) {
      fetchEvent();
    }
  }, [eventId, isVerified, isAdmin]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/api/event/getEvent/${eventId}`);
      setEvent(response.data.event);
    } catch (err) {
      setError("Failed to load event details. Please try again.");
      console.error("Error fetching event:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar handleLogout={handleLogout} />
        <main className="container mx-auto p-4 md:p-8 max-w-7xl">
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
            <button
              className="btn btn-sm btn-outline"
              onClick={() => navigate("/dashboard")}
            >
              Go Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar handleLogout={handleLogout} />
        <main className="container mx-auto p-4 md:p-8 max-w-7xl">
          <div className="flex justify-center items-center py-12">
            <p className="text-base-content/60">
              Event not found or access denied.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar handleLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="breadcrumbs text-sm">
                  <ul>
                    <li>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="link link-hover"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>Event Management</li>
                  </ul>
                </div>
                <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-base-content/70">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{event.clubId?.name || "Unknown Club"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/event/edit/${event._id}`)}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Event
                </button>
                <button
                  onClick={() => navigate(`/event/${event._id}`)}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Public Page
                </button>
              </div>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-200">
              <h3 className="text-lg font-semibold mb-3">Event Description</h3>
              <p className="text-base-content/80 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Management Tabs */}
          <div className="bg-base-100 rounded-lg shadow-sm border border-base-200">
            <div className="border-b border-base-200">
              <div className="tabs tabs-boxed bg-transparent p-2">
                <button
                  className={`tab gap-2 ${
                    activeTab === "attendance" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("attendance")}
                >
                  <svg
                    className="w-4 h-4"
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
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "certificates" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("certificates")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Certificate Management
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "attendance" && (
                <EventAttendanceManager event={event} />
              )}

              {activeTab === "certificates" && (
                <AdminCertificateManager event={event} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventManagementPage;
