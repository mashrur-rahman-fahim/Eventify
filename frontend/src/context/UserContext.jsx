import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/getUserProfile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const clearUser = () => {
    setUser(null);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    fetchUser,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
