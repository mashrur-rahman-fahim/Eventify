import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import AllClubsList from "../components/AllClubsList";
import JoinRequestsManager from "../components/JoinRequestsManager";
import api from "../utils/api";

const ClubManagementPage = () => {
  const navigate = useNavigate();
  const [myClubs, setMyClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyClubs();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/club/getClubByUserId");

      // Fetch join requests for each club
      const clubsWithRequests = await Promise.all(
        response.data.clubs.map(async (club) => {
          try {
            const joinRequestsResponse = await api.get(
              `/api/club/join-requests/${club._id}`
            );
            return {
              ...club,
              joinRequests: joinRequestsResponse.data.joinRequests,
            };
          } catch {
            return { ...club, joinRequests: [] };
          }
        })
      );

      setMyClubs(clubsWithRequests);
    } catch (err) {
      setError("Failed to load your clubs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestProcessed = () => {
    // Refresh clubs data
    fetchMyClubs();
    if (selectedClub) {
      // Refresh the selected club data
      const updatedClub = myClubs.find((club) => club._id === selectedClub._id);
      setSelectedClub(updatedClub);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar handleLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar handleLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar handleLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Club Management</h1>
            <p className="text-base-content/70">
              Manage your clubs and join new ones
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-outline mt-4 md:mt-0">
            Back to Dashboard
          </Link>
        </div>

        {/* My Clubs Section with Join Requests */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">My Clubs</h2>
          {myClubs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clubs List */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Clubs I Admin</h3>
                <div className="space-y-4">
                  {myClubs.map((club) => (
                    <div
                      key={club._id}
                      className={`card bg-base-100 shadow-md cursor-pointer transition-all ${
                        selectedClub?._id === club._id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedClub(club)}
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="card-title text-lg">{club.name}</h4>
                            <p className="text-sm text-base-content/70 mb-2">
                              {club.description}
                            </p>
                            <div className="text-xs text-base-content/60">
                              {club.admins.length} admin(s) •{" "}
                              {club.events?.length || 0} event(s)
                            </div>
                          </div>
                          {club.joinRequests &&
                            club.joinRequests.length > 0 && (
                              <div className="badge badge-warning">
                                {club.joinRequests.length} request(s)
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Requests Panel */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Join Requests</h3>
                {selectedClub ? (
                  <div>
                    <div className="mb-4 p-4 bg-base-200 rounded-lg">
                      <h4 className="font-medium">{selectedClub.name}</h4>
                      <p className="text-sm text-base-content/70">
                        Managing join requests for this club
                      </p>
                    </div>
                    <JoinRequestsManager
                      club={selectedClub}
                      onRequestProcessed={handleRequestProcessed}
                    />
                  </div>
                ) : (
                  <div className="bg-base-100 rounded-lg p-8 text-center border-2 border-dashed border-base-300">
                    <p className="text-base-content/60">
                      Select a club from the left to manage its join requests
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-base-100 rounded-lg p-8 text-center shadow">
              <h3 className="text-xl font-semibold mb-2">No Clubs Yet</h3>
              <p className="text-base-content/60 mb-4">
                You are not an admin of any clubs yet.
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* All Clubs Section */}
        <div className="border-t border-base-200 pt-8">
          <AllClubsList />
        </div>
      </div>
    </div>
  );
};

export default ClubManagementPage;
