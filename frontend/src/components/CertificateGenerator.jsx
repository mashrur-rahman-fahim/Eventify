import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { appToasts } from "../utils/toast";

const CertificateGenerator = ({
  event,
  registration,
  onCertificateGenerated,
}) => {
  const [certificateStatus, setCertificateStatus] = useState(null);
  const [certificateId, setCertificateId] = useState(null);

  useEffect(() => {
    if (registration) {
      setCertificateStatus(
        registration.certificateGenerated ? "generated" : "not_generated"
      );
      setCertificateId(registration.certificateId);
    }
  }, [registration]);

  const canGenerateCertificate = () => {
    if (!event || !registration) return false;

    // Check if event has ended
    const eventDate = new Date(event.date);
    const now = new Date();
    const hasEventEnded = eventDate < now;

    // Check if user attended the event
    const hasAttended = registration.status === "attended";

    return hasEventEnded && hasAttended && certificateStatus !== "generated";
  };

  const generateCertificate = async () => {
    try {
      const response = await api.post(
        `/api/certificates/generate/${registration._id}`
      );

      if (response.data.success) {
        setCertificateStatus("generated");
        setCertificateId(response.data.certificate.id);

        if (onCertificateGenerated) {
          onCertificateGenerated(response.data.certificate);
        }

        appToasts.certificateGenerated(event.title);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to generate certificate. Please try again.";
      appToasts.serverError();
    }
  };

  const downloadCertificate = async () => {
    if (!certificateId) return;

    try {
      const response = await api.get(
        `/api/certificates/download/${certificateId}`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download the file
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${event.title.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.pdf`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      appToasts.serverError();
    }
  };

  const getEventStatus = () => {
    if (!event) return "unknown";

    const eventDate = new Date(event.date);
    const now = new Date();

    if (eventDate > now) return "upcoming";
    if (eventDate < now) return "ended";
    return "ongoing";
  };

  const getAttendanceStatus = () => {
    if (!registration) return "not-registered";
    return registration.status;
  };

  const renderCertificateStatus = () => {
    const eventStatus = getEventStatus();
    const attendanceStatus = getAttendanceStatus();

    // Event hasn't ended yet
    if (eventStatus === "upcoming" || eventStatus === "ongoing") {
      return (
        <div className="flex items-center gap-2 text-sm text-base-content/60 bg-base-200/50 p-3 rounded-lg">
          <svg
            className="w-4 h-4 text-warning"
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
          <span>Certificate will be available after event completion</span>
        </div>
      );
    }

    // Event ended but user didn't attend
    if (attendanceStatus !== "attended") {
      return (
        <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 p-3 rounded-lg border border-warning/20">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span>
            {attendanceStatus === "registered"
              ? "Certificate requires event attendance confirmation"
              : "Certificate not available - attendance not confirmed"}
          </span>
        </div>
      );
    }

    // User attended and certificate is available for download
    if (certificateStatus === "generated") {
      return (
        <div className="bg-success/10 border border-success/20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-success">
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="font-medium">Certificate Available</span>
            </div>

            <button
              onClick={downloadCertificate}
              className="btn btn-success btn-xs gap-1"
            >
              <svg
                className="w-3 h-3"
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
              Download
            </button>
          </div>
        </div>
      );
    }

    // User attended but certificate not generated yet
    if (canGenerateCertificate()) {
      return (
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-primary">
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              <span className="font-medium">Ready to Generate Certificate</span>
            </div>

            <button
              onClick={generateCertificate}
              className="btn btn-primary btn-xs gap-1"
            >
              <svg
                className="w-3 h-3"
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
              Generate
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-base-content/60 bg-base-200/50 p-3 rounded-lg">
        <svg
          className="w-4 h-4 text-info"
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
        <span>Certificate status being verified...</span>
      </div>
    );
  };

  return (
    <div className="certificate-generator w-full">
      {renderCertificateStatus()}
    </div>
  );
};

export default CertificateGenerator;
