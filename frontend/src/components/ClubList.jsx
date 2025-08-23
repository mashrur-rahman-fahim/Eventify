import React from "react";
import api from "../utils/api";
import { ClubCard } from "./ClubCard";

export const ClubList = ({ clubs, onClubAction, refreshClubs }) => {
  const handleLeaveClub = async (clubId) => {
    if (
      window.confirm(
        "Are you sure you want to leave this club? You will lose admin privileges."
      )
    ) {
      try {
        await api.delete(`/api/club/leave/${clubId}`);
        onClubAction(clubId);
      } catch (err) {
        console.error("Failed to leave club", err);
        alert("Could not leave the club. Please try again.");
      }
    }
  };

  const handleDeleteClub = async (clubId) => {
    if (
      window.confirm(
        "WARNING: Deleting a club is permanent and will remove all its events. Are you sure?"
      )
    ) {
      try {
        await api.delete(`/api/club/delete/${clubId}`);
        onClubAction(clubId);
      } catch (err) {
        console.error("Failed to delete club", err);
        alert("Could not delete the club. Please try again.");
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">My Clubs</h2>
      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <ClubCard
              key={club._id}
              club={club}
              onLeave={handleLeaveClub}
              onDelete={handleDeleteClub}
              refreshClubs={refreshClubs}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg p-4 text-center shadow">
          <p>You are not yet an admin of any clubs.</p>
        </div>
      )}
    </div>
  );
};
