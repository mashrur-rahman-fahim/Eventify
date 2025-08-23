import React, { useState, useEffect } from "react";
import { recommendationAPI } from "../utils/api";
import RecommendationCard from "./RecommendationCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

const RecommendationsSection = () => {
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personalized");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await recommendationAPI.getDashboardRecommendations(
          6,
          4
        );

        setRecommendations({
          personalized: response.data.personalized || [],
          trending: response.data.trending || [],
        });
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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

    const currentRecommendations = recommendations[activeTab];

    if (currentRecommendations.length === 0) {
      return (
        <div className="text-center py-16 bg-base-100 rounded-lg shadow">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-base-content/30 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "personalized"
                ? "No Personalized Recommendations Yet"
                : "No Trending Events"}
            </h3>
            <p className="text-base-content/60">
              {activeTab === "personalized"
                ? "Register for some events to get personalized recommendations based on your interests!"
                : "No events are trending right now. Check back later for popular events."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecommendations.map((event) => (
          <RecommendationCard
            key={event._id}
            event={event}
            type={activeTab}
            showScore={activeTab === "personalized"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Recommended Events</h2>
          <p className="text-base-content/70 mt-1">
            Discover events tailored to your interests
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${
              activeTab === "personalized" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("personalized")}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            For You
          </button>
          <button
            className={`tab ${activeTab === "trending" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("trending")}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118L10 13.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.643 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.691L9.049 2.927z" />
            </svg>
            Trending
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="mb-6">
          <div className="stats stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-title">Personalized</div>
              <div className="stat-value text-2xl text-blue-600">
                {recommendations.personalized.length}
              </div>
              <div className="stat-desc">recommendations for you</div>
            </div>

            <div className="stat">
              <div className="stat-title">Trending</div>
              <div className="stat-value text-2xl text-orange-600">
                {recommendations.trending.length}
              </div>
              <div className="stat-desc">popular events</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default RecommendationsSection;
