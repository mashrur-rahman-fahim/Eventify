import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { ClubList } from "../ClubList";
import AllClubsList from "../AllClubsList";
import ConfirmationModal from "../ConfirmationModal";

const AdminDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, attendees: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    eventId: null,
    isDeleting: false,
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const calculateStats = (events) => {
    const upcomingCount = events.filter(
      (e) => new Date(e.date) >= new Date()
    ).length;
    const totalAttendeesCount = events.reduce(
      (sum, e) => sum + e.attendees.length,
      0
    );
    return {
      total: events.length,
      upcoming: upcomingCount,
      attendees: totalAttendeesCount,
    };
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [clubResponse, eventResponse] = await Promise.all([
          api.get("/api/club/getClubByUserId"),
          api.get("/api/event/admin/events"),
        ]);

        // Fetch join requests for each club
        const clubsWithRequests = await Promise.all(
          clubResponse.data.clubs.map(async (club) => {
            try {
              const joinRequestsResponse = await api.get(
                `/api/club/join-requests/${club._id}`
              );
              return {
                ...club,
                joinRequests: joinRequestsResponse.data.joinRequests,
              };
            } catch (err) {
              // If user is not admin of this club, ignore the error
              return { ...club, joinRequests: [] };
            }
          })
        );

        setClubs(clubsWithRequests);
        const events = eventResponse.data.events;
        setMyEvents(events);

        setStats(calculateStats(events));
      } catch (err) {
        setError("Failed to load your dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const refreshClubs = () => {
    // Re-fetch club data
    const fetchClubs = async () => {
      try {
        const clubResponse = await api.get("/api/club/getClubByUserId");

        const clubsWithRequests = await Promise.all(
          clubResponse.data.clubs.map(async (club) => {
            try {
              const joinRequestsResponse = await api.get(
                `/api/club/join-requests/${club._id}`
              );
              return {
                ...club,
                joinRequests: joinRequestsResponse.data.joinRequests,
              };
            } catch (err) {
              return { ...club, joinRequests: [] };
            }
          })
        );

        setClubs(clubsWithRequests);
      } catch (err) {
        console.error("Failed to refresh clubs:", err);
      }
    };
    fetchClubs();
  };

  const handleClubAction = (clubId) => {
    setClubs((prevClubs) => prevClubs.filter((club) => club._id !== clubId));
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmModal({
      isOpen: true,
      eventId: eventId,
      isDeleting: false,
    });
  };

  const confirmDeleteEvent = async () => {
    const { eventId } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await api.delete(`/api/event/delete/${eventId}`);
      const updatedEvents = myEvents.filter((event) => event._id !== eventId);
      setMyEvents(updatedEvents);
      setStats(calculateStats(updatedEvents));

      // Close the confirmation modal
      setConfirmModal({
        isOpen: false,
        eventId: null,
        isDeleting: false,
      });
    } catch (err) {
      console.error("Failed to delete event", err);

      // Close confirmation modal and show error modal
      setConfirmModal({
        isOpen: false,
        eventId: null,
        isDeleting: false,
      });

      setErrorModal({
        isOpen: true,
        message: "Could not delete the event. Please try again later.",
      });
    }
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isDeleting) {
      setConfirmModal({
        isOpen: false,
        eventId: null,
        isDeleting: false,
      });
    }
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      message: "",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
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

  return (
    <div>
      {/* Header and Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to="/club-management" className="btn btn-secondary">
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
                d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Manage Clubs
          </Link>
          <Link to="/create-event" className="btn btn-primary">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Event
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats shadow w-full stats-vertical md:stats-horizontal mb-8">
        <div className="stat">
          <div className="stat-title">My Total Events</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">My Upcoming Events</div>
          <div className="stat-value text-secondary">{stats.upcoming}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Registrations</div>
          <div className="stat-value">{stats.attendees}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-accent">
            <svg
              className="w-8 h-8"
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
          </div>
          <div className="stat-title">Certificates Generated</div>
          <div className="stat-value text-accent">
            {stats.certificates || 0}
          </div>
          <div className="stat-desc">Event completion certificates</div>
        </div>
      </div>

      {/* --- Render the new ClubList component --- */}
      <ClubList
        clubs={clubs}
        onClubAction={handleClubAction}
        refreshClubs={refreshClubs}
      />

      {/* --- Render All Clubs List for Join Requests --- */}
      <AllClubsList />

      {/* Event Management Table */}
      <h2 className="text-2xl font-bold mb-4">Manage My Events</h2>
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Attendees</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.length > 0 ? (
              myEvents.map((event) => (
                <tr key={event._id} className="hover">
                  <td className="font-medium">{event.title}</td>
                  <td>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </td>
                  <td>{event.location}</td>
                  <td>
                    {event.attendees.length} / {event.maxAttendees || "∞"}
                  </td>
                  <td className="flex gap-1 justify-center">
                    <Link
                      to={`/event/manage/${event._id}`}
                      className="btn btn-sm btn-primary"
                      title="Manage attendance and certificates"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/event/edit/${event._id}`}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  You have not created any events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to permanently delete this event? This action cannot be undone."
        confirmText="Delete Event"
        cancelText="Cancel"
        type="error"
        isLoading={confirmModal.isDeleting}
      />

      {/* Error Modal */}
      <ConfirmationModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        onConfirm={closeErrorModal}
        title="Error"
        message={errorModal.message}
        confirmText="OK"
        cancelText=""
        type="error"
        isLoading={false}
      />
    </div>
  );
};

export default AdminDashboard;
