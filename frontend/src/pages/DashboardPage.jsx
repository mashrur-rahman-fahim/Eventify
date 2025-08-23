import React, { useContext, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import { Navbar } from "../components/Navbar";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isVerified, checkLogin, isAdmin } = useContext(VerifyContext);

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

      <main className="container mx-auto p-4 md:p-8">
        {isVerified && (isAdmin ? <AdminDashboard /> : <StudentDashboard />)}
      </main>
    </div>
  );
};
