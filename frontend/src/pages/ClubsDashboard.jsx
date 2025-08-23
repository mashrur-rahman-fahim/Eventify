import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const ClubsDashboard = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clubsPerPage] = useState(12);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/club/getAll");
        setAllClubs(response.data.clubs);
        setFilteredClubs(response.data.clubs);
      } catch (err) {
        setError("Failed to load clubs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (!searchValue.trim()) {
        setFilteredClubs(allClubs);
        setIsSearching(false);
        setCurrentPage(1);
        return;
      }

      try {
        setIsSearching(true);
        const response = await api.get(`/api/club/search?characters=${searchValue}`);
        setFilteredClubs(response.data.clubs);
        setCurrentPage(1);
      } catch (err) {
        console.error("Search error:", err);
        // Fallback to client-side filtering if API fails
        const filtered = allClubs.filter((club) =>
          club.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredClubs(filtered);
        setCurrentPage(1);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [allClubs]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const requestToJoinClub = async (clubId) => {
    try {
      const response = await api.post(`/api/club/join/${clubId}`);
      setSuccessMessage("Join request sent successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to send join request. Please try again.");
      setTimeout(() => setError(""), 3000);
      console.error(err);
    }
  };

  // Get current clubs
  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);

  const ClubCard = ({ club }) => (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">
          {club.name}
          <div className="badge badge-secondary">{club.admins?.length || 0} admins</div>
        </h2>
        
        <p className="text-base-content/70 line-clamp-3 mb-4">
          {club.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {club.admins?.slice(0, 3).map((admin, index) => (
            <div key={admin._id} className="badge badge-outline">
              {admin.name}
            </div>
          ))}
          {club.admins?.length > 3 && (
            <div className="badge badge-ghost">
              +{club.admins.length - 3} more
            </div>
          )}
        </div>

        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => requestToJoinClub(club._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
            Join Club
          </button>
          <button className="btn btn-ghost btn-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const ClubCardSkeleton = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-5 w-16 rounded-full"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-6 w-16 rounded-full"></div>
          <div className="skeleton h-6 w-20 rounded-full"></div>
          <div className="skeleton h-6 w-14 rounded-full"></div>
        </div>
        <div className="card-actions justify-end">
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-8 w-24"></div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error && !successMessage) {
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
        </div>
      );
    }

    if (filteredClubs.length === 0) {
      if (searchTerm) {
        return (
          <div className="text-center py-16 bg-base-100 rounded-lg shadow">
            <div className="text-6xl opacity-20 mb-4">🔍</div>
            <h2 className="text-2xl font-semibold">No Clubs Found</h2>
            <p className="text-base-content/60 mt-2">
              No clubs match your search criteria. Try different keywords.
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-16 bg-base-100 rounded-lg shadow">
          <div className="text-6xl opacity-20 mb-4">🏛️</div>
          <h2 className="text-2xl font-semibold">No Clubs Found</h2>
          <p className="text-base-content/60 mt-2">
            No clubs are available at the moment. Check back later!
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentClubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`join-item btn ${
                      currentPage === page ? "btn-active" : ""
                    }`}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="join-item btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Discover Clubs</h1>
          <p className="text-base-content/70 mt-2">
            Join amazing communities and connect with like-minded people.
          </p>

          {/* Search Input */}
          <div className="mt-6 max-w-md">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search clubs by name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {isSearching ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
          </div>
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
          </div>
        )}

        {error && successMessage && (
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
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="stats shadow mb-6">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-8 h-8"
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
              <div className="stat-title">Total Clubs</div>
              <div className="stat-value text-primary">{filteredClubs.length}</div>
              <div className="stat-desc">
                {searchTerm ? `Filtered from ${allClubs.length} total` : "Active communities"}
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <div className="stat-title">Page</div>
              <div className="stat-value text-secondary">{currentPage}</div>
              <div className="stat-desc">of {totalPages} pages</div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {renderContent()}
      </div>
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default ClubsDashboard;