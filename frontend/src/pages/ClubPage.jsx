import React, { useContext, useEffect } from "react";
import { VerifyContext } from "../context/VerifyContext";
import { useNavigate } from "react-router-dom";
import { ClubAdmin } from "../components/ClubAdmin";
import { Navbar } from "../components/Navbar";
import api from "../utils/api";

export const ClubPage = () => {
  const { isAdmin, isVerified, isLoading, checkLogin } =
    useContext(VerifyContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if ((!isAdmin || !isVerified) && !isLoading) {
      navigate("/");
    }
  }, [isAdmin, isVerified, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/logout");
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar handleLogout={handleLogout} />

      <main className="container mx-auto p-4 md:p-8">
        {isVerified && isAdmin && <ClubAdmin />}
      </main>
    </div>
  );
};
