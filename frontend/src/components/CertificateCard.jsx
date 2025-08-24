import React, { useState } from "react";
import api from "../utils/api";
import { appToasts } from "../utils/toast";

const CertificateCard = ({ certificate, onDownload, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/api/certificates/download/${certificate.id}`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download the file
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${certificate.certificateNumber}.pdf`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);

      if (onDownload) {
        onDownload(certificate);
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      appToasts.serverError();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/api/certificates/${certificate.id}`);

      if (response.data.success) {
        appToasts.certificateDeleted(certificate.eventTitle);
        if (onDelete) {
          onDelete(certificate.id);
        }
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      appToasts.serverError();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 group">
        <div className="card-body p-6">
          {/* Certificate Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="badge badge-primary badge-sm sm:badge-lg gap-1 sm:gap-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
              <span className="hidden xs:inline">Certificate</span>
              <span className="xs:hidden">Cert</span>
            </div>
            <div className="text-xs sm:text-sm text-base-content/60 font-mono">
              #{certificate.certificateNumber}
            </div>
          </div>

          {/* Event Title */}
          <h3 className="card-title text-base sm:text-lg mb-3 text-base-content group-hover:text-primary transition-colors">
            {certificate.eventTitle}
          </h3>

          {/* Event Details Grid */}
          <div className="space-y-2 sm:space-y-3 mb-4">
            <div className="flex items-center text-xs sm:text-sm text-base-content/70">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-primary flex-shrink-0"
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
              <span className="font-medium">Event Date:</span>
              <span className="ml-1 sm:ml-2">
                {formatDate(certificate.eventDate)}
              </span>
            </div>

            <div className="flex items-center text-xs sm:text-sm text-base-content/70">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-secondary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="font-medium">Organized by:</span>
              <span className="ml-1 sm:ml-2">{certificate.clubName}</span>
            </div>

            <div className="flex items-center text-xs sm:text-sm text-base-content/70">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-accent flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Generated:</span>
              <span className="ml-1 sm:ml-2">
                {formatDate(certificate.generatedAt)}
              </span>
            </div>
          </div>

          {/* Certificate Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-base-200 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">
                Verified Certificate
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="btn btn-primary btn-sm gap-2 hover:shadow-lg transition-all w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden xs:inline">Download PDF</span>
                <span className="xs:hidden">Download</span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-error btn-sm gap-2 hover:shadow-lg transition-all w-full sm:w-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden xs:inline">Delete</span>
                <span className="xs:hidden">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm mx-auto">
            <h3 className="font-bold text-lg mb-4">Delete Certificate</h3>
            <p className="py-4 text-sm sm:text-base">
              Are you sure you want to delete the certificate for{" "}
              <strong>{certificate.eventTitle}</strong>? This action cannot be
              undone.
            </p>
            <div className="modal-action flex-col sm:flex-row gap-2">
              <button
                className="btn btn-outline w-full sm:w-auto"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error w-full sm:w-auto"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="hidden sm:inline">Deleting...</span>
                    <span className="sm:hidden">Deleting</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Delete Certificate</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;
