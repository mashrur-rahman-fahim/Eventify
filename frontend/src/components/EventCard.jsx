import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import CertificateGenerator from "./CertificateGenerator";

export const EventCard = ({ event }) => {
  const { isVerified } = useContext(VerifyContext);
  const navigate = useNavigate();

  // Helper function to format the date for better readability
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-transparent hover:border-primary transition-all duration-300">
      <figure className="h-56">
        {/* Use the event image, or a unique placeholder if none exists */}
        <img
          src={
            event.image?.url ||
            `https://picsum.photos/seed/${event._id}/600/400`
          }
          alt={`Poster for ${event.title}`}
          className="h-full w-full object-cover"
        />
      </figure>

      <div className="card-body p-6">
        <div className="flex justify-between items-center">
          <div className="badge badge-secondary font-semibold">
            {event.category}
          </div>
          <p className="text-sm font-medium text-base-content/80">
            {formatDate(event.date)}
          </p>
        </div>

        <h2 className="card-title mt-2">{event.title}</h2>

        <div className="flex items-center gap-2 text-base-content/70 mt-1">
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
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-base-content/70">
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
          <span>{event.location}</span>
        </div>

        {/* Certificate Section - Enhanced */}
        {isVerified && event.registration && (
          <div className="mt-4 pt-4 border-t border-base-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content/80">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Certificate Status
              </div>
              <CertificateGenerator
                event={event}
                registration={event.registration}
                onCertificateGenerated={(certificate) => {
                  console.log("Certificate generated:", certificate);
                  // Could trigger a refresh of the event data here
                }}
              />
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          {isVerified ? (
            <Link to={`/event/${event._id}`} className="btn btn-primary">
              View Details
            </Link>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-outline"
            >
              Login to Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
