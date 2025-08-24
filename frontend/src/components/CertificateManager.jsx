import React, { useState, useEffect } from "react";
import api from "../utils/api";
import CertificateCard from "./CertificateCard";

const CertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, recent: 0 });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get("/api/certificates/user/all");
      const certs = response.data.certificates || [];
      setCertificates(certs);

      // Calculate stats
      const recentCerts = certs.filter((cert) => {
        const generated = new Date(cert.generatedAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return generated >= monthAgo;
      });

      setStats({
        total: certs.length,
        recent: recentCerts.length,
      });
    } catch (err) {
      setError("Failed to load certificates. Please try again.");
      console.error("Error fetching certificates:", err);
    }
  };

  const handleCertificateDownload = (certificate) => {
    console.log("Certificate downloaded:", certificate.certificateNumber);
  };

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
        <button className="btn btn-sm btn-outline" onClick={fetchCertificates}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Statistics */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            My Certificates
          </h1>
          <p className="text-base-content/70">
            Download and manage your certificates of participation for completed
            events.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
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
            <div className="stat-title">Total Certificates</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
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
            <div className="stat-title">This Month</div>
            <div className="stat-value text-secondary">{stats.recent}</div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-lg shadow-sm border border-base-200">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-base-content/40"
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
            <h3 className="text-2xl font-semibold mb-3">No Certificates Yet</h3>
            <p className="text-base-content/60 max-w-md mx-auto">
              You'll receive certificates here after attending events.
              Certificates are automatically generated when you complete an
              event.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/events" className="btn btn-primary">
              Browse Events
            </a>
            <a href="/my-events" className="btn btn-outline">
              View My Events
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDownload={handleCertificateDownload}
              />
            ))}
          </div>

          {/* Achievement Section */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary mb-2">
                  Professional Achievement
                </h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  Each certificate represents your active participation in
                  university events and contributes to your professional
                  development. These verified certificates can be used for
                  portfolios, academic requirements, or professional
                  recognition.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help Section */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <svg
            className="w-6 h-6 text-info mt-1"
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
            <h5 className="font-semibold text-info mb-2">
              About Your Certificates
            </h5>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>
                • Certificates are automatically generated after attending
                events
              </li>
              <li>• Each certificate includes a unique verification number</li>
              <li>• Downloaded certificates are in professional PDF format</li>
              <li>
                • Certificates can be verified through the university system
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManager;
