import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

const MyEvent = () => {
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch events function
  const fetchEvents = useCallback(
    async (page = 1, search = "", category = "all", status = "all") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: eventsPerPage.toString(),
        });

        // Only add status if not "all"
        if (status !== "all") {
          params.append("status", status);
        }

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (category !== "all") {
          params.append("category", category);
        }

        const response = await api.get(`/api/event/user?${params}`);

        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError("Failed to load your events. Please try again.");
        console.error("Error fetching user events:", err);
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
      const response = await api.get("/api/event/user/categories");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Error fetching user event categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents(1, "", "all", "all");
    fetchCategories();
  }, [fetchEvents, fetchCategories]);

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchTerm.trim()) {
        await fetchEvents(1, "", selectedCategory, selectedStatus);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        await fetchEvents(1, searchTerm, selectedCategory, selectedStatus);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchEvents, selectedCategory, selectedStatus]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = async (pageNumber) => {
    await fetchEvents(pageNumber, searchTerm, selectedCategory, selectedStatus);
  };

  // Handle category filter
  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    await fetchEvents(1, searchTerm, category, selectedStatus);
  };

  // Handle status filter
  const handleStatusFilter = async (status) => {
    setSelectedStatus(status);
    await fetchEvents(1, searchTerm, selectedCategory, status);
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
      if (searchTerm || selectedCategory !== "all") {
        return (
          <div className="text-center py-8 md:py-16 bg-base-100 rounded-lg shadow">
            <h2 className="text-xl md:text-2xl font-semibold">
              No Events Found
            </h2>
            <p className="text-base-content/60 mt-2 text-sm md:text-base">
              No events match your current filters. Try adjusting your search
              criteria.
            </p>
          </div>
        );
      }
      return (
        <div className="text-center py-8 md:py-16 bg-base-100 rounded-lg shadow">
          <h2 className="text-xl md:text-2xl font-semibold">No Events Found</h2>
          <p className="text-base-content/60 mt-2 text-sm md:text-base">
            You haven't created, joined, or been invited to any events yet.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {events.map((event) => (
            <div key={event._id} className="relative">
              <EventCard event={event} />
              {/* Role badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`badge badge-sm ${
                    event.userRole === "creator"
                      ? "badge-primary"
                      : event.userRole === "admin"
                      ? "badge-secondary"
                      : "badge-accent"
                  }`}
                >
                  {event.userRole === "creator"
                    ? "Creator"
                    : event.userRole === "admin"
                    ? "Admin"
                    : "Attendee"}
                </span>
              </div>
            </div>
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
          My Events
        </h1>
        <p className="text-base-content/70 mt-2 text-sm sm:text-base">
          Manage and view all your events - created, administered, or attended.
        </p>

        {/* Search and Filter Section */}
        <div className="mt-4 md:mt-6 space-y-4">
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow min-w-0"
                  placeholder="Search your events by name..."
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
          </div>

          {/* Category and Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex gap-2 min-w-0">
              <select
                className="select select-bordered w-full sm:w-auto"
                onChange={(e) => handleCategoryFilter(e.target.value)}
                value={selectedCategory}
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

              <select
                className="select select-bordered w-full sm:w-auto"
                onChange={(e) => handleStatusFilter(e.target.value)}
                value={selectedStatus}
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
                <option value="active">Active Registration</option>
                <option value="created">Created by Me</option>
                <option value="admin">Admin Events</option>
                <option value="attending">Attending</option>
              </select>
            </div>
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

export default MyEvent;
