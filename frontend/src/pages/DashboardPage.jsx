import React, { useContext, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { isVerified, isLoading, checkLogin } = useContext(VerifyContext);
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);
  useEffect(() => {
    if (!isVerified && !isLoading) {
      navigate("/login");
    }
  }, [isVerified, isLoading, navigate]);

  const handleLogout = async () => {
    await api.get("/api/logout");
    navigate("/login");
  };
  return (
    <div className="bg-black text-white h-screen w-screen">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
