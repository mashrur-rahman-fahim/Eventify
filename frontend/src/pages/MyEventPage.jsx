import React, { useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { VerifyContext } from "../context/VerifyContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import MyEvent from "../components/MyEvent";

export const MyEventPage = () => {
  const navigate = useNavigate();
  const { isVerified, checkLogin, isLoading } = useContext(VerifyContext);

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (!isVerified && !isLoading) {
      navigate("/login");
    }
  }, [isVerified, isLoading, navigate]);

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
        <MyEvent />
      </main>
    </div>
  );
};
