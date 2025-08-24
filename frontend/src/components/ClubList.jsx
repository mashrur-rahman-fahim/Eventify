import React, { useState } from "react";
import api from "../utils/api";
import { ClubCard } from "./ClubCard";
import ConfirmationModal from "./ConfirmationModal";

export const ClubList = ({ clubs, onClubAction, refreshClubs }) => {
  // Modal states
  const [leaveModal, setLeaveModal] = useState({
    isOpen: false,
    clubId: null,
    isLoading: false
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    clubId: null,
    isLoading: false
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: ""
  });

  const handleLeaveClub = (clubId) => {
    setLeaveModal({
      isOpen: true,
      clubId: clubId,
      isLoading: false
    });
  };

  const confirmLeaveClub = async () => {
    const { clubId } = leaveModal;
    setLeaveModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      await api.delete(`/api/club/leave/${clubId}`);
      onClubAction(clubId);
      
      // Close the modal
      setLeaveModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
    } catch (err) {
      console.error("Failed to leave club", err);
      
      // Close leave modal and show error modal
      setLeaveModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
      
      setErrorModal({
        isOpen: true,
        message: "Could not leave the club. Please try again."
      });
    }
  };

  const handleDeleteClub = (clubId) => {
    setDeleteModal({
      isOpen: true,
      clubId: clubId,
      isLoading: false
    });
  };

  const confirmDeleteClub = async () => {
    const { clubId } = deleteModal;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      await api.delete(`/api/club/delete/${clubId}`);
      onClubAction(clubId);
      
      // Close the modal
      setDeleteModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
    } catch (err) {
      console.error("Failed to delete club", err);
      
      // Close delete modal and show error modal
      setDeleteModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
      
      setErrorModal({
        isOpen: true,
        message: "Could not delete the club. Please try again."
      });
    }
  };

  const closeLeaveModal = () => {
    if (!leaveModal.isLoading) {
      setLeaveModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
    }
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        clubId: null,
        isLoading: false
      });
    }
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      message: ""
    });
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

      {/* Leave Club Modal */}
      <ConfirmationModal
        isOpen={leaveModal.isOpen}
        onClose={closeLeaveModal}
        onConfirm={confirmLeaveClub}
        title="Leave Club"
        message="Are you sure you want to leave this club? You will lose admin privileges and won't be able to manage the club anymore."
        confirmText="Leave Club"
        cancelText="Cancel"
        type="warning"
        isLoading={leaveModal.isLoading}
      />

      {/* Delete Club Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteClub}
        title="Delete Club"
        message="WARNING: Deleting a club is permanent and will remove all its events, members, and data. This action cannot be undone. Are you absolutely sure?"
        confirmText="Delete Club"
        cancelText="Cancel"
        type="error"
        isLoading={deleteModal.isLoading}
      />

      {/* Error Modal */}
      <ConfirmationModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        onConfirm={closeErrorModal}
        title="Error"
        message={errorModal.message}
        confirmText="OK"
        cancelText=""
        type="error"
        isLoading={false}
      />
    </div>
  );
};