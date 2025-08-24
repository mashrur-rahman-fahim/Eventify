import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { VerifyContext } from "../context/VerifyContext";

export const SingleEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const { isVerified, isLoading, checkLogin } = useContext(VerifyContext);
  const [registered, setRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const navigate = useNavigate();

  // Helper functions
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const isRegistrationDeadlinePassed = () => {
    if (!event?.registrationDeadline) return false;
    return new Date() > new Date(event.registrationDeadline);
  };

  const isEventFull = () => {
    if (!event?.maxAttendees || event.maxAttendees === 0) return false;
    return registrationCount >= event.maxAttendees;
  };

  const getRegistrationStatus = () => {
    if (isRegistrationDeadlinePassed()) return "deadline-passed";
    if (isEventFull()) return "event-full";
    if (registered) return "registered";
    return "available";
  };

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (!isVerified && !isLoading) {
      navigate("/");
    }
  }, [isVerified, isLoading, navigate]);

  useEffect(() => {
    const fetchEventData = async () => {
      setError(null);

      try {
        const [eventResponse, registrationResponse] = await Promise.all([
          api.get(`/api/event/getEvent/${id}`),
          api.get(`/api/registration/user/${id}`),
        ]);

        setEvent(eventResponse.data.event);
        setRegistrationCount(eventResponse.data.registrationCount);
        setRegistered(registrationResponse.data.success);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError(
          error.response?.data?.message || "Failed to load event details"
        );
      }
    };

    if (isVerified && !isLoading) {
      fetchEventData();
    }
  }, [id, isVerified, isLoading]);

  const handleRegister = async () => {
    try {
      await api.post(`api/event/register/${id}`);
      setRegistered(true);
      setRegistrationCount((prev) => prev + 1);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleUnregister = async () => {
    try {
      await api.delete(`api/event/unregister/${id}`);
      setRegistered(false);
      setRegistrationCount((prev) => prev - 1);
    } catch (error) {
      console.error("Unregistration error:", error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-error mb-2">Oops!</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <Link to="/events" className="btn btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error">Event not found</h2>
          <Link to="/events" className="btn btn-primary mt-4">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const registrationStatus = getRegistrationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={
            event.image || `https://picsum.photos/seed/${event._id}/1200/600`
          }
          alt={`${event.title} poster`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="badge badge-secondary font-semibold mb-4">
              {event.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">About This Event</h2>
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Event Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Date</p>
                        <p className="font-semibold">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Time</p>
                        <p className="font-semibold">
                          {formatTime(event.time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Location</p>
                        <p className="font-semibold">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">Category</p>
                        <p className="font-semibold">{event.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/60">
                          Attendees
                        </p>
                        <p className="font-semibold">
                          {registrationCount}
                          {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
                        </p>
                      </div>
                    </div>

                    {event.registrationDeadline && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/60">
                            Registration Deadline
                          </p>
                          <p className="font-semibold">
                            {formatDate(event.registrationDeadline)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.userId && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Organized By</h2>
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-16">
                        <span className="text-lg">
                          {event.userId.name?.charAt(0) || "O"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {event.userId.name || "Event Organizer"}
                      </h3>
                      <p className="text-base-content/70">
                        {event.userId.email || "Contact organizer for details"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Registration Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Registration</h2>

                {/* Status Badge */}
                <div className="mb-6">
                  {registrationStatus === "registered" && (
                    <div className="badge badge-success badge-lg gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Registered
                    </div>
                  )}
                  {registrationStatus === "deadline-passed" && (
                    <div className="badge badge-error badge-lg gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Registration Closed
                    </div>
                  )}
                  {registrationStatus === "event-full" && (
                    <div className="badge badge-warning badge-lg gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      Event Full
                    </div>
                  )}
                  {registrationStatus === "available" && (
                    <div className="badge badge-info badge-lg gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Open for Registration
                    </div>
                  )}
                </div>

                {/* Registration Stats */}
                <div className="stats stats-vertical bg-base-200 mb-6">
                  <div className="stat">
                    <div className="stat-title">Registered</div>
                    <div className="stat-value text-primary">
                      {registrationCount}
                    </div>
                    {event.maxAttendees > 0 && (
                      <div className="stat-desc">
                        of {event.maxAttendees} spots
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-3">
                  {registrationStatus === "registered" && (
                    <button
                      onClick={handleUnregister}
                      className="btn btn-error btn-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Unregister
                    </button>
                  )}

                  {registrationStatus === "available" && (
                    <button
                      onClick={handleRegister}
                      className="btn btn-primary btn-block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Register Now
                    </button>
                  )}

                  {(registrationStatus === "deadline-passed" ||
                    registrationStatus === "event-full") && (
                    <button disabled className="btn btn-disabled btn-block">
                      Registration Not Available
                    </button>
                  )}
                </div>

                {/* Club Info */}
                {event.clubId && (
                  <>
                    <div className="divider"></div>
                    <div>
                      <h3 className="font-semibold mb-2">Hosted by</h3>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-secondary text-secondary-content rounded-full w-12">
                            <span className="text-sm">
                              {event.clubId.name?.charAt(0) || "C"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{event.clubId.name}</p>
                          <p className="text-sm text-base-content/70">
                            {event.clubId.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Events Button */}
        <div className="mt-12 text-center">
          <Link to="/events" className="btn btn-outline btn-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};
