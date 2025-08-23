import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { EventCard } from "../EventCard";
import { EventCardSkeleton } from "../EventCardSkeleton";
import RecommendationsSection from "../RecommendationsSection";

const StudentDashboard = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/event/featured");
        setFeaturedEvents(response.data.events);
        setFilteredEvents(response.data.events);
      } catch (err) {
        setError("Failed to load featured events. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedEvents();
  }, []);

  // Effect for debounced search
  useEffect(() => {
    const searchFunction = async (searchValue) => {
      if (!searchValue.trim()) {
        setFilteredEvents(featuredEvents);
        setIsSearching(false);
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
      } catch (err) {
        console.error("Search error:", err);
        // Fallback to client-side filtering if API fails
        const filtered = featuredEvents.filter((event) =>
          event.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredEvents(filtered);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchFunction(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, featuredEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Since we're only showing featured events (max 10), no pagination needed
  const currentEvents = filteredEvents;

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
          <h2 className="text-2xl font-semibold">No Featured Events Found</h2>
          <p className="text-base-content/60 mt-2">
            No featured events available at the moment. Check back later for new
            events.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-base-content/70">
          Discover events tailored to your interests and explore what's
          happening across campus.
        </p>
      </div>

      {/* Recommendations Section */}
      <RecommendationsSection />

      {/* Featured Events Section */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Featured Events</h2>
          <p className="text-base-content/70">
            Latest top events happening across campus.
          </p>

          {/* Search Input */}
          <div className="mt-4 max-w-md">
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

        {/* Featured Events Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
