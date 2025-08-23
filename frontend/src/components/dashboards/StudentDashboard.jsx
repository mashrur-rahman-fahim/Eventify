import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { EventCard } from "../EventCard";
import { EventCardSkeleton } from "../EventCardSkeleton";

const StudentDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(9);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/event/getAll");

        // Filter and sort the events directly after fetching
        const filteredAndSortedEvents = response.data.events
          .filter((event) => new Date(event.date) >= new Date()) // Keep events that are today or in the future
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort them with the latest first

        setUpcomingEvents(filteredAndSortedEvents);
        setFilteredEvents(filteredAndSortedEvents);
      } catch (err) {
        setError("Failed to load events. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (!searchValue.trim()) {
        setFilteredEvents(upcomingEvents);
        setIsSearching(false);
        setCurrentPage(1);
        return;
      }

      try {
        setIsSearching(true);
        const response = await api.get(
          `/api/event/search?characters=${searchValue}`
        );
        const filteredAndSortedEvents = response.data.events
          .filter((event) => new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setFilteredEvents(filteredAndSortedEvents);
        setCurrentPage(1);
      } catch (err) {
        console.error("Search error:", err);
        // Fallback to client-side filtering if API fails
        const filtered = upcomingEvents.filter((event) =>
          event.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredEvents(filtered);
        setCurrentPage(1);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [upcomingEvents]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      );
    }

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
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      if (searchTerm) {
        return (
          <div className="text-center py-16 bg-base-100 rounded-lg shadow">
            <h2 className="text-2xl font-semibold">No Events Found</h2>
            <p className="text-base-content/60 mt-2">
              No events match your search criteria. Try different keywords.
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-16 bg-base-100 rounded-lg shadow">
          <h2 className="text-2xl font-semibold">No Upcoming Events Found</h2>
          <p className="text-base-content/60 mt-2">
            It's a quiet day! Check back later for new events.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <EventCard key={event._id} event={event} />
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
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Featured Events</h1>
        <p className="text-base-content/70 mt-2">
          Discover what's happening across campus.
        </p>

        {/* Search Input */}
        <div className="mt-6 max-w-md">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search events by name..."
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

      {/* Main Content Area */}
      {renderContent()}
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

export default StudentDashboard;
