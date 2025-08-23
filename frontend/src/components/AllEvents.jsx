import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [eventsPerPage] = useState(12);

  // Fetch events function
  const fetchEvents = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: eventsPerPage.toString(),
        });

        if (search.trim()) {
          params.append("search", search.trim());
        }

        const response = await api.get(`/api/event/future?${params}`);

        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError("Failed to load events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    },
    [eventsPerPage]
  );

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.get("/api/event/categories");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents(1, "");
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (!searchValue.trim()) {
        await fetchEvents(1, "");
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        await fetchEvents(1, searchValue);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [fetchEvents]
  );

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = async (pageNumber) => {
    await fetchEvents(pageNumber, searchTerm);
  };

  // Handle category filter
  const handleCategoryFilter = async (category) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: eventsPerPage.toString(),
      });

      if (category !== "all") {
        params.append("category", category);
      }

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const response = await api.get(`/api/event/future?${params}`);

      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to filter events. Please try again.");
      console.error("Error filtering events:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
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
            className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6"
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
          <span className="text-sm sm:text-base">{error}</span>
        </div>
      );
    }

    if (events.length === 0) {
      if (searchTerm) {
        return (
          <div className="text-center py-8 md:py-16 bg-base-100 rounded-lg shadow">
            <h2 className="text-xl md:text-2xl font-semibold">
              No Events Found
            </h2>
            <p className="text-base-content/60 mt-2 text-sm md:text-base">
              No events match your search criteria. Try different keywords.
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-8 md:py-16 bg-base-100 rounded-lg shadow">
          <h2 className="text-xl md:text-2xl font-semibold">
            No Future Events Found
          </h2>
          <p className="text-base-content/60 mt-2 text-sm md:text-base">
            No upcoming events available at the moment. Check back later for new
            events.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="join join-horizontal">
              <button
                className="join-item btn btn-sm sm:btn-md"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>

              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`join-item btn btn-sm sm:btn-md ${
                      currentPage === pageNum ? "btn-active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    <span className="hidden sm:inline">{pageNum}</span>
                    <span className="sm:hidden">{pageNum}</span>
                  </button>
                );
              })}

              <button
                className="join-item btn btn-sm sm:btn-md"
                onClick={() => handlePageChange(currentPage + 1)}
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
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          All Events
        </h1>
        <p className="text-base-content/70 mt-2 text-sm sm:text-base">
          Browse all upcoming events across campus.
        </p>

        {/* Search and Filter Section */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <input
                type="text"
                className="grow min-w-0"
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
                  className="w-4 h-4 opacity-70 flex-shrink-0"
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

          {/* Category Filter */}
          <div className="flex gap-2 min-w-0">
            <select
              className="select select-bordered w-full sm:w-auto"
              onChange={(e) => handleCategoryFilter(e.target.value)}
              defaultValue="all"
              disabled={categoriesLoading}
            >
              <option value="all">
                {categoriesLoading ? "Loading..." : "All Categories"}
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        {!loading && events.length > 0 && (
          <div className="mt-3 md:mt-4 text-xs sm:text-sm text-base-content/60">
            Showing {events.length} of {total} events
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>

      {/* Main Content */}
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

export default AllEvents;
