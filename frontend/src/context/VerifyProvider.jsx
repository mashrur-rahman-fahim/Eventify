import { useState, useEffect } from "react";
import api from "../utils/api";
import { VerifyContext } from "./VerifyContext";

export const VerifyProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const checkLogin = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/isLoggedIn");
      setIsVerified(true);

      if (response.data.role === 1) {
        setIsAdmin(true);
      }
    } catch (error) {
      setIsAdmin(false);
      setIsVerified(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsVerified(false);
    setIsAdmin(false);
  };

  // Auto-check login status on mount
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <VerifyContext.Provider
      value={{ isAdmin, isVerified, setIsVerified, isLoading, checkLogin, logout }}
    >
      {children}
    </VerifyContext.Provider>
  );
};
