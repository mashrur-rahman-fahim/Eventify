import React, { useContext, useEffect } from "react";
import { VerifyContext } from "../context/VerifyContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useState } from "react";

export const ClubAdmin = () => {
  const navigate = useNavigate();
  const { isAdmin, isVerified, isLoading, checkLogin } =
    useContext(VerifyContext);
  const [formClub, setFormClub] = useState({
    name: "",
    description: "",
  });
  const [club, setClub] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if ((!isAdmin || !isVerified) && !isLoading) {
      navigate("/");
    }
  }, [isAdmin, isVerified, isLoading, navigate]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get("/api/club/getClubByUserId");
        setClub(response.data.clubs);
      } catch (error) {
        console.log(error);
        setErrorMessage("Failed to load clubs. Please try again.");
      }
    };
    fetchClubs();
  }, []);

  const createClub = async () => {
    try {
      setIsCreating(true);
      setErrorMessage("");
      const response = await api.post("/api/club/create", formClub);
      console.log(response);
      setSuccessMessage("Club created successfully!");
      setFormClub({ name: "", description: "" });
      // Refresh clubs list
      const clubsResponse = await api.get("/api/club/getClubByUserId");
      setClub(clubsResponse.data.clubs);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to create club. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteClub = async (clubId) => {
    try {
      const response = await api.delete(`/api/club/delete/${clubId}`);
      console.log(response);
      setSuccessMessage("Club deleted successfully!");
      // Refresh clubs list
      const clubsResponse = await api.get("/api/club/getClubByUserId");
      setClub(clubsResponse.data.clubs);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to delete club. Please try again.");
    }
  };

  const leaveClub = async (clubId) => {
    try {
      const response = await api.delete(`/api/club/leave/${clubId}`);
      console.log(response);
      setSuccessMessage("Left club successfully!");
      // Refresh clubs list
      const clubsResponse = await api.get("/api/club/getClubByUserId");
      setClub(clubsResponse.data.clubs);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to leave club. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content">Club Administration</h1>
          <p className="text-base-content/70 mt-2">
            Manage your clubs and create new communities.
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert alert-success mb-6">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{successMessage}</span>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error mb-6">
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
            <span>{errorMessage}</span>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => setErrorMessage("")}
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Club Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Club
              </h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createClub();
                }}
                className="space-y-4"
              >
                <div className="form-control">
                  <label className="label" htmlFor="clubName">
                    <span className="label-text font-medium">Club Name</span>
                  </label>
                  <input
                    type="text"
                    id="clubName"
                    className="input input-bordered w-full"
                    placeholder="Enter club name..."
                    value={formClub.name}
                    onChange={(e) =>
                      setFormClub({ ...formClub, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="clubDescription">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    id="clubDescription"
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Describe your club..."
                    value={formClub.description}
                    onChange={(e) =>
                      setFormClub({ ...formClub, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="card-actions justify-end pt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating...
                      </>
                    ) : (
                      <>
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
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Create Club
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* My Clubs Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                My Clubs ({club.length})
              </h2>

              <div className="max-h-96 overflow-y-auto">
                {club.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl opacity-20 mb-4">🏛️</div>
                    <p className="text-base-content/60">No clubs found.</p>
                    <p className="text-sm text-base-content/40 mt-2">
                      Create your first club to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {club.map((clubItem) => (
                      <div key={clubItem._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="card-title text-lg">{clubItem.name}</h3>
                              <p className="text-base-content/70 text-sm mt-2">
                                {clubItem.description}
                              </p>
                            </div>
                            
                            <div className="dropdown dropdown-end">
                              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
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
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </div>
                              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                  <button 
                                    onClick={() => leaveClub(clubItem._id)}
                                    className="text-warning hover:bg-warning hover:text-warning-content"
                                  >
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
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                      />
                                    </svg>
                                    Leave Club
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    onClick={() => deleteClub(clubItem._id)}
                                    className="text-error hover:bg-error hover:text-error-content"
                                  >
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
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete Club
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};