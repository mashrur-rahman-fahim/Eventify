import React, { useState } from "react";
import { Link } from "react-router-dom";
import JoinRequestsManager from "./JoinRequestsManager";

export const ClubCard = ({ club, onLeave, onDelete, refreshClubs }) => {
  const [showJoinRequests, setShowJoinRequests] = useState(false);

  const handleRequestProcessed = () => {
    // Refresh the club data
    if (refreshClubs) {
      refreshClubs();
    }
    setShowJoinRequests(false);
  };

  return (
    <div className="card bg-base-100 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="card-body p-4">
        <Link to={`/club/${club._id}`} className="flex-grow">
          <h3 className="card-title text-lg">{club.name}</h3>
          <p className="text-sm text-base-content/60">Click to view details</p>
        </Link>

        {/* Join Requests Badge */}
        {club.joinRequests && club.joinRequests.length > 0 && (
          <div className="mt-2">
            <div className="badge badge-warning gap-2">
              {club.joinRequests.length} join request(s)
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-2 border-t border-base-200 pt-3">
          <button
            onClick={() => setShowJoinRequests(!showJoinRequests)}
            className="btn btn-xs btn-outline btn-secondary"
          >
            {showJoinRequests ? "Hide" : "Requests"}
          </button>
          <button
            onClick={() => onLeave(club._id)}
            className="btn btn-xs btn-outline btn-warning"
          >
            Leave
          </button>
          <Link
            to={`/club/edit/${club._id}`}
            className="btn btn-xs btn-outline btn-info"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(club._id)}
            className="btn btn-xs btn-outline btn-error"
          >
            Delete
          </button>
        </div>

        {/* Join Requests Manager */}
        {showJoinRequests && (
          <div className="mt-4 border-t border-base-200 pt-4">
            <JoinRequestsManager
              club={club}
              onRequestProcessed={handleRequestProcessed}
            />
          </div>
        )}
      </div>
    </div>
  );
};
