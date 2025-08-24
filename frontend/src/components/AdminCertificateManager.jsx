import React, { useState } from "react";
import api from "../utils/api";
import { appToasts } from "../utils/toast";

const AdminCertificateManager = ({ event }) => {
  const [certificates, setCertificates] = useState([]);
  const [showCertificates, setShowCertificates] = useState(false);
  const [stats, setStats] = useState({ generated: 0, pending: 0 });

  const generateAllCertificates = async () => {
    try {
      const response = await api.post(
        `/api/certificates/event/${event._id}/generate-all`
      );

      if (response.data.success) {
        setCertificates(response.data.generatedCertificates);
        setStats({
          generated: response.data.generatedCertificates.length,
          pending: 0,
        });
        setShowCertificates(true);

        appToasts.certificateGenerated(
          `${response.data.generatedCertificates.length} certificates`
        );
      }
    } catch (error) {
      console.error("Error generating certificates:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to generate certificates. Please try again.";
      appToasts.serverError();
    }
  };

  const fetchEventCertificates = async () => {
    try {
      const response = await api.get(`/api/certificates/event/${event._id}`);

      if (response.data.success) {
        setCertificates(response.data.certificates);
        setStats({
          generated: response.data.certificates.length,
          pending: 0, // Calculate based on attendees vs certificates
        });
        setShowCertificates(true);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      appToasts.serverError();
    }
  };

  const downloadCertificate = async (certificateId, participantName) => {
    try {
      const response = await api.get(
        `/api/certificates/download/${certificateId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${participantName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      appToasts.serverError();
    }
  };

  const deleteCertificate = async (certificateId, participantName) => {
    try {
      const response = await api.delete(`/api/certificates/${certificateId}`);

      if (response.data.success) {
        appToasts.certificateDeleted(participantName);
        // Remove the deleted certificate from the state
        setCertificates((prevCertificates) =>
          prevCertificates.filter((cert) => cert.id !== certificateId)
        );
        // Update stats
        setStats((prevStats) => ({
          generated: prevStats.generated - 1,
          pending: prevStats.pending,
        }));
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      appToasts.serverError();
    }
  };

  const isEventCompleted = () => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate < now;
  };

  if (!isEventCompleted()) {
    return (
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-info"
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
          <div>
            <span className="text-sm font-medium text-info">
              Certificate Generation Available After Event
            </span>
            <p className="text-xs text-base-content/60 mt-1">
              Certificates can be generated once the event has ended and
              attendance is marked.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Certificate Management Header */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
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
              Certificate Management
            </h3>
            <p className="text-sm text-base-content/70 mt-1">
              Generate and manage certificates for event participants
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchEventCertificates}
              className="btn btn-outline btn-sm gap-2"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Certificates
            </button>

            <button
              onClick={generateAllCertificates}
              className="btn btn-primary btn-sm gap-2"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Generate All Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {showCertificates && (
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <svg
                className="w-8 h-8"
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
            </div>
            <div className="stat-title">Generated</div>
            <div className="stat-value text-success">{stats.generated}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <svg
                className="w-8 h-8"
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
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{stats.pending}</div>
          </div>
        </div>
      )}

      {/* Certificates List */}
      {showCertificates && (
        <div className="bg-base-100 rounded-lg shadow-sm border border-base-200">
          <div className="p-6">
            <h4 className="text-md font-semibold mb-4">
              Generated Certificates ({certificates.length})
            </h4>

            {certificates.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-base-content/60">
                  No certificates have been generated yet.
                </p>
                <p className="text-sm text-base-content/50 mt-1">
                  Click "Generate All Certificates" to create certificates for
                  attended participants.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="flex items-center justify-between p-4 bg-base-50 rounded-lg border border-base-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-primary"
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
                      </div>
                      <div>
                        <div className="font-medium">
                          {certificate.participantName}
                        </div>
                        <div className="text-sm text-base-content/60 font-mono">
                          #{certificate.certificateNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          downloadCertificate(
                            certificate.id,
                            certificate.participantName
                          )
                        }
                        className="btn btn-sm btn-outline gap-2 hover:btn-primary"
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
                        <span className="hidden sm:inline">Download</span>
                        <span className="sm:hidden">DL</span>
                      </button>
                      <button
                        onClick={() =>
                          deleteCertificate(
                            certificate.id,
                            certificate.participantName
                          )
                        }
                        className="btn btn-sm btn-outline gap-2 hover:btn-error"
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
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Del</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-base-200/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-info mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h5 className="font-medium text-info mb-1">
              Certificate Generation Notes
            </h5>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>
                • Certificates are generated only for participants marked as
                "attended"
              </li>
              <li>
                • Each certificate includes participant details, event
                information, and verification number
              </li>
              <li>
                • Generated certificates can be downloaded individually or
                accessed by participants
              </li>
              <li>
                • All certificates include university branding and are in
                professional PDF format
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCertificateManager;
