import React, { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import { Navbar } from "../components/Navbar";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";
import api from "../utils/api";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isVerified, checkLogin, isAdmin, isLoading } =
    useContext(VerifyContext);

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (!isVerified && !isLoading) {
      navigate("/");
    }
  }, [isVerified, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/logout");
      if (res.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
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
