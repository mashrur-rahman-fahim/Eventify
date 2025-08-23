import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AllClubsList = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinRequestLoading, setJoinRequestLoading] = useState({});

  useEffect(() => {
    fetchAllClubs();
  }, []);

  const fetchAllClubs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/club/getAll");

      // Get current user ID
      const currentUserId = getCurrentUserId();

      // Add join request status for each club
      const clubsWithRequestStatus = response.data.clubs.map((club) => ({
        ...club,
        hasPendingRequest:
          club.joinRequests?.some(
            (request) =>
              request.userId === currentUserId && request.status === "pending"
          ) || false,
      }));

      setAllClubs(clubsWithRequestStatus);
    } catch (err) {
      setError("Failed to load clubs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (clubId) => {
    try {
      setJoinRequestLoading((prev) => ({ ...prev, [clubId]: true }));
      await api.post(`/api/club/join/${clubId}`);

      // Update the club's join requests in local state
      setAllClubs((prevClubs) =>
        prevClubs.map((club) =>
          club._id === clubId ? { ...club, hasPendingRequest: true } : club
        )
      );

      alert("Join request sent successfully!");
    } catch (err) {
      console.error("Failed to send join request:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to send join request";
      alert(errorMessage);
    } finally {
      setJoinRequestLoading((prev) => ({ ...prev, [clubId]: false }));
    }
  };

  const getCurrentUserId = () => {
    // Get current user ID from localStorage or context
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id;
  };

  const isCurrentUserAdmin = (club) => {
    const currentUserId = getCurrentUserId();
    return club.admins.some((admin) => admin._id === currentUserId);
  };

  const hasPendingRequest = (club) => {
    const currentUserId = getCurrentUserId();
    return club.joinRequests?.some(
      (request) =>
        request.userId === currentUserId && request.status === "pending"
    );
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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Clubs</h2>
        <div className="text-sm text-base-content/60">
          Send join requests to become an admin of clubs
        </div>
      </div>

      {allClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allClubs.map((club) => {
            const isAdmin = isCurrentUserAdmin(club);
            const hasPending =
              club.hasPendingRequest || hasPendingRequest(club);
            const isLoading = joinRequestLoading[club._id];

            return (
              <div
                key={club._id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <h3 className="card-title text-lg">{club.name}</h3>
                  <p className="text-sm text-base-content/70 mb-4">
                    {club.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Admins:</span>{" "}
                      {club.admins.length}
                    </div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {club.admins.map((admin) => admin.name).join(", ")}
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    {isAdmin ? (
                      <div className="badge badge-primary">You're an admin</div>
                    ) : hasPending ? (
                      <div className="badge badge-warning">Request pending</div>
                    ) : (
                      <button
                        onClick={() => handleJoinRequest(club._id)}
                        disabled={isLoading}
                        className="btn btn-sm btn-primary"
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Send Join Request"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg p-8 text-center shadow">
          <p className="text-lg text-base-content/60">No clubs found.</p>
        </div>
      )}
    </div>
  );
};

export default AllClubsList;
