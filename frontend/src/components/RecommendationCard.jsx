import React from "react";
import { useNavigate } from "react-router-dom";

const RecommendationCard = ({
  event,
  type = "personalized",
  showScore = false,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getTypeIcon = () => {
    switch (type) {
      case "trending":
        return (
          <div className="flex items-center gap-1 text-orange-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118L10 13.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.643 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.691L9.049 2.927z" />
            </svg>
            <span className="text-xs font-medium">Trending</span>
          </div>
        );
      case "personalized":
        return (
          <div className="flex items-center gap-1 text-blue-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">For You</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-gray-600";
  };

  const handleClick = () => {
    navigate(`/event/${event._id}`);
  };

  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      {event.image?.url && (
        <figure className="relative">
          <img
            src={event.image.url}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">{getTypeIcon()}</div>
          {showScore && event.recommendationScore && (
            <div className="absolute top-3 right-3">
              <div
                className={`badge badge-sm ${getScoreColor(
                  event.recommendationScore
                )} bg-white text-xs font-bold`}
              >
                {Math.round(event.recommendationScore * 100)}%
              </div>
            </div>
          )}
        </figure>
      )}

      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <h3 className="card-title text-lg font-bold line-clamp-2">
            {event.title}
          </h3>
          {!event.image && (
            <div className="flex-shrink-0 ml-2">{getTypeIcon()}</div>
          )}
        </div>

        <p className="text-base-content/70 text-sm line-clamp-2 mt-2">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
            <span className="text-base-content/60">
              at {formatTime(event.time)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-base-content/70">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-outline text-xs">
                {event.category}
              </span>
              {event.clubId && (
                <span className="text-xs text-base-content/60">
                  by {event.clubId.name}
                </span>
              )}
            </div>

            {event.attendees && (
              <div className="text-xs text-base-content/60">
                {event.attendees.length} attending
              </div>
            )}
          </div>

          {showScore && event.recommendationScore && (
            <div className="mt-2 pt-2 border-t border-base-300">
              <div className="text-xs text-base-content/60">
                Recommendation Score:{" "}
                {(event.recommendationScore * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
