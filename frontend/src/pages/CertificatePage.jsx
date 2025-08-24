import React, { useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { VerifyContext } from "../context/VerifyContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import CertificateManager from "../components/CertificateManager";

export const CertificatePage = () => {
  const navigate = useNavigate();
  const { isVerified, checkLogin } = useContext(VerifyContext);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (!isVerified) {
      navigate("/login");
    }
  }, [isVerified, navigate]);

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar handleLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <CertificateManager />
      </main>
    </div>
  );
};
